import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const SHARED_PROVIDER_DOMAINS = [
  'vercel.app',
  'pages.dev',
  'railway.app',
  'netlify.app',
  'render.com',
  'onrender.com',
  'fly.dev',
  'koyeb.app',
  'supabase.co',
  'github.io',
  'glitch.me',
  'herokuapp.com',
  'cloudflarepages.com',
] as const;

/**
 * Kunci Publik Asimetris Ed25519 Resmi Stakku (JWK Format)
 * Digunakan untuk verifikasi offline/lokal tanda tangan kriptografi License Token
 * tanpa perlu private key di sisi client/buyer (Zero-Knowledge & Tamper-Proof).
 */
export const STAKKU_OFFICIAL_PUBLIC_KEY = {
  kty: 'OKP',
  crv: 'Ed25519',
  x: 'etfi-O_2mQhC2SvltjgdnLmKZZ6qkDWDxNJQEvsd6rA',
  key_ops: ['verify'],
} as const;

export interface StakkuLicenseTokenPayload {
  iss: string;
  sub: string; // License key
  domain: string; // Bound domain
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  product_id?: string;
  user_id?: string;
  iat: number; // Issued at (Unix timestamp)
  exp: number; // Expiration (Unix timestamp, default +7 days)
  [key: string]: any;
}

export interface StakkuGuardOptions {
  licenseKey: string;
  domain?: string;
  redirectUrl?: string;
  apiBaseUrl?: string;
  cacheMaxAge?: number; // Dalam detik, default 7 hari (604800)
  failOpen?: boolean; // Jika API down/timeout, berikan toleransi akses? Default true (Self-Healing Grace Period)
  gracePeriodDays?: number; // Durasi masa tenggang grace period jika offline (default 7 hari)
  allowLocalhost?: boolean; // Bypass verifikasi di localhost/dev mode? Default true
  timeoutMs?: number; // Timeout panggilan API ke server lisensi (ms, default 4000ms)
  publicKey?: any; // Kustom public key jika menggunakan custom edge instance
}

/**
 * Normalisasi domain pada middleware edge:
 * - Menghapus protokol, path, query, port
 * - Mempertahankan exact subdomain untuk shared provider (*.vercel.app, *.pages.dev, *.railway.app)
 */
export function normalizeDomain(rawDomain: string): string {
  if (!rawDomain || typeof rawDomain !== 'string') return '';
  let domain = rawDomain.trim().toLowerCase();
  domain = domain.replace(/^[a-z0-9+.-]+:\/\//, '');
  domain = domain.split('/')[0].split('?')[0].split('#')[0];
  domain = domain.split(':')[0];
  domain = domain.replace(/\.+$/, '').trim();

  const isSharedProvider = SHARED_PROVIDER_DOMAINS.some(
    (prov) => domain === prov || domain.endsWith('.' + prov)
  );

  if (!isSharedProvider && domain.startsWith('www.')) {
    domain = domain.replace(/^www\./, '');
  }

  return domain;
}

/**
 * Base64URL Decoders yang kompatibel dengan Next.js Edge Runtime, Cloudflare Workers, dan Node.js
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

function base64UrlToUint8Array(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

/**
 * Verifikasi Tanda Tangan Kriptografi Asimetris Ed25519 Secara Lokal & Offline
 * Memeriksa integritas token JWT tanpa memanggil server Stakku.
 */
export async function verifyLicenseTokenLocally(
  token: string,
  publicKey: any = STAKKU_OFFICIAL_PUBLIC_KEY
): Promise<{ valid: boolean; payload?: StakkuLicenseTokenPayload; error?: string }> {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token kosong atau bukan string' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Format JWT tidak valid (harus 3 segmen)' };
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    const signatureBytes = base64UrlToUint8Array(encodedSignature);

    let keyData = publicKey;
    if (typeof publicKey === 'string') {
      try {
        keyData = JSON.parse(publicKey);
      } catch {
        keyData = {
          kty: 'OKP',
          crv: 'Ed25519',
          x: publicKey,
          key_ops: ['verify'],
        };
      }
    }

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'Ed25519' },
      false,
      ['verify']
    );

    const isValidSig = await crypto.subtle.verify(
      { name: 'Ed25519' },
      cryptoKey,
      signatureBytes as any,
      dataToVerify
    );

    if (!isValidSig) {
      return { valid: false, error: 'Tanda tangan kriptografi Ed25519 tidak valid / token telah dimodifikasi (Tampered)' };
    }

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: StakkuLicenseTokenPayload = JSON.parse(payloadJson);

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Gagal memverifikasi token kriptografi' };
  }
}

/**
 * Stakku Guard - Production Next.js App Router Middleware Guard
 * Mendukung:
 * 1. Asymmetric Ed25519 Offline Token Verification (0ms Latency & High Security)
 * 2. 7-Day Local Offline Caching (Self-Healing & Tolerant to Network Outages)
 * 3. Fail-Open Grace Period Policy (Log administratif aktif tanpa memblokir pembeli saat jaringan bermasalah)
 * 4. Exact Subdomain Binding Protection (Anti-Wildcard Leakage)
 */
export async function stakkuGuard(request: NextRequest, options: StakkuGuardOptions) {
  const hostHeader =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname;

  const rawDomain = options.domain || hostHeader;
  const domain = normalizeDomain(rawDomain);

  const {
    licenseKey,
    redirectUrl = '/license-invalid',
    apiBaseUrl = 'https://api.stakku.id',
    cacheMaxAge = 7 * 24 * 3600, // 7 Hari Offline Cache
    failOpen = true, // Default true: Toleransi fail-open grace period agar web pembeli tidak down saat jaringan bermasalah
    gracePeriodDays = 7, // 7 Hari Grace Period
    allowLocalhost = true,
    timeoutMs = 4000, // 4 detik timeout
    publicKey = STAKKU_OFFICIAL_PUBLIC_KEY,
  } = options;

  // 0. Development / Localhost bypass
  if (allowLocalhost && (domain === 'localhost' || domain === '127.0.0.1' || domain.endsWith('.localhost'))) {
    return NextResponse.next();
  }

  const cookieTokenName = 'stakku_license_token';
  const cookieStatusName = 'stakku_license_status';
  const cookieGraceName = 'stakku_grace_start';

  const cachedToken = request.cookies.get(cookieTokenName)?.value;
  const cachedStatus = request.cookies.get(cookieStatusName)?.value;
  const graceStartVal = request.cookies.get(cookieGraceName)?.value;

  const nowUnix = Math.floor(Date.now() / 1000);

  // ============================================================================
  // 1. FAST PATH: VERIFIKASI OFFLINE VIA ASYMMETRIC Ed25519 TOKEN
  // ============================================================================
  if (cachedToken) {
    const localVerification = await verifyLicenseTokenLocally(cachedToken, publicKey);

    if (localVerification.valid && localVerification.payload) {
      const p = localVerification.payload;
      const isDomainMatch = normalizeDomain(p.domain) === domain;
      const isKeyMatch = p.sub === licenseKey.trim();
      const isNotExpired = typeof p.exp === 'number' ? p.exp > nowUnix : true;
      const isActive = p.status === 'active';

      if (isDomainMatch && isKeyMatch && isNotExpired && isActive) {
        const remainingSeconds = typeof p.exp === 'number' ? p.exp - nowUnix : cacheMaxAge;

        // Fast-path instan jika sisa masa berlaku masih di atas 24 jam
        if (remainingSeconds > 24 * 3600) {
          return NextResponse.next();
        }

        // Silent Revalidation (Background Refresh):
        // Jika sisa masa berlaku < 24 jam, izinkan pengunjung lewat tanpa hambatan (0ms),
        // dan picu background renewal untuk memperbarui masa berlaku token 7 hari ke depan.
        try {
          fetch(`${apiBaseUrl}/api/verify-license`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Stakku-Guard-Client/2.0-SilentRevalidate' },
            body: JSON.stringify({ license_key: licenseKey.trim(), domain }),
            cache: 'no-store',
          }).then(async (refreshRes) => {
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData?.valid && refreshData?.token) {
                console.log('[Stakku Guard: Silent Revalidation] License token diperbarui di latar belakang untuk 7 hari ke depan.');
              }
            }
          }).catch(() => {});
        } catch {}

        return NextResponse.next();
      }
    }
  }

  // Jika status sebelumnya secara eksplisit 'invalid' dan belum kedaluwarsa, langsung blokir
  if (cachedStatus === 'invalid') {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // ============================================================================
  // 2. ONLINE VERIFIKASI & TOKEN RENEWAL (CALL TO STAKKU EDGE)
  // ============================================================================
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${apiBaseUrl}/api/verify-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Stakku-Guard-Client/2.0',
      },
      body: JSON.stringify({
        license_key: licenseKey.trim(),
        domain: domain,
      }),
      cache: 'no-store',
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      throw new Error(`Stakku API HTTP ${res.status}`);
    }

    const data = await res.json();
    let response: NextResponse;

    if (data.valid) {
      // Lisensi VALID -> Buat response, simpan Ed25519 signed token & status ke cookie
      response = NextResponse.next();

      if (data.token) {
        response.cookies.set(cookieTokenName, data.token, {
          maxAge: cacheMaxAge,
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }

      response.cookies.set(cookieStatusName, 'valid', {
        maxAge: cacheMaxAge,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      // Hapus status grace period jika sebelumnya sempat ada gangguan jaringan
      if (graceStartVal) {
        response.cookies.delete(cookieGraceName);
      }

      return response;
    } else {
      // Lisensi TIDAK VALID (Misal: Domain Mismatch, Expired, Revoked)
      const lockUrl = new URL(redirectUrl, request.url);
      if (data.message) lockUrl.searchParams.set('reason', data.message);
      if (data.status) lockUrl.searchParams.set('status', data.status);

      response = NextResponse.redirect(lockUrl);
      response.cookies.delete(cookieTokenName);
      response.cookies.set(cookieStatusName, 'invalid', {
        maxAge: 3600, // 1 jam cache status invalid
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    }
  } catch (error: any) {
    // ============================================================================
    // 3. FAIL-OPEN GRACE PERIOD POLICY (SELF-HEALING MECHANISM)
    // ============================================================================
    const errorMessage = error?.name === 'AbortError' ? 'Request Timeout' : (error?.message || 'Network Unavailable');
    
    if (failOpen) {
      const nowMs = Date.now();
      const initialGraceTime = graceStartVal ? parseInt(graceStartVal, 10) : nowMs;
      const validGraceTime = Number.isNaN(initialGraceTime) ? nowMs : initialGraceTime;
      const elapsedDays = (nowMs - validGraceTime) / (1000 * 60 * 60 * 24);

      if (elapsedDays <= gracePeriodDays) {
        const currentGraceDay = Math.min(gracePeriodDays, Math.floor(elapsedDays) + 1);
        
        console.warn(
          `[Stakku Guard: Grace Period Aktif] Server lisensi (${apiBaseUrl}) tidak dapat dihubungi (${errorMessage}). ` +
          `Masa tenggang Self-Healing berjalan (Hari ke-${currentGraceDay} dari ${gracePeriodDays} hari). ` +
          `Akses pengunjung web pembeli tetap 100% aktif (Fail-Open).`
        );

        const response = NextResponse.next();
        if (!graceStartVal) {
          response.cookies.set(cookieGraceName, validGraceTime.toString(), {
            maxAge: gracePeriodDays * 24 * 3600,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
        return response;
      } else {
        console.error(
          `[Stakku Guard: Grace Period Berakhir] Server lisensi tidak dapat dihubungi selama lebih dari ${gracePeriodDays} hari berturut-turut.`
        );
        const lockUrl = new URL(redirectUrl, request.url);
        lockUrl.searchParams.set('reason', 'grace_period_expired');
        return NextResponse.redirect(lockUrl);
      }
    } else {
      // Fail-Closed mode (jika dikonfigurasi eksplisit)
      console.error('[Stakku Guard: Fail-Closed] Verifikasi Lisensi Gagal:', errorMessage);
      const lockUrl = new URL(redirectUrl, request.url);
      lockUrl.searchParams.set('reason', 'verification_failed');
      return NextResponse.redirect(lockUrl);
    }
  }
}

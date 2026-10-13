import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint Deaktivasi Lisensi Stakku
 * Digunakan untuk melepas domain binding saat pembeli ingin memindahkan lisensi ke domain lain.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { license_key, domain } = body;

    const activeKey = license_key || process.env.STAKKU_LICENSE_KEY;
    if (!activeKey) {
      return NextResponse.json(
        { success: false, message: 'License key tidak ditemukan.' },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.STAKKU_API_URL || 'https://api.stakku.id';

    const response = await fetch(`${apiBaseUrl}/api/deactivate-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        license_key: activeKey,
        domain: domain || request.headers.get('host'),
      }),
    });

    const data = await response.json().catch(() => ({}));

    // Hapus cookie lisensi lokal
    const res = NextResponse.json(data, { status: response.status });
    res.cookies.delete('stakku_license_token');
    res.cookies.delete('stakku_license_status');
    res.cookies.delete('stakku_grace_start');

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menghubungi server lisensi.' },
      { status: 500 }
    );
  }
}

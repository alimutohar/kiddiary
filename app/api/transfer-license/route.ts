import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint Transfer Lisensi Stakku
 * Digunakan untuk memindahkan lisensi domain lama ke domain baru secara resmi.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { license_key, old_domain, new_domain } = body;

    const activeKey = license_key || process.env.STAKKU_LICENSE_KEY;
    if (!activeKey || !new_domain) {
      return NextResponse.json(
        { success: false, message: 'Parameter license_key dan new_domain wajib diisi.' },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.STAKKU_API_URL || 'https://api.stakku.id';

    const response = await fetch(`${apiBaseUrl}/api/transfer-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        license_key: activeKey,
        old_domain: old_domain || request.headers.get('host'),
        new_domain,
      }),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memproses transfer lisensi.' },
      { status: 500 }
    );
  }
}

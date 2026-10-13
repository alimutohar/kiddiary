'use client';

import { useState } from 'react';
import { Child, ActivityLog, Space } from '@/lib/types';
import { Download, Check, FileText } from 'lucide-react';

interface ExportReportBtnProps {
  space: Space;
  child?: Child | null;
  logs: ActivityLog[];
}

export function ExportReportBtn({ space, child, logs }: ExportReportBtnProps) {
  const [downloading, setDownloading] = useState(false);

  function handleExportHtml() {
    setDownloading(true);

    const childName = child?.name || 'Seluruh Anak';
    const totalStars = child?.total_stars || 0;
    const generatedDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const rowsHtml = logs
      .map(
        (l) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${l.log_date}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600;">${l.activity?.title || 'Aktivitas'}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
            ${l.timing ? (l.timing === 'on_time' ? 'Tepat Waktu' : l.timing === 'late' ? 'Terlambat' : 'Qadha') : '-'}
            ${l.location_mode ? ` / ${l.location_mode === 'jamaah_masjid' ? 'Masjid' : l.location_mode === 'jamaah_rumah' ? 'Rumah' : 'Sendiri'}` : ''}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #d97706; font-weight: bold;">+${l.stars_awarded} ⭐</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-style: italic;">${l.notes || '-'}</td>
        </tr>
      `
      )
      .join('');

    const htmlDocument = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Perkembangan KidDiary - ${childName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 30px 15px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #4f46e5;
      margin: 0;
    }
    .tagline {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    .badge {
      background: #fef3c7;
      color: #92400e;
      padding: 6px 14px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 14px;
    }
    .meta-box {
      background: #f1f5f9;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      font-size: 13px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    th {
      background: #f8fafc;
      text-align: left;
      padding: 12px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #475569;
      border-bottom: 2px solid #cbd5e1;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .container { box-shadow: none; border: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">KidDiary Laporan Pembiasaan</h1>
        <div class="tagline">Niat baik, langkah nyata menemani tumbuh kembang si kecil</div>
      </div>
      <div class="badge">
        ⭐ ${totalStars} Total Bintang
      </div>
    </div>

    <div class="meta-box">
      <div><strong>Nama Anak:</strong> ${childName}</div>
      <div><strong>Ruang:</strong> ${space.name} (${space.space_type === 'classroom' ? 'Pendidikan' : 'Keluarga'})</div>
      <div><strong>Tanggal Cetak:</strong> ${generatedDate}</div>
      <div><strong>Total Catatan:</strong> ${logs.length} Aktivitas</div>
    </div>

    <h3 style="font-size: 16px; margin-bottom: 8px;">Jurnal Riwayat Aktivitas & Ibadah</h3>
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Aktivitas</th>
          <th>Waktu & Tata Cara</th>
          <th>Bintang</th>
          <th>Catatan Evaluasi</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8;">Belum ada data aktivitas.</td></tr>'}
      </tbody>
    </table>

    <div class="footer">
      Laporan ini digenerate secara offline mandiri melalui KidDiary BYOC &bull; Tanpa komparasi ranking antar anak.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KidDiary_Laporan_${childName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 800);
  }

  return (
    <button
      onClick={handleExportHtml}
      disabled={downloading}
      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
    >
      {downloading ? (
        <>
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Laporan Berhasil Diunduh!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan HTML Offline</span>
        </>
      )}
    </button>
  );
}

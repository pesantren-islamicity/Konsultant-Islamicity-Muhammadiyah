import {
  ZakatTransaction,
  UserProfile,
  BranchPerformance,
  ServiceHourLog,
  VolunteerProject,
  WaqfBlockchainTransaction,
  ProductiveWaqfAsset,
  WaqfPledgeRecord
} from '../types';

export const ExportService = {
  exportTransactionsToCSV(transactions: ZakatTransaction[]): void {
    const headers = ['Kode Transaksi', 'Nama Muzakki/Donatur', 'NBM', 'Program', 'Nominal (IDR)', 'Metode Pembayaran', 'Status', 'Waktu', 'Cabang/Wilayah', 'Hash Verifikasi'];
    const rows = transactions.map(t => [
      t.code,
      `"${t.donorName.replace(/"/g, '""')}"`,
      t.donorNbm || '-',
      t.program,
      t.amount.toString(),
      t.paymentMethod,
      t.status,
      t.timestamp,
      `"${t.branch.replace(/"/g, '""')}"`,
      t.hash
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_ZISWAF_Muhammadiyah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportMembersToCSV(members: UserProfile[]): void {
    const headers = ['NBM', 'Nama Lengkap', 'Email', 'Telepon', 'Peran', 'PWM', 'PDM', 'PCM', 'PRM', 'Ortom', 'Status', 'Poin Aktivitas', 'Tanggal Bergabung'];
    const rows = members.map(m => [
      m.nbm,
      `"${m.name.replace(/"/g, '""')}"`,
      m.email,
      m.phone,
      m.role,
      `"${m.branch.pwm}"`,
      `"${m.branch.pdm}"`,
      `"${m.branch.pcm}"`,
      `"${m.branch.prm}"`,
      m.ortom,
      m.status,
      m.activityPoints.toString(),
      m.joinedDate
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Database_SIMA_Muhammadiyah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToExcel(data: Record<string, string | number>[], filename: string): void {
    if (data.length === 0) return;
    const keys = Object.keys(data[0]);
    const headerRow = `<tr>${keys.map(k => `<th style="background-color:#047857;color:#ffffff;font-weight:bold;padding:8px;border:1px solid #ccc;">${k}</th>`).join('')}</tr>`;
    const dataRows = data.map(item => `<tr>${keys.map(k => `<td style="padding:6px;border:1px solid #ccc;">${item[k]}</td>`).join('')}</tr>`).join('');
    
    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Laporan</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      </head>
      <body>
        <h2 style="font-family:sans-serif;color:#047857;">PERSYARIKATAN MUHAMMADIYAH - SISTEM INFORMASI TERPADU</h2>
        <p style="font-family:sans-serif;color:#666;">Dicetak secara otomatis dari Cloud Platform Islamicity Muhammadiyah</p>
        <table border="1" style="border-collapse:collapse;font-family:sans-serif;font-size:12px;">
          ${headerRow}
          ${dataRows}
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  copyToGoogleSheetsFormat(transactions: ZakatTransaction[]): string {
    const headers = ['Kode Transaksi', 'Nama Donatur', 'Program', 'Nominal', 'Metode', 'Status', 'Cabang', 'Waktu'];
    const rows = transactions.map(t => [
      t.code,
      t.donorName,
      t.program,
      t.amount,
      t.paymentMethod,
      t.status,
      t.branch,
      t.timestamp
    ]);
    const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv);
    return tsv;
  },

  printReceiptPDF(trx: ZakatTransaction): void {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kwitansi Resmi ZISWAF - Lazismu Muhammadiyah</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #1e293b; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 20px; margin-bottom: 24px; }
          .logo-text { font-size: 22px; font-weight: 800; color: #047857; letter-spacing: 1px; }
          .subtext { font-size: 13px; color: #64748b; margin-top: 4px; }
          .arabic { font-family: serif; font-size: 20px; color: #047857; margin-bottom: 8px; }
          .invoice-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; }
          .label { color: #64748b; font-size: 14px; }
          .value { font-weight: 600; font-size: 14px; }
          .total { font-size: 20px; font-weight: 700; color: #047857; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; }
          .stamp { border: 2px solid #047857; color: #047857; display: inline-block; padding: 6px 16px; border-radius: 4px; font-weight: bold; transform: rotate(-5deg); margin-top: 15px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div class="logo-text">LEMBAGA AMIL ZAKAT INFAQ DAN SHADAQAH MUHAMMADIYAH</div>
          <div class="subtext">LAZISMU NASIONAL · KEMENAG RI NO. 730 TAHUN 2016 · AKREDITASI A</div>
          <div class="subtext">Gedung Pusat Dakwah Muhammadiyah, Jl. Menteng Raya No. 62 Jakarta Pusat</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div>
            <h3 style="margin:0; font-size:18px;">BUKTI SETOR ZAKAT / INFAQ DIGITAL</h3>
            <span style="font-size:13px; color:#64748b;">No: ${trx.code}</span>
          </div>
          <div class="stamp">TERVERIFIKASI SAH</div>
        </div>

        <div class="invoice-box">
          <div class="row">
            <span class="label">Nama Muzakki / Donatur:</span>
            <span class="value">${trx.donorName}</span>
          </div>
          ${trx.donorNbm ? `
          <div class="row">
            <span class="label">NBM (Nomor Baku Muhammadiyah):</span>
            <span class="value">${trx.donorNbm}</span>
          </div>` : ''}
          <div class="row">
            <span class="label">Program / Peruntukan:</span>
            <span class="value">${trx.program}</span>
          </div>
          <div class="row">
            <span class="label">Kanal Pembayaran:</span>
            <span class="value">${trx.paymentMethod}</span>
          </div>
          <div class="row">
            <span class="label">Unit Pelaksana Cabang:</span>
            <span class="value">${trx.branch}</span>
          </div>
          <div class="row">
            <span class="label">Waktu Transaksi Real-time:</span>
            <span class="value">${trx.timestamp} WIB</span>
          </div>
          <div class="row" style="border-bottom:none; margin-top:10px;">
            <span class="label" style="font-size:16px;">Jumlah Donasi / Setoran:</span>
            <span class="total">Rp ${trx.amount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div style="background-color:#f8fafc; padding:12px; border-radius:6px; font-size:11px; color:#64748b; font-family:monospace;">
          Digital Signature Hash: ${trx.hash}<br/>
          Status Enkripsi: AES-256 GCM Cloud Verified · Immutable Ledger Node: LAZISMU-CORE-01
        </div>

        <div class="footer">
          <p>Semoga Allah memberikan pahala atas apa yang engkau berikan, menjadikannya penyuci bagi dirimu, serta melimpahkan berkah pada hartamu yang tersisa.</p>
          <p>Dicetak pada: ${new Date().toLocaleString('id-ID')} melalui Superaplikasi Islamicity Muhammadiyah</p>
          <button onclick="window.print()" style="padding:10px 24px; background:#047857; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600; margin-top:10px;">Cetak Dokumen Sekarang (PDF)</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  },

  exportVolunteerLogsToCSV(logs: ServiceHourLog[]): void {
    const headers = ['ID Log', 'Nama Relawan', 'NBM', 'Nama Proyek', 'Tanggal Khidmat', 'Durasi (Jam)', 'Deskripsi Kegiatan', 'Penanggung Jawab Lapangan', 'Status Verifikasi', 'Hash Audit'];
    const rows = logs.map(l => [
      l.id,
      `"${l.memberName.replace(/"/g, '""')}"`,
      l.memberNbm,
      `"${l.projectTitle.replace(/"/g, '""')}"`,
      l.date,
      l.hours.toString(),
      `"${l.activityDescription.replace(/"/g, '""')}"`,
      `"${l.supervisorName.replace(/"/g, '""')}"`,
      l.status,
      l.verifiedHash
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Log_Jam_Khidmat_Relawan_Muhammadiyah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  printVolunteerCertificatePDF(member: UserProfile, totalHours: number, approvedLogs: ServiceHourLog[]): void {
    const printWindow = window.open('', '_blank', 'width=900,height=650');
    if (!printWindow) return;

    const logRows = approvedLogs.map(l => `
      <tr>
        <td style="padding:6px;border:1px solid #cbd5e1;">${l.date}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;font-weight:600;">${l.projectTitle}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;">${l.activityDescription.slice(0, 75)}...</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;font-family:monospace;font-weight:bold;">${l.hours} Jam</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;color:#047857;font-weight:bold;">Terverifikasi</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sertifikat Pengabdian Relawan - ${member.name}</title>
        <style>
          @page { size: landscape; margin: 20mm; }
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #0f172a; margin: 0; padding: 25px; background: #fff; }
          .cert-container { border: 8px double #047857; padding: 30px; border-radius: 12px; background: #fcfdfd; position: relative; }
          .header { text-align: center; margin-bottom: 20px; }
          .arabic { font-family: serif; font-size: 22px; color: #047857; margin-bottom: 6px; }
          .org { font-size: 15px; font-weight: 800; letter-spacing: 2px; color: #047857; text-transform: uppercase; }
          .cert-title { font-size: 26px; font-weight: 900; margin: 10px 0 5px 0; color: #1e293b; letter-spacing: 1px; }
          .cert-num { font-size: 11px; color: #64748b; font-family: monospace; }
          .recipient-block { text-align: center; margin: 25px 0; }
          .awarded-to { font-size: 13px; color: #475569; }
          .name { font-size: 24px; font-weight: bold; color: #047857; border-bottom: 2px solid #047857; display: inline-block; padding-bottom: 4px; margin-top: 6px; }
          .nbm { font-size: 13px; font-weight: 600; color: #334155; margin-top: 4px; font-family: monospace; }
          .narrative { text-align: center; font-size: 13px; line-height: 1.6; max-width: 720px; margin: 0 auto; color: #334155; }
          .hours-badge { display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 6px 18px; border-radius: 9999px; font-weight: 800; font-size: 16px; color: #047857; margin: 12px 0; font-family: monospace; }
          .table-title { font-size: 12px; font-weight: bold; color: #334155; margin-top: 20px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
          th { background: #047857; color: white; padding: 6px; text-align: left; }
          .sig-row { display: flex; justify-content: space-between; margin-top: 35px; padding: 0 40px; }
          .sig-box { text-align: center; font-size: 12px; }
          .sig-title { color: #64748b; font-size: 11px; margin-bottom: 50px; }
          .sig-name { font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 4px; }
          .stamp { position: absolute; right: 50px; bottom: 120px; border: 2px solid #047857; color: #047857; padding: 6px 14px; border-radius: 4px; font-weight: bold; font-size: 11px; transform: rotate(-8deg); }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="header">
            <div class="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <div class="org">PERSYARIKATAN MUHAMMADIYAH · SISTEM INFORMASI MANAJEMEN ANGGOTA</div>
            <div class="cert-title">SERTIFIKAT KHIDMAT RELAWAN KEMANUSIAAN</div>
            <div class="cert-num">Nomor: SR-MHD/${new Date().getFullYear()}/${member.nbm.replace(/\./g, '')}</div>
          </div>

          <div class="recipient-block">
            <div class="awarded-to">Diberikan sebagai apresiasi kesetiaan dan dedikasi kepada:</div>
            <div class="name">${member.name}</div>
            <div class="nbm">NBM: ${member.nbm} · Asal: ${member.branch.pcm}, ${member.branch.pwm}</div>
            <div class="narrative">
              Telah mendedikasikan waktu, tenaga, dan keahlian dalam berbagai program aksi kemanusiaan persyarikatan (MDMC, Lazismu, MPKU, Majelis Dikdasmen) dengan akumulasi jam pengabdian terverifikasi:
            </div>
            <div class="hours-badge">${totalHours} JAM KHIDMAT TERVERIFIKASI</div>
          </div>

          <div class="table-title">Lampiran Rekapitulasi Proyek & Tugas Kemanusiaan:</div>
          <table>
            <thead>
              <tr>
                <th style="width:15%;">Tanggal</th>
                <th style="width:30%;">Nama Proyek</th>
                <th style="width:35%;">Deskripsi Tugas</th>
                <th style="width:10%;text-align:right;">Jam</th>
                <th style="width:10%;text-align:center;">Validasi</th>
              </tr>
            </thead>
            <tbody>
              ${logRows}
            </tbody>
          </table>

          <div class="sig-row">
            <div class="sig-box">
              <div class="sig-title">Koordinator Nasional MDMC / Relawan</div>
              <div class="sig-name">Budi Setiawan, S.T.</div>
              <div style="font-size:10px;color:#64748b;">Ketua MDMC PP Muhammadiyah</div>
            </div>
            <div class="sig-box">
              <div class="sig-title">Yogyakarta, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>Pimpinan Pusat Muhammadiyah</div>
              <div class="sig-name">Prof. Dr. H. Haedar Nashir, M.Si</div>
              <div style="font-size:10px;color:#64748b;">Ketua Umum</div>
            </div>
          </div>

          <div class="stamp">SIMA CLOUD VERIFIED<br/>SHA256 IMMUTABLE</div>
        </div>

        <div style="text-align:center;margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 24px;background:#047857;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;">
            Cetak Sertifikat Pengabdian (PDF)
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  },

  exportWaqfTransactionsToCSV(transactions: WaqfBlockchainTransaction[]): void {
    const headers = ['Tx Hash', 'Block Number', 'Waktu Transaksi', 'Nama Wakif', 'NBM', 'Program Wakaf', 'Jenis', 'Nominal (IDR)', 'Nazhir Signer', 'Gas Fee', 'Status', 'Alokasi Mauquf Alaih'];
    const rows = transactions.map(t => [
      t.txHash,
      t.blockNumber.toString(),
      `"${t.timestamp}"`,
      `"${t.wakifName.replace(/"/g, '""')}"`,
      t.wakifNbm || '-',
      `"${t.programTitle.replace(/"/g, '""')}"`,
      t.type,
      t.amount.toString(),
      t.nazhirSigner,
      t.gasFee,
      t.status,
      `"${(t.mauqufAlaihDistribution || '-').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Buku_Besar_Blockchain_Wakaf_Muhammadiyah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportProductiveWaqfAssetsToCSV(assets: ProductiveWaqfAsset[]): void {
    const headers = ['Kode Aset', 'Nama Aset Wakaf', 'Kategori', 'Lokasi', 'PWM Wilayah', 'Luas Tanah (m2)', 'Luas Bangunan (m2)', 'Nilai Wajar Aset (IDR)', 'Pendapatan Bruto Tahunan (IDR)', 'Surplus Bersih Wakaf (IDR)', 'Yield (%)', 'Penerima Manfaat (Jiwa)', 'Nama Nazhir', 'No Reg BWI', 'Status Operasional', 'Block Number', 'Tx Hash'];
    const rows = assets.map(a => [
      a.assetCode,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.location.replace(/"/g, '""')}"`,
      `"${a.branchPwm}"`,
      a.landAreaM2.toString(),
      a.buildingAreaM2.toString(),
      a.valuationAmount.toString(),
      a.annualGrossIncome.toString(),
      a.annualNetYield.toString(),
      a.yieldPercentage.toString(),
      a.beneficiariesServed.toString(),
      `"${a.nazhirName.replace(/"/g, '""')}"`,
      a.nazhirRegistrationNo,
      a.status,
      a.blockchainRecord.blockNumber.toString(),
      a.blockchainRecord.txHash
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Daftar_Aset_Wakaf_Produktif_Muhammadiyah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  printWaqfCertificatePDF(pledge: WaqfPledgeRecord): void {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sertifikat Wakaf Uang - ${pledge.certificateNumber}</title>
        <style>
          @page { size: portrait; margin: 15mm; }
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #0f172a; margin: 0; padding: 25px; background: #fff; }
          .cert-container { border: 6px double #047857; padding: 35px 30px; border-radius: 12px; background: #fafdfa; position: relative; }
          .arabic { font-family: serif; font-size: 26px; color: #047857; text-align: center; margin-bottom: 8px; font-weight: bold; }
          .org { font-size: 13px; font-weight: 800; letter-spacing: 2px; color: #047857; text-align: center; text-transform: uppercase; }
          .cert-title { font-size: 24px; font-weight: 900; margin: 12px 0 4px 0; color: #1e293b; text-align: center; letter-spacing: 1px; }
          .sub { text-align: center; font-size: 12px; color: #475569; margin-bottom: 6px; }
          .cert-num { text-align: center; font-size: 11px; color: #047857; font-family: monospace; font-weight: bold; margin-bottom: 25px; }
          .body-content { font-size: 13px; line-height: 1.7; color: #334155; }
          .highlight-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #cbd5e1; font-size: 12px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 500; }
          .value { font-weight: 700; color: #0f172a; text-align: right; }
          .amount-callout { font-size: 22px; font-weight: 900; color: #047857; font-family: monospace; }
          .blockchain-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin: 20px 0; font-family: monospace; font-size: 10px; color: #334155; }
          .sig-row { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 30px; }
          .sig-box { text-align: center; font-size: 12px; width: 40%; }
          .sig-title { color: #64748b; font-size: 11px; margin-bottom: 50px; }
          .sig-name { font-weight: bold; border-top: 1px solid #94a3b8; padding-top: 4px; color: #0f172a; }
          .stamp { position: absolute; right: 40px; bottom: 130px; border: 2px solid #047857; color: #047857; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 10px; transform: rotate(-6deg); background: rgba(255,255,255,0.8); }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div class="org">PERSYARIKATAN MUHAMMADIYAH · MAJELIS PENDAYAGUNAAN WAKAF</div>
          <div class="sub">Terdaftar Resmi pada Badan Wakaf Indonesia (BWI) No: ${pledge.bwiRegNumber}</div>
          <div class="cert-title">SERTIFIKAT WAKAF UANG (SWU) & AKTA IKRAR WAKAF</div>
          <div class="cert-num">Nomor Registrasi: ${pledge.certificateNumber}</div>

          <div class="body-content">
            Dengan bertawakal kepada Allah Subhanahu wa Ta'ala, tertuang ikrar wakaf yang sah menurut syariat Islam dan peraturan perundang-undangan Negara Kesatuan Republik Indonesia:
          </div>

          <div class="highlight-box">
            <div class="row">
              <span class="label">Nama Lengkap Wakif:</span>
              <span class="value" style="font-size:14px;color:#047857;">${pledge.wakifName}</span>
            </div>
            <div class="row">
              <span class="label">Nomor Baku Muhammadiyah (NBM) / Identitas:</span>
              <span class="value">${pledge.wakifNbm || 'Masyarakat Umum'}</span>
            </div>
            <div class="row">
              <span class="label">Program Wakaf:</span>
              <span class="value">${pledge.programTitle}</span>
            </div>
            <div class="row">
              <span class="label">Sifat Wakaf:</span>
              <span class="value">${pledge.tenureType === 'abadi' ? 'Wakaf Uang Abadi (Pokok Tidak Berkurang)' : `Wakaf Uang Berjangka (${pledge.tenureYears || 5} Tahun / CWLS)`}</span>
            </div>
            <div class="row">
              <span class="label">Nominal Wakaf:</span>
              <span class="amount-callout">Rp ${pledge.amount.toLocaleString('id-ID')}</span>
            </div>
            <div class="row">
              <span class="label">Tanggal Ikrar Wakaf:</span>
              <span class="value">${pledge.timestamp}</span>
            </div>
          </div>

          <div class="body-content" style="font-size:11px;color:#475569;margin-bottom:15px;">
            Dana wakaf uang ini dikelola secara amanah oleh Nazhir Persyarikatan Muhammadiyah melalui instrumen investasi syariah yang prudensial. Seluruh hasil pengelolaan/imbal hasil disalurkan 100% untuk kemaslahatan umat (Mauquf 'Alaih) sesuai ikrar wakif.
          </div>

          <div class="blockchain-box">
            <div style="font-weight:bold;margin-bottom:4px;color:#047857;">BUKTI INTEGRITAS BLOCKCHAIN (IMMUTABLE SHARIA LEDGER):</div>
            <div>Tx Hash : ${pledge.txHash}</div>
            <div>Block   : #${pledge.blockNumber} (Validated by 38 PWM Consortium Nodes)</div>
            <div>Smart Contract : 0xWaqfMuhammadiyahConsortiumKaffah2026</div>
            <div>Digital AIW Hash: ${pledge.aiwDocumentHash}</div>
          </div>

          <div class="sig-row">
            <div class="sig-box">
              <div class="sig-title">Wakif (Pewakaf),</div>
              <div class="sig-name">${pledge.wakifName}</div>
            </div>
            <div class="sig-box">
              <div class="sig-title">Yogyakarta, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>Nazhir Majelis Pendayagunaan Wakaf PPM,</div>
              <div class="sig-name">Dr. H. Amirsyah Tambunan, M.A.</div>
              <div style="font-size:10px;color:#64748b;">Ketua Majelis Pendayagunaan Wakaf</div>
            </div>
          </div>

          <div class="stamp">BLOCKCHAIN VERIFIED<br/>BWI ACCREDITED NAZHIR</div>
        </div>

        <div style="text-align:center;margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 24px;background:#047857;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;">
            Cetak Sertifikat Wakaf (PDF)
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
};


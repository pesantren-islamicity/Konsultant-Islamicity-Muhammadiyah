import React, { useState } from 'react';
import {
  X,
  Coins,
  ShieldCheck,
  Building2,
  CheckCircle2,
  QrCode,
  FileCheck2,
  Lock,
  ArrowRight,
  Printer
} from 'lucide-react';
import { CashWaqfProgram, WaqfPledgeRecord, Language } from '../../types';
import { ExportService } from '../../services/exportService';

interface WaqfDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: CashWaqfProgram | null;
  onSuccess: (pledge: WaqfPledgeRecord) => void;
  language: Language;
}

export const WaqfDonationModal: React.FC<WaqfDonationModalProps> = ({
  isOpen,
  onClose,
  program,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [tenureType, setTenureType] = useState<'abadi' | 'berjangka'>('abadi');
  const [wakifName, setWakifName] = useState<string>('H. Dr. Muhammad Arif Rahmatullah, M.Ag');
  const [wakifNbm, setWakifNbm] = useState<string>('112.450.892');
  const [wakifEmail, setWakifEmail] = useState<string>('pesantren.islamicity@gmail.com');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'VA_BCA' | 'GOPAY'>('QRIS');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedPledge, setCompletedPledge] = useState<WaqfPledgeRecord | null>(null);

  if (!isOpen || !program) return null;

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000, 5000000];

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    setCustomAmount(raw);
    setAmount(num);
  };

  const handleSubmitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < (program.minAmount || 10000)) {
      alert(`Minimal wakaf uang untuk program ini adalah Rp ${(program.minAmount || 10000).toLocaleString('id-ID')}`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-') + ' WIB';

      const blockNum = 1408316 + Math.floor(Math.random() * 10);
      const randHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const txHash = `0x${randHex}`;
      const certNo = `SWU-MHD/${now.getFullYear()}/${now.getMonth() + 1}/${Math.floor(1000 + Math.random() * 9000)}`;
      const aiwHash = `SHA256:AIW-${Math.floor(100000 + Math.random() * 900000)}`;

      const newPledge: WaqfPledgeRecord = {
        id: `plg-${Date.now()}`,
        certificateNumber: certNo,
        wakifName: wakifName || 'Hamba Allah',
        wakifNbm: wakifNbm || undefined,
        wakifEmail,
        programId: program.id,
        programTitle: program.title,
        amount,
        tenureType,
        tenureYears: tenureType === 'berjangka' ? (program.tenureYears || 5) : undefined,
        timestamp,
        paymentMethod,
        txHash,
        blockNumber: blockNum,
        bwiRegNumber: program.bwiRegNumber,
        aiwDocumentHash: aiwHash,
      };

      setCompletedPledge(newPledge);
      setIsProcessing(false);
      onSuccess(newPledge);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header Modal */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {completedPledge ? 'Ikrar Wakaf Berhasil Terbit' : 'Tunaikan Wakaf Uang (CWLS)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nazhir Resmi Majelis Pendayagunaan Wakaf PPM · BWI Terdaftar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {completedPledge ? (
            /* Success State with Certificate Preview */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Alhamdulillah, Ikrar Wakaf Sah!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                  Amal jariyah Anda telah divalidasi ke dalam buku besar konsorsium blockchain Muhammadiyah dan tercatat secara abadi.
                </p>
              </div>

              {/* Certificate Summary Card */}
              <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-left space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-emerald-200/60 dark:border-emerald-800/60 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">No. Registrasi Sertifikat</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {completedPledge.certificateNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Wakif (Pewakaf)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {completedPledge.wakifName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Program Wakaf</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 max-w-xs truncate text-right">
                    {completedPledge.programTitle}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Sifat Wakaf</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {completedPledge.tenureType === 'abadi' ? 'Wakaf Abadi' : `Wakaf Berjangka (${completedPledge.tenureYears} Tahun)`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Nominal Wakaf</span>
                  <span className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-300">
                    Rp {completedPledge.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Blockchain Seal Info */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-left text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Blockchain Immutable Verification</span>
                </div>
                <div className="truncate">Tx: {completedPledge.txHash}</div>
                <div>Block Height: #{completedPledge.blockNumber} (38 Nodes Sync)</div>
                <div>Gas Fee: 0 Gwei · Status: FINALIZED</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => ExportService.printWaqfCertificatePDF(completedPledge)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sertifikat Wakaf (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-all"
                >
                  Tutup & Kembali
                </button>
              </div>
            </div>
          ) : (
            /* Donation Form */
            <form onSubmit={handleSubmitPledge} className="space-y-6">
              
              {/* Target Program Info Banner */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {program.code} · {program.category}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                      {program.title}
                    </h4>
                  </div>
                  <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {program.description}
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <strong>Mauquf 'Alaih:</strong>
                  <span className="truncate">{program.mauqufAlaih}</span>
                </div>
              </div>

              {/* Tenure Selection (Abadi vs Berjangka) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Sifat Wakaf Uang
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTenureType('abadi')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tenureType === 'abadi'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-xs">Wakaf Uang Abadi</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pokok dana diinvestasikan selamanya, hasil surplus mengalir tanpa henti.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenureType('berjangka')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tenureType === 'berjangka'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-xs">Wakaf Berjangka (CWLS)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Investasi sukuk {program.tenureYears || 5} tahun; pokok kembali ke wakif saat jatuh tempo.
                    </div>
                  </button>
                </div>
              </div>

              {/* Nominal Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Nominal Wakaf
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {quickAmounts.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectAmount(val)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold font-mono transition-all ${
                        amount === val && !customAmount
                          ? 'border-emerald-600 bg-emerald-700 text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                      }`}
                    >
                      Rp {val.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Atau masukkan nominal kustom..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Minimal wakaf uang: Rp {(program.minAmount || 10000).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Wakif Identity Form */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Data Identitas Wakif (Untuk Akta Ikrar Wakaf Digital)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Nama Lengkap Wakif
                    </label>
                    <input
                      type="text"
                      required
                      value={wakifName}
                      onChange={e => setWakifName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Nomor Baku Muhammadiyah (NBM) / KTP
                    </label>
                    <input
                      type="text"
                      value={wakifNbm}
                      onChange={e => setWakifNbm(e.target.value)}
                      placeholder="Opsional jika simpatisan umum"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    Email Pengiriman Sertifikat Resmi
                  </label>
                  <input
                    type="email"
                    required
                    value={wakifEmail}
                    onChange={e => setWakifEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Metode Pembayaran Digital
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'QRIS', label: 'QRIS Dinamis (Semua Bank/E-Wallet)', icon: QrCode },
                    { id: 'VA_BSI', label: 'Bank Syariah Indonesia (BSI)', icon: Building2 },
                    { id: 'VA_MANDIRI', label: 'Bank Mandiri Syariah', icon: Building2 },
                    { id: 'VA_BCA', label: 'BCA Virtual Account', icon: Building2 },
                    { id: 'GOPAY', label: 'GoPay / e-Wallet', icon: Coins },
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                          paymentMethod === method.id
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ikrar & Sharia Compliance Notice */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-300">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold">Ikrar Niat Wakaf Karena Allah Ta'ala</div>
                  <p className="text-[11px] leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                    "Saya berikrar mewakafkan uang sebesar Rp {amount.toLocaleString('id-ID')} untuk {program.title} secara {tenureType === 'abadi' ? 'abadi' : 'berjangka'} lillahi Ta'ala demi kemaslahatan umat."
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Memproses Enkripsi & Minting ke Blockchain...</span>
                ) : (
                  <>
                    <span>Bayar & Terbitkan Akta Wakaf (Rp {amount.toLocaleString('id-ID')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

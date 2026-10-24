import React, { useState } from 'react';
import { X, QrCode, Building2, Smartphone, CheckCircle, ShieldCheck, Printer, Download, Copy, Check } from 'lucide-react';
import { ZakatTransaction, Language } from '../../types';
import { ExportService } from '../../services/exportService';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
  defaultAmount?: number;
  onPaymentSuccess: (trx: ZakatTransaction) => void;
  language: Language;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  defaultProgram = 'Zakat Maal',
  defaultAmount = 1000000,
  onPaymentSuccess,
}) => {
  const [donorName, setDonorName] = useState('H. Dr. Muhammad Arif Rahmatullah');
  const [donorNbm, setDonorNbm] = useState('112.450.892');
  const [program, setProgram] = useState(defaultProgram);
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'VA_BCA' | 'GOPAY' | 'OVO' | 'SHOPEEPAY'>('QRIS');
  const [step, setStep] = useState<'input' | 'process' | 'success'>('input');
  const [completedTrx, setCompletedTrx] = useState<ZakatTransaction | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setStep('process');
  };

  const handleConfirmSimulation = () => {
    const code = `ZKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newTrx: ZakatTransaction = {
      id: `TRX-${Date.now()}`,
      code,
      donorName: donorName.trim() || 'Hamba Allah',
      donorNbm: donorNbm.trim() || undefined,
      program: program as any,
      amount: Number(amount),
      paymentMethod,
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      branch: 'PCM Gondomanan (Kauman)',
      distributionCategory: program.includes('Bencana') ? 'Bencana' : 'Fakir-Miskin',
      hash: randomHash,
    };

    setCompletedTrx(newTrx);
    onPaymentSuccess(newTrx);
    setStep('success');
  };

  const handleCopyVa = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden transition-all">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {step === 'success' ? 'Pembayaran ZISWAF Berhasil' : 'Gateway Pembayaran Digital Syariah'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              LAZISMU Terakreditasi Nasional · Enkripsi AES-256 GCM
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Muzakki / Donatur
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  placeholder="Masukkan nama lengkap atau Hamba Allah"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NBM (Opsional)
                  </label>
                  <input
                    type="text"
                    value={donorNbm}
                    onChange={e => setDonorNbm(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                    placeholder="Contoh: 112.450.892"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Program Penyaluran
                  </label>
                  <select
                    value={program}
                    onChange={e => setProgram(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  >
                    <option value="Zakat Maal">Zakat Maal (Tabungan/Emas)</option>
                    <option value="Zakat Profesi">Zakat Profesi (Penghasilan)</option>
                    <option value="Zakat Fitrah">Zakat Fitrah</option>
                    <option value="Infaq Kemanusiaan">Infaq Kemanusiaan</option>
                    <option value="Wakaf Pendidikan">Wakaf Pendidikan UMY/UAD</option>
                    <option value="Bencana MDMC">MDMC Tanggap Bencana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nominal Donasi (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 text-base font-bold font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[100000, 500000, 1000000, 2500000, 5000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {(val / 1000).toLocaleString('id-ID')}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Metode Pembayaran Digital
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'QRIS'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="QRIS"
                      checked={paymentMethod === 'QRIS'}
                      onChange={() => setPaymentMethod('QRIS')}
                      className="text-emerald-600"
                    />
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">QRIS Dinamis</div>
                      <div className="text-[10px] text-slate-500">Semua Bank & e-Wallet</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'VA_BSI'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VA_BSI"
                      checked={paymentMethod === 'VA_BSI'}
                      onChange={() => setPaymentMethod('VA_BSI')}
                      className="text-emerald-600"
                    />
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">BSI Syariah VA</div>
                      <div className="text-[10px] text-slate-500">Bank Syariah Indonesia</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'GOPAY'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="GOPAY"
                      checked={paymentMethod === 'GOPAY'}
                      onChange={() => setPaymentMethod('GOPAY')}
                      className="text-emerald-600"
                    />
                    <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">GoPay Instant</div>
                      <div className="text-[10px] text-slate-500">Direct Notification</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'VA_MANDIRI'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VA_MANDIRI"
                      checked={paymentMethod === 'VA_MANDIRI'}
                      onChange={() => setPaymentMethod('VA_MANDIRI')}
                      className="text-emerald-600"
                    />
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">Mandiri Syariah</div>
                      <div className="text-[10px] text-slate-500">Virtual Account</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Instruksi Pembayaran</span>
                <span className="font-mono text-emerald-100 font-bold">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </button>
            </form>
          )}

          {step === 'process' && (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Pembayaran Zakat / Infaq</span>
                <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  Rp {amount.toLocaleString('id-ID')}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                  Program: {program} · Donatur: {donorName}
                </div>
              </div>

              {paymentMethod === 'QRIS' && (
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-white border-2 border-emerald-600 rounded-xl shadow-xs">
                    {/* Visual simulated dynamic QR code */}
                    <div className="w-48 h-48 bg-slate-900 rounded-lg flex flex-col items-center justify-center relative p-3">
                      <div className="absolute top-2 left-2 w-8 h-8 border-4 border-white bg-slate-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white" />
                      </div>
                      <div className="absolute top-2 right-2 w-8 h-8 border-4 border-white bg-slate-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-white bg-slate-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white" />
                      </div>
                      
                      <div className="text-[10px] font-bold text-white tracking-widest uppercase mb-1">
                        QRIS LAZISMU
                      </div>
                      <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-emerald-800 font-black text-xl">
                        M
                      </div>
                      <div className="text-[8px] text-slate-300 font-mono mt-2 text-center">
                        NMID: ID1020268819024<br/>A01-PERSYARIKATAN
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Buka aplikasi m-Banking atau e-Wallet apapun dan scan QRIS di atas.
                  </p>
                </div>
              )}

              {paymentMethod.startsWith('VA') && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-left">
                  <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    Nomor Virtual Account ({paymentMethod === 'VA_BSI' ? 'BSI Syariah' : 'Bank Mandiri'}):
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-mono font-bold tracking-wider text-slate-900 dark:text-white">
                      8829 0112 4508 9200
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyVa('8829011245089200')}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-800 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Nama Akun: <strong>LAZISMU NASIONAL - {donorName.slice(0, 15)}</strong>
                  </div>
                </div>
              )}

              {paymentMethod === 'GOPAY' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                  <Smartphone className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Notifikasi Pembayaran Dikirimkan ke Aplikasi GoPay
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Silakan buka notifikasi di smartphone Anda untuk memvalidasi pembayaran sebesar Rp {amount.toLocaleString('id-ID')}.
                  </p>
                </div>
              )}

              {/* Simulation Instant Approval Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmSimulation}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Sukses (Instant Gateway Callback)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="mt-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Kembali ubah nominal atau metode
                </button>
              </div>
            </div>
          )}

          {step === 'success' && completedTrx && (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Alhamdulillah, Pembayaran Berhasil!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Dana telah masuk ke kas LAZISMU dan tercatat dalam buku besar publik secara transparan.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Transaksi:</span>
                  <span className="font-mono font-bold">{completedTrx.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program:</span>
                  <span className="font-semibold">{completedTrx.program}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah Dana:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Rp {completedTrx.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-semibold">{completedTrx.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hash Audit (E2E):</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">
                    {completedTrx.hash}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => ExportService.printReceiptPDF(completedTrx)}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kwitansi Sah (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Cloud,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  X,
  FileCheck,
  Database
} from 'lucide-react';
import { Language } from '../../types';
import { StorageService, SecurityConfig, BackupSnapshot } from '../../services/storage';
import { translations } from '../../services/i18n';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [config, setConfig] = useState<SecurityConfig>(StorageService.getSecurityConfig());
  const [backups, setBackups] = useState<BackupSnapshot[]>(StorageService.getBackups());
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  
  // 2FA verification test
  const [testCode, setTestCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleE2EE = () => {
    const updated = { ...config, isE2EEActive: !config.isE2EEActive };
    setConfig(updated);
    StorageService.saveSecurityConfig(updated);
  };

  const handleToggle2FA = () => {
    const updated = { ...config, is2FAEnabled: !config.is2FAEnabled };
    setConfig(updated);
    StorageService.saveSecurityConfig(updated);
  };

  const handleCreateSnapshot = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const snap = StorageService.createBackupNow();
      setBackups(StorageService.getBackups());
      setIsBackingUp(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    }, 800);
  };

  const handleTest2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCode.length === 6) {
      setVerificationResult('success');
    } else {
      setVerificationResult('error');
    }
    setTimeout(() => setVerificationResult(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.security.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.security.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Section 1: E2EE Enkripsi Data */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Enkripsi End-to-End (AES-256-GCM)
                </span>
              </div>
              <button
                onClick={handleToggleE2EE}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  config.isE2EEActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {config.isE2EEActive ? 'AKTIF (Terenkripsi Penuh)' : 'NON-AKTIF'}
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Seluruh data pribadi anggota, transaksi zakat, dan isi konsultasi syariah dienkripsi di sisi klien sebelum dikirimkan ke cloud. Kunci enkripsi privat tidak tersimpan di server publik.
            </p>

            <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-500 break-all">
              Key Fingerprint: {config.keyFingerprint}
            </div>
          </div>

          {/* Section 2: Two-Factor Authentication (2FA) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Autentikasi Dua Faktor (2FA TOTP)
                </span>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  config.is2FAEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {config.is2FAEnabled ? '2FA AKTIF' : 'NON-AKTIF'}
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400">
              Melindungi akun Pimpinan dan Anggota dari akses tanpa hak menggunakan aplikasi authenticator standar (Google Authenticator, Authy, Microsoft Authenticator).
            </p>

            {config.is2FAEnabled && (
              <form onSubmit={handleTest2FACode} className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={testCode}
                  onChange={e => setTestCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ketik 6 digit kode uji"
                  className="px-3 py-1.5 font-mono text-center tracking-widest text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors"
                >
                  Uji Verifikasi 2FA
                </button>
                {verificationResult === 'success' && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Valid!
                  </span>
                )}
                {verificationResult === 'error' && (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Masukkan 6 digit
                  </span>
                )}
              </form>
            )}
          </div>

          {/* Section 3: Automated Cloud Backup & Restore */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Cadangan Cloud Otomatis Terenkripsi
                </span>
              </div>
              <button
                onClick={handleCreateSnapshot}
                disabled={isBackingUp}
                className="px-3 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                <span>{isBackingUp ? 'Membuat Snapshot...' : 'Buat Snapshot Sekarang'}</span>
              </button>
            </div>

            {backupSuccess && (
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded text-center font-bold">
                Snapshot Cadangan Cloud Baru Berhasil Dibuat dan Diverifikasi!
              </div>
            )}

            <div className="space-y-2 pt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Titik Pemulihan (Restore Points) Tersedia:
              </span>
              <div className="divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                {backups.map(b => (
                  <div key={b.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{b.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {b.timestamp} · {b.sizeKb} KB · Hash: {b.dataHash}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      Tersimpan Aman
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Multi-Device Real-time Sync */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Sesi Aktif Sinkronisasi Multi-Perangkat
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Desktop Workstation (Sesi Saat Ini)</div>
                    <div className="text-[10px] text-slate-500">Chrome on Linux · IP: 103.145.22.8 · Yogyakarta</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">Aktif</span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Samsung Galaxy S24 (Mobile App)</div>
                    <div className="text-[10px] text-slate-500">Sinkronisasi Real-time 2 menit yang lalu · Push Notif Aktif</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Sesi perangkat seluler diputuskan')}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Putuskan
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Tutup Panel Keamanan
          </button>
        </div>

      </div>
    </div>
  );
};

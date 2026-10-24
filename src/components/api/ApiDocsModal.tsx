import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Globe,
  Terminal,
  BookOpen,
  X,
  ShieldCheck,
  Server
} from 'lucide-react';
import { Language } from '../../types';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'auth' | 'webhooks'>('endpoints');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      id: 'ep-dakwah',
      method: 'GET',
      path: '/api/v1/dakwah/streams',
      desc: 'Mengambil daftar siaran langsung, kajian rekaman, dan rujukan fatwa Majelis Tarjih.',
      sampleResponse: `{
  "status": "success",
  "data": [
    {
      "id": "dkw-001",
      "title": "Integrasi Nilai Islam Berkemajuan",
      "speaker": "Prof. Dr. H. Haedar Nashir, M.Si",
      "isLive": true,
      "viewers": 14820,
      "hptReference": "HPT Jilid III & Risalah Islam Berkemajuan"
    }
  ]
}`,
    },
    {
      id: 'ep-zakat',
      method: 'POST',
      path: '/api/v1/zakat/payment-intent',
      desc: 'Inisialisasi pembayaran digital ZISWAF LAZISMU (QRIS dinamis, Virtual Account BSI/Mandiri).',
      sampleResponse: `{
  "status": "success",
  "data": {
    "transactionId": "TRX-20261023-001",
    "amount": 1000000,
    "qrisString": "00020101021226670016ID.GO.QRIS.WWW...",
    "vaNumber": "8829011245089200",
    "signatureHash": "0x8f4c39b1a03e92cf...d941e2a"
  }
}`,
    },
    {
      id: 'ep-members',
      method: 'GET',
      path: '/api/v1/members/verify/{nbm}',
      desc: 'Validasi keabsahan status anggota Muhammadiyah & data digital KTAM dari cloud SIMA.',
      sampleResponse: `{
  "status": "valid",
  "member": {
    "nbm": "112.450.892",
    "name": "H. Dr. Muhammad Arif Rahmatullah",
    "status": "active",
    "branch": "PWM DIY / PCM Gondomanan",
    "ortom": "Pemuda Muhammadiyah"
  }
}`,
    },
    {
      id: 'ep-analytics',
      method: 'GET',
      path: '/api/v1/analytics/national-performance',
      desc: 'Mengambil data agregat real-time performa kegiatan dan realisasi ZISWAF 38 PWM.',
      sampleResponse: `{
  "status": "success",
  "nationalSummary": {
    "totalMembers": 3742890,
    "totalBranches": 14825,
    "zakatRealizedYtd": 586240000000
  }
}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dokumentasi Teknis REST API & Webhooks
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Spesifikasi Open API 3.1 & SDK Integration Guide untuk Pengembang
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

        {/* Tab Buttons */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'endpoints'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Core API Endpoints
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'auth'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Autentikasi & Keamanan (E2EE)
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'webhooks'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Payment Webhooks
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Base URL API Produksi:
                  </span>
                  <code className="ml-2 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    https://api.islamicity.muhammadiyah.or.id/v1
                  </code>
                </div>
                <button
                  onClick={() => handleCopy('https://api.islamicity.muhammadiyah.or.id/v1', 'base-url')}
                  className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                >
                  {copiedEndpoint === 'base-url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                {endpoints.map(ep => (
                  <div
                    key={ep.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900"
                  >
                    <div className="p-3 bg-white dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            ep.method === 'GET'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <code className="font-mono font-bold text-slate-900 dark:text-white">
                          {ep.path}
                        </code>
                      </div>

                      <button
                        onClick={() => handleCopy(ep.sampleResponse, ep.id)}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600"
                      >
                        {copiedEndpoint === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedEndpoint === ep.id ? 'Tersalin' : 'Salin JSON'}</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-slate-600 dark:text-slate-300">
                        {ep.desc}
                      </p>
                      <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed">
                        {ep.sampleResponse}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Bearer Token & Client-Side Encryption
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Setiap pemanggilan API wajib menyertakan header otentikasi Bearer Token JWT yang ditandatangani oleh sertifikat SIMA Cloud, serta header X-Muhammadiyah-Signature untuk verifikasi integritas pesan (HMAC-SHA256).
                </p>
              </div>

              <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto">
{`Authorization: Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
X-Muhammadiyah-App-Id: app-muh-superapp-kaffah
X-Muhammadiyah-Signature: sha256=9b41c098234af093412...
X-Device-Fingerprint: f7a20c4b810`}
              </pre>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Spesifikasi Callback Webhook Payment Gateway
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ketika muzakki menyelesaikan pembayaran QRIS atau Virtual Account, sistem gateway akan mengirimkan HTTP POST event webhook ke endpoint terdaftar Anda dengan retry mechanism 3x exponential backoff.
                </p>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto">
{`POST /api/v1/webhooks/payment
Content-Type: application/json

{
  "event": "payment.succeeded",
  "data": {
    "transactionId": "TRX-20261023-001",
    "amount": 1000000,
    "currency": "IDR",
    "paymentMethod": "QRIS",
    "donorName": "H. Dr. Muhammad Arif Rahmatullah",
    "donorNbm": "112.450.892",
    "settlementTime": "2026-10-23T18:42:15Z",
    "lazismuBranchCode": "PCM-KAUMAN-01"
  }
}`}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Tutup Dokumentasi
          </button>
        </div>

      </div>
    </div>
  );
};

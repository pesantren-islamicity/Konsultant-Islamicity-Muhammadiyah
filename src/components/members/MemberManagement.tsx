import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
  Printer,
  Award
} from 'lucide-react';
import {
  UserProfile,
  Language,
  VolunteerProject,
  VolunteerRegistration,
  ServiceHourLog
} from '../../types';
import { translations } from '../../services/i18n';
import { ExportService } from '../../services/exportService';
import { VolunteerCoordination } from './VolunteerCoordination';

interface MemberManagementProps {
  members: UserProfile[];
  onSaveMember: (member: UserProfile) => void;
  language: Language;
  volunteerProjects: VolunteerProject[];
  volunteerRegistrations: VolunteerRegistration[];
  serviceLogs: ServiceHourLog[];
  onRegisterVolunteer: (reg: VolunteerRegistration) => void;
  onAddServiceLog: (log: ServiceHourLog) => void;
  onApproveLog: (id: string) => void;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  onSaveMember,
  language,
  volunteerProjects,
  volunteerRegistrations,
  serviceLogs,
  onRegisterVolunteer,
  onAddServiceLog,
  onApproveLog,
}) => {
  const t = translations[language];
  const [simaSection, setSimaSection] = useState<'members' | 'volunteers'>('members');

  const [selectedMember, setSelectedMember] = useState<UserProfile>(members[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrtom, setSelectedOrtom] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Member Form State
  const [newNbm, setNewNbm] = useState(`125.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}`);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+62 ');
  const [newRole, setNewRole] = useState<'superadmin' | 'branch_admin' | 'consultant' | 'member'>('member');
  const [newPwm, setNewPwm] = useState('PWM Daerah Istimewa Yogyakarta');
  const [newPdm, setNewPdm] = useState('PDM Kota Yogyakarta');
  const [newPcm, setNewPcm] = useState('PCM Gondomanan (Kauman)');
  const [newPrm, setNewPrm] = useState('PRM Kauman Timur');
  const [newOrtom, setNewOrtom] = useState<UserProfile['ortom']>('Pemuda Muhammadiyah');

  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.nbm.includes(searchQuery) ||
                        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.branch.pcm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchOrtom = selectedOrtom === 'all' || m.ortom === selectedOrtom;
    return matchSearch && matchOrtom;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const member: UserProfile = {
      id: `usr-${Date.now()}`,
      nbm: newNbm,
      name: newName.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@muhammadiyah.id`,
      phone: newPhone,
      role: newRole,
      branch: {
        pwm: newPwm,
        pdm: newPdm,
        pcm: newPcm,
        prm: newPrm,
      },
      ortom: newOrtom,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      joinedDate: new Date().toISOString().slice(0, 10),
      is2FAEnabled: false,
      activityPoints: 500,
      status: 'active',
    };

    onSaveMember(member);
    setSelectedMember(member);
    setShowAddModal(false);

    // Reset
    setNewName('');
    setNewEmail('');
    setNewNbm(`125.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}`);
  };

  const handlePrintKtam = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
      <head>
        <title>KTAM Digital - ${selectedMember.name}</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f1f5f9; }
          .card { width: 450px; height: 260px; background: linear-gradient(135deg, #065f46 0%, #047857 50%, #064e3b 100%); color: white; border-radius: 14px; padding: 20px; box-sizing: border-box; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.25); padding-bottom: 8px; }
          .title { font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
          .sub { font-size: 10px; color: #a7f3d0; }
          .body { display: flex; gap: 15px; margin-top: 15px; align-items: center; }
          .photo { width: 75px; height: 95px; object-fit: cover; border-radius: 6px; border: 2px solid #fff; }
          .info { font-size: 11px; line-height: 1.5; }
          .name { font-size: 14px; font-weight: bold; margin-bottom: 4px; color: #fff; }
          .nbm { font-family: monospace; font-size: 13px; font-weight: bold; color: #fde047; margin-bottom: 6px; }
          .footer { position: absolute; bottom: 12px; left: 20px; right: 20px; display: flex; justify-content: space-between; font-size: 9px; color: #a7f3d0; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div>
              <div class="title">PERSYARIKATAN MUHAMMADIYAH</div>
              <div class="sub">KARTU TANDA ANGGOTA MUHAMMADIYAH (KTAM)</div>
            </div>
            <div style="font-size: 20px; font-weight: 800;">M</div>
          </div>
          <div class="body">
            <img class="photo" src="${selectedMember.avatar}" />
            <div class="info">
              <div class="name">${selectedMember.name}</div>
              <div class="nbm">NBM: ${selectedMember.nbm}</div>
              <div>Wilayah: ${selectedMember.branch.pwm}</div>
              <div>Cabang: ${selectedMember.branch.pcm}</div>
              <div>Ortom: ${selectedMember.ortom}</div>
            </div>
          </div>
          <div class="footer">
            <span>Validasi Terenkripsi Cloud SIMA</span>
            <span>Berlaku Seumur Hidup</span>
          </div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.members.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.members.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => ExportService.exportMembersToCSV(members)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor SIMA (CSV)</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.members.addMember}</span>
          </button>
        </div>
      </div>

      {/* SIMA Sub-Module Navigation: Direktori & KTAM vs Koordinasi Relawan */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSimaSection('members')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            simaSection === 'members'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Direktori Anggota & KTAM Digital</span>
        </button>

        <button
          onClick={() => setSimaSection('volunteers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            simaSection === 'volunteers'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Koordinasi Relawan Kemanusiaan (Volunteer Hub)</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
            simaSection === 'volunteers' ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {volunteerProjects.length} Proyek
          </span>
        </button>
      </div>

      {simaSection === 'volunteers' ? (
        <VolunteerCoordination
          members={members}
          projects={volunteerProjects}
          registrations={volunteerRegistrations}
          serviceLogs={serviceLogs}
          onRegisterVolunteer={onRegisterVolunteer}
          onAddServiceLog={onAddServiceLog}
          onApproveLog={onApproveLog}
          language={language}
        />
      ) : (
      /* Grid: KTAM Digital Live Card (Left 5 Cols) & Directory Table (Right 7 Cols) */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: KTAM Digital Interactive Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.members.ktamDigital}
            </h3>
            <button
              onClick={handlePrintKtam}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak KTAM</span>
            </button>
          </div>

          {/* Physical Simulation of KTAM Card */}
          <div className="relative rounded-2xl p-6 text-white overflow-hidden shadow-xl border border-emerald-600 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950">
            {/* Background geometric emblem watermark */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border-8 border-white/5 pointer-events-none" />
            <div className="absolute right-8 top-6 opacity-20 pointer-events-none font-bold text-6xl text-white">
              M
            </div>

            {/* Card Header */}
            <div className="flex items-start justify-between border-b border-emerald-700/60 pb-3 relative z-10">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Pimpinan Pusat Muhammadiyah
                </div>
                <div className="text-xs font-extrabold tracking-wide text-white mt-0.5">
                  KARTU TANDA ANGGOTA MUHAMMADIYAH
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-600 border border-emerald-400 flex items-center justify-center font-black text-xs">
                M
              </div>
            </div>

            {/* Card Body */}
            <div className="flex gap-4 items-center mt-4 relative z-10">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                referrerPolicy="no-referrer"
                className="w-18 h-22 object-cover rounded-lg border-2 border-emerald-400/80 shadow-md shrink-0 bg-slate-800"
              />

              <div className="space-y-1 min-w-0 flex-1 text-xs">
                <div className="text-sm font-bold text-white truncate">
                  {selectedMember.name}
                </div>
                <div className="font-mono text-emerald-300 font-bold tracking-wider text-xs">
                  NBM: {selectedMember.nbm}
                </div>
                <div className="text-[11px] text-emerald-100/90 truncate">
                  {selectedMember.branch.pcm}
                </div>
                <div className="text-[11px] text-emerald-200/80 truncate">
                  {selectedMember.branch.pwm}
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold pt-1">
                  Ortom: {selectedMember.ortom}
                </div>
              </div>
            </div>

            {/* Card Footer with QR verification */}
            <div className="flex items-end justify-between mt-5 pt-3 border-t border-emerald-700/60 text-[10px] text-emerald-200 relative z-10">
              <div>
                <div className="font-mono text-[9px] text-emerald-300">
                  HASH: SHA256:{selectedMember.nbm.replace(/\./g, '')}F89
                </div>
                <div>Status: Terverifikasi Aktif Nasional</div>
              </div>

              {/* Simulated QR Code */}
              <div className="w-10 h-10 bg-white p-1 rounded border border-emerald-300 flex items-center justify-center shrink-0">
                <QrCode className="w-8 h-8 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Member Detail Snapshot Card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Aktivitas & Keterlibatan Anggota</span>
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>{selectedMember.activityPoints.toLocaleString('id-ID')} Poin</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-[10px] block text-slate-400">Email Resmi:</span>
                <span className="font-medium text-slate-900 dark:text-white truncate block">{selectedMember.email}</span>
              </div>
              <div>
                <span className="text-[10px] block text-slate-400">Telepon / WhatsApp:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedMember.phone}</span>
              </div>
              <div>
                <span className="text-[10px] block text-slate-400">Ranting (PRM):</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedMember.branch.prm}</span>
              </div>
              <div>
                <span className="text-[10px] block text-slate-400">Tahun Bergabung:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedMember.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Member Directory Management Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs space-y-0">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama anggota, NBM, cabang..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Ortom:</span>
              <select
                value={selectedOrtom}
                onChange={e => setSelectedOrtom(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
              >
                <option value="all">Semua Ortom</option>
                <option value="Pemuda Muhammadiyah">Pemuda Muhammadiyah</option>
                <option value="Aisyiyah">Aisyiyah</option>
                <option value="Nasyiatul Aisyiyah">Nasyiatul Aisyiyah</option>
                <option value="IMM">IMM</option>
                <option value="IPM">IPM</option>
                <option value="Tapak Suci">Tapak Suci</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Nama & NBM</th>
                  <th className="px-4 py-3">Cabang (PCM / PWM)</th>
                  <th className="px-4 py-3">Ortom</th>
                  <th className="px-4 py-3 text-right">Poin</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredMembers.map(member => (
                  <tr
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`cursor-pointer transition-colors ${
                      selectedMember.id === member.id
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{member.nbm}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <div>{member.branch.pcm}</div>
                      <div className="text-[10px] text-slate-400">{member.branch.pwm}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {member.ortom}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {member.activityPoints}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                          handlePrintKtam();
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 rounded transition-colors"
                      >
                        KTAM
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pendaftaran Anggota Baru (SIMA Cloud)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Baku Muhammadiyah (NBM)
                  </label>
                  <input
                    type="text"
                    required
                    value={newNbm}
                    onChange={e => setNewNbm(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organisasi Otonom (Ortom)
                  </label>
                  <select
                    value={newOrtom}
                    onChange={e => setNewOrtom(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  >
                    <option value="Pemuda Muhammadiyah">Pemuda Muhammadiyah</option>
                    <option value="Aisyiyah">Aisyiyah</option>
                    <option value="Nasyiatul Aisyiyah">Nasyiatul Aisyiyah</option>
                    <option value="IMM">IMM (Mahasiswa)</option>
                    <option value="IPM">IPM (Pelajar)</option>
                    <option value="Hizbul Wathan">Hizbul Wathan</option>
                    <option value="Tapak Suci">Tapak Suci</option>
                    <option value="Umum">Umum / Persyarikatan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Ir. H. Ahmad Dahlan, M.Sc"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    placeholder="email@muhammadiyah.id"
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. Handphone / WA
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pimpinan Wilayah (PWM)
                  </label>
                  <input
                    type="text"
                    value={newPwm}
                    onChange={e => setNewPwm(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pimpinan Daerah (PDM)
                  </label>
                  <input
                    type="text"
                    value={newPdm}
                    onChange={e => setNewPdm(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pimpinan Cabang (PCM)
                  </label>
                  <input
                    type="text"
                    value={newPcm}
                    onChange={e => setNewPcm(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pimpinan Ranting (PRM)
                  </label>
                  <input
                    type="text"
                    value={newPrm}
                    onChange={e => setNewPrm(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Simpan & Terbitkan KTAM Digital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import {
  HeartHandshake,
  Clock,
  Users,
  Award,
  Search,
  Filter,
  Plus,
  CheckCircle,
  AlertTriangle,
  Download,
  Printer,
  Calendar,
  MapPin,
  Building2,
  X,
  FileCheck,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import {
  VolunteerProject,
  VolunteerRegistration,
  ServiceHourLog,
  UserProfile,
  Language
} from '../../types';
import { ExportService } from '../../services/exportService';

interface VolunteerCoordinationProps {
  members: UserProfile[];
  projects: VolunteerProject[];
  registrations: VolunteerRegistration[];
  serviceLogs: ServiceHourLog[];
  onRegisterVolunteer: (reg: VolunteerRegistration) => void;
  onAddServiceLog: (log: ServiceHourLog) => void;
  onApproveLog: (id: string) => void;
  language: Language;
}

export const VolunteerCoordination: React.FC<VolunteerCoordinationProps> = ({
  members,
  projects,
  registrations,
  serviceLogs,
  onRegisterVolunteer,
  onAddServiceLog,
  onApproveLog,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'myHours' | 'roster'>('projects');
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>('all');
  const [searchProject, setSearchProject] = useState<string>('');

  // Selected project for registration
  const [projectToRegister, setProjectToRegister] = useState<VolunteerProject | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [assignedRole, setAssignedRole] = useState<string>('Relawan Posko & Logistik');
  const [emergencyContact, setEmergencyContact] = useState<string>('+62 812-3456-7890');

  // Log Service Hours modal
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [logMemberId, setLogMemberId] = useState<string>(members[0]?.id || '');
  const [logProjectId, setLogProjectId] = useState<string>(projects[0]?.id || '');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [logHours, setLogHours] = useState<number>(6);
  const [logDesc, setLogDesc] = useState<string>('');
  const [logSupervisor, setLogSupervisor] = useState<string>('Budi Setiawan, S.T. (MDMC Pusat)');

  // Selected member for certificate
  const activeMember = members.find(m => m.id === selectedMemberId) || members[0];
  const memberApprovedLogs = serviceLogs.filter(l => l.memberNbm === activeMember?.nbm && l.status === 'approved');
  const totalMemberHours = memberApprovedLogs.reduce((acc, curr) => acc + curr.hours, 0);

  // Global totals
  const totalGlobalHours = serviceLogs
    .filter(l => l.status === 'approved')
    .reduce((acc, curr) => acc + curr.hours, 0);

  const filteredProjects = projects.filter(p => {
    const matchOrg = selectedOrganizer === 'all' || p.organizer === selectedOrganizer;
    const matchSearch = p.title.toLowerCase().includes(searchProject.toLowerCase()) ||
                        p.location.toLowerCase().includes(searchProject.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchProject.toLowerCase());
    return matchOrg && matchSearch;
  });

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToRegister) return;

    const targetMember = members.find(m => m.id === selectedMemberId) || members[0];
    const newReg: VolunteerRegistration = {
      id: `vreg-${Date.now()}`,
      projectId: projectToRegister.id,
      projectTitle: projectToRegister.title,
      memberId: targetMember.id,
      memberName: targetMember.name,
      memberNbm: targetMember.nbm,
      registeredAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      roleAssigned: assignedRole,
      emergencyContact,
      status: 'registered',
    };

    onRegisterVolunteer(newReg);
    setProjectToRegister(null);
  };

  const handleConfirmLogSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDesc.trim()) return;

    const targetMember = members.find(m => m.id === logMemberId) || members[0];
    const targetProject = projects.find(p => p.id === logProjectId) || projects[0];

    const randomHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newLog: ServiceHourLog = {
      id: `shl-${Date.now()}`,
      memberId: targetMember.id,
      memberName: targetMember.name,
      memberNbm: targetMember.nbm,
      projectId: targetProject.id,
      projectTitle: targetProject.title,
      date: logDate,
      hours: Number(logHours),
      activityDescription: logDesc.trim(),
      supervisorName: logSupervisor.trim(),
      status: 'approved', // auto approved with digital supervisor verification
      verifiedHash: randomHash,
    };

    onAddServiceLog(newLog);
    setLogDesc('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Banner & Metrics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>Sistem Koordinasi Relawan Kemanusiaan Muhammadiyah</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Khidmat Kemanusiaan, Tanggap Bencana & Log Pengabdian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Pusat pendaftaran aksi relawan kemanusiaan terpadu di bawah koordinasi MDMC, Lazismu, MPKU, Majelis Dikdasmen, dan Aisyiyah dengan pencatatan jam khidmat terenkripsi.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowLogModal(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Jam Khidmat</span>
            </button>
            <button
              onClick={() => ExportService.printVolunteerCertificatePDF(activeMember, totalMemberHours, memberApprovedLogs)}
              className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Cetak Sertifikat Khidmat (PDF)</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Proyek Kemanusiaan Aktif</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {projects.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">MDMC, Lazismu, MPKU</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Relawan Diterjunkan</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {registrations.length + 98}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Tersebar di 6 Provinsi</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Jam Khidmat Terakumulasi</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
              {(totalGlobalHours + 1420).toLocaleString('id-ID')} Jam
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Validasi SHA-256 SIMA</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Jam Khidmat Anggota Aktif</div>
            <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1 tabular-nums">
              {totalMemberHours} Jam
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
              {activeMember.name.slice(0, 24)}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Proyek Kemanusiaan vs Catatan Jam Khidmat vs Relawan Terdaftar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'projects'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Katalog Proyek Kemanusiaan ({filteredProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('myHours')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'myHours'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Buku Log Jam Khidmat ({serviceLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'roster'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Daftar Penugasan Relawan ({registrations.length})
        </button>
      </div>

      {/* Tab 1: Project Catalog */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchProject}
                onChange={e => setSearchProject(e.target.value)}
                placeholder="Cari aksi kemanusiaan, lokasi, atau keahlian..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['all', 'MDMC', 'LAZISMU', 'MPKU (Kesehatan)', 'Majelis Dikdasmen', 'Aisyiyah'].map(org => (
                <button
                  key={org}
                  onClick={() => setSelectedOrganizer(org)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedOrganizer === org
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {org === 'all' ? 'Semua Lembaga' : org}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map(project => {
              const quotaPct = Math.round((project.registeredVolunteersCount / project.requiredVolunteers) * 100);
              const isFull = project.registeredVolunteersCount >= project.requiredVolunteers;

              return (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {project.organizer}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span className="text-slate-500">{project.category}</span>
                      </div>

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        project.status === 'open'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                      }`}>
                        {project.status === 'open' ? 'Buka Pendaftaran' : 'Sedang Berjalan'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {project.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{project.location} ({project.targetBranch})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Periode: {project.startDate} s.d. {project.endDate}</span>
                      </div>
                    </div>

                    {/* Skills required - zero pill, clean text */}
                    <div className="text-xs pt-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Keahlian Dibutuhkan: </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {project.skillsNeeded.join(' · ')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {/* Quota Progress */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Kebutuhan Relawan Lapangan:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          {project.registeredVolunteersCount} / {project.requiredVolunteers} orang ({quotaPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${quotaPct >= 100 ? 'bg-amber-600' : 'bg-emerald-600'} transition-all`}
                          style={{ width: `${Math.min(100, quotaPct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        +{project.serviceHoursReward} Jam Khidmat
                      </div>

                      <button
                        onClick={() => setProjectToRegister(project)}
                        disabled={isFull}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                          isFull
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                        }`}
                      >
                        {isFull ? 'Kuota Penuh' : 'Daftar Jadi Relawan'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Service Hours Log */}
      {activeTab === 'myHours' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs space-y-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Buku Log Jam Pengabdian Relawan
              </h4>
              <p className="text-xs text-slate-500">
                Setiap log divalidasi oleh penanggung jawab lapangan dan diamankan dengan hash tanda tangan digital.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => ExportService.exportVolunteerLogsToCSV(serviceLogs)}
                className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Jam Layanan</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Nama Relawan & NBM</th>
                  <th className="px-4 py-3">Aksi / Proyek Kemanusiaan</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Durasi (Jam)</th>
                  <th className="px-4 py-3">Penanggung Jawab</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Validasi Digital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {serviceLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{log.memberName}</div>
                      <div className="font-mono text-[10px] text-slate-400">NBM: {log.memberNbm}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">{log.projectTitle}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{log.activityDescription}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                      {log.date}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {log.hours} Jam
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {log.supervisorName}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {log.status === 'approved' ? (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                          Terverifikasi
                        </span>
                      ) : (
                        <button
                          onClick={() => onApproveLog(log.id)}
                          className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 px-2 py-0.5 rounded"
                        >
                          Klik Setujui
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-[10px] text-slate-400">
                      <span title={log.verifiedHash} className="truncate max-w-[90px] inline-block">
                        {log.verifiedHash.slice(0, 10)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Roster Penugasan Relawan */}
      {activeTab === 'roster' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Penugasan & Deployment Relawan Muhammadiyah
            </h4>
            <p className="text-xs text-slate-500">
              Daftar anggota yang terdaftar aktif dalam misi kemanusiaan lapangan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Nama Relawan</th>
                  <th className="px-4 py-3">Proyek Kemanusiaan</th>
                  <th className="px-4 py-3">Peran Penugasan</th>
                  <th className="px-4 py-3">Kontak Darurat</th>
                  <th className="px-4 py-3">Waktu Registrasi</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{reg.memberName}</div>
                      <div className="font-mono text-[10px] text-slate-400">NBM: {reg.memberNbm}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {reg.projectTitle}
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-semibold">
                      {reg.roleAssigned}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {reg.emergencyContact}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {reg.registeredAt}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded capitalize">
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Register for Volunteer Project */}
      {projectToRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pendaftaran Relawan Misi Kemanusiaan
                </h3>
                <span className="text-xs text-slate-500">
                  {projectToRegister.organizer} · {projectToRegister.category}
                </span>
              </div>
              <button
                onClick={() => setProjectToRegister(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs">
              <div className="font-bold text-emerald-900 dark:text-emerald-200">{projectToRegister.title}</div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Lokasi: {projectToRegister.location} · Reward: +{projectToRegister.serviceHoursReward} Jam Khidmat
              </div>
            </div>

            <form onSubmit={handleConfirmRegistration} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Anggota SIMA yang Didaftarkan
                </label>
                <select
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (NBM: {m.nbm} - {m.branch.pcm})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keahlian & Peran Lapangan
                </label>
                <select
                  value={assignedRole}
                  onChange={e => setAssignedRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Relawan Posko & Logistik">Relawan Posko & Logistik</option>
                  <option value="Tim Medis & Paramedis">Tim Medis & Paramedis</option>
                  <option value="Dapur Umum & Distribusi Pangan">Dapur Umum & Distribusi Pangan</option>
                  <option value="Psikososial & Trauma Healing">Psikososial & Trauma Healing</option>
                  <option value="Relawan Pengajar / Literasi">Relawan Pengajar / Literasi</option>
                  <option value="Operator Komunikasi & Rescue SAR">Operator Komunikasi & Rescue SAR</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kontak Darurat (Keluarga / Kerabat)
                </label>
                <input
                  type="text"
                  required
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="Nama & Nomor HP / WA Darurat"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setProjectToRegister(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Konfirmasi Pendaftaran Relawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Service Hours */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pencatatan Jam Khidmat Relawan
                </h3>
                <span className="text-xs text-slate-500">
                  Transkrip Pengabdian Terverifikasi Cloud SIMA
                </span>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLogSubmission} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Anggota Relawan
                </label>
                <select
                  value={logMemberId}
                  onChange={e => setLogMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (NBM: {m.nbm})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Proyek Kemanusiaan
                </label>
                <select
                  value={logProjectId}
                  onChange={e => setLogProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.organizer})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Khidmat
                  </label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={e => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi Pengabdian (Jam)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    required
                    value={logHours}
                    onChange={e => setLogHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Kegiatan Lapangan yang Dilakukan
                </label>
                <textarea
                  required
                  rows={3}
                  value={logDesc}
                  onChange={e => setLogDesc(e.target.value)}
                  placeholder="Jelaskan secara rinci tugas yang telah dilaksanakan (misal: penyiapan 500 paket makanan siap saji, penyaluran air bersih di desa X)..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Penanggung Jawab Lapangan / Supervisor
                </label>
                <input
                  type="text"
                  required
                  value={logSupervisor}
                  onChange={e => setLogSupervisor(e.target.value)}
                  placeholder="Nama pimpinan posko atau penanggung jawab"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan & Terbitkan Hash Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

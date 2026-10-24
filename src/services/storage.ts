import {
  UserProfile,
  ZakatTransaction,
  DakwahItem,
  ConsultationQuestion,
  PushNotification,
  VolunteerProject,
  VolunteerRegistration,
  ServiceHourLog,
  ConsultantExpert,
  ConsultationBooking,
  StrategicKnowledgeItem,
  CashWaqfProgram,
  ProductiveWaqfAsset,
  WaqfBlockchainTransaction,
  WaqfBlockchainBlock,
  WaqfPledgeRecord
} from '../types';
import {
  initialMembers,
  initialZakatTransactions,
  initialDakwahList,
  initialConsultations,
  initialNotifications,
  initialVolunteerProjects,
  initialVolunteerRegistrations,
  initialServiceLogs,
  initialConsultantExperts,
  initialConsultationBookings,
  initialStrategicKnowledge,
  initialCashWaqfPrograms,
  initialProductiveWaqfAssets,
  initialWaqfBlockchainTransactions,
  initialWaqfBlockchainBlocks,
  currentUser
} from '../data/mockData';

const STORAGE_KEYS = {
  MEMBERS: 'mhd_members_v1',
  ZAKAT: 'mhd_zakat_v1',
  DAKWAH: 'mhd_dakwah_v1',
  CONSULTATIONS: 'mhd_consultations_v1',
  NOTIFICATIONS: 'mhd_notifications_v1',
  SECURITY: 'mhd_security_v1',
  BACKUPS: 'mhd_backups_v1',
  OFFLINE_QUEUE: 'mhd_offline_queue_v1',
  VOLUNTEER_PROJECTS: 'mhd_volunteer_projects_v1',
  VOLUNTEER_REGISTRATIONS: 'mhd_volunteer_registrations_v1',
  SERVICE_LOGS: 'mhd_service_logs_v1',
  CONSULTANT_EXPERTS: 'mhd_consultant_experts_v1',
  CONSULTATION_BOOKINGS: 'mhd_consultation_bookings_v1',
  STRATEGIC_KNOWLEDGE: 'mhd_strategic_knowledge_v1',
  CASH_WAQF: 'mhd_cash_waqf_v1',
  PRODUCTIVE_WAQF: 'mhd_productive_waqf_v1',
  WAQF_TX: 'mhd_waqf_blockchain_tx_v1',
  WAQF_BLOCKS: 'mhd_waqf_blockchain_blocks_v1',
  WAQF_PLEDGES: 'mhd_waqf_pledges_v1',
};

export interface SecurityConfig {
  isE2EEActive: boolean;
  is2FAEnabled: boolean;
  twoFactorSecret: string;
  autoCloudBackup: boolean;
  lastBackupTimestamp: string;
  encryptionAlgorithm: 'AES-256-GCM';
  keyFingerprint: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  sizeKb: number;
  dataHash: string;
  itemCount: {
    members: number;
    transactions: number;
    consultations: number;
  };
}

export const StorageService = {
  getMembers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return data ? JSON.parse(data) : initialMembers;
    } catch {
      return initialMembers;
    }
  },

  saveMember(member: UserProfile): UserProfile[] {
    const list = this.getMembers();
    const existingIndex = list.findIndex(m => m.id === member.id || m.nbm === member.nbm);
    let updated: UserProfile[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = member;
    } else {
      updated = [member, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
    return updated;
  },

  getZakatTransactions(): ZakatTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ZAKAT);
      return data ? JSON.parse(data) : initialZakatTransactions;
    } catch {
      return initialZakatTransactions;
    }
  },

  addZakatTransaction(trx: ZakatTransaction): ZakatTransaction[] {
    const list = this.getZakatTransactions();
    const updated = [trx, ...list];
    localStorage.setItem(STORAGE_KEYS.ZAKAT, JSON.stringify(updated));
    return updated;
  },

  getConsultations(): ConsultationQuestion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      return data ? JSON.parse(data) : initialConsultations;
    } catch {
      return initialConsultations;
    }
  },

  addConsultation(q: ConsultationQuestion): ConsultationQuestion[] {
    const list = this.getConsultations();
    const updated = [q, ...list];
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));
    return updated;
  },

  getNotifications(): PushNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  },

  markNotificationAsRead(id: string): PushNotification[] {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  addNotification(notif: PushNotification): PushNotification[] {
    const list = this.getNotifications();
    const updated = [notif, ...list];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  getSecurityConfig(): SecurityConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SECURITY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      isE2EEActive: true,
      is2FAEnabled: true,
      twoFactorSecret: 'JBSWY3DPEHPK3PXP',
      autoCloudBackup: true,
      lastBackupTimestamp: new Date().toISOString(),
      encryptionAlgorithm: 'AES-256-GCM',
      keyFingerprint: 'SHA256:7B8F9A0128CDE65F99B0452C481A2D8E',
    };
  },

  saveSecurityConfig(cfg: SecurityConfig): void {
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(cfg));
  },

  getBackups(): BackupSnapshot[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BACKUPS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [
      {
        id: 'BKP-20261023-AUTO',
        timestamp: '2026-10-23 20:00:00',
        sizeKb: 142.8,
        dataHash: 'sha256-e9b41c098234af093412',
        itemCount: { members: 6, transactions: 5, consultations: 3 }
      },
      {
        id: 'BKP-20261022-AUTO',
        timestamp: '2026-10-22 20:00:00',
        sizeKb: 139.2,
        dataHash: 'sha256-a1120f8c3321bd048731',
        itemCount: { members: 5, transactions: 4, consultations: 2 }
      }
    ];
  },

  createBackupNow(): BackupSnapshot {
    const members = this.getMembers();
    const trxs = this.getZakatTransactions();
    const csts = this.getConsultations();
    const backups = this.getBackups();

    const newSnapshot: BackupSnapshot = {
      id: `BKP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      sizeKb: +(Math.random() * 20 + 140).toFixed(1),
      dataHash: `sha256-${Math.random().toString(36).substring(2, 12)}`,
      itemCount: {
        members: members.length,
        transactions: trxs.length,
        consultations: csts.length
      }
    };

    const updated = [newSnapshot, ...backups];
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(updated));
    return newSnapshot;
  },

  getVolunteerProjects(): VolunteerProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOLUNTEER_PROJECTS);
      return data ? JSON.parse(data) : initialVolunteerProjects;
    } catch {
      return initialVolunteerProjects;
    }
  },

  saveVolunteerProject(project: VolunteerProject): VolunteerProject[] {
    const list = this.getVolunteerProjects();
    const existingIndex = list.findIndex(p => p.id === project.id);
    let updated: VolunteerProject[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = project;
    } else {
      updated = [project, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.VOLUNTEER_PROJECTS, JSON.stringify(updated));
    return updated;
  },

  getVolunteerRegistrations(): VolunteerRegistration[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOLUNTEER_REGISTRATIONS);
      return data ? JSON.parse(data) : initialVolunteerRegistrations;
    } catch {
      return initialVolunteerRegistrations;
    }
  },

  addVolunteerRegistration(reg: VolunteerRegistration): { registrations: VolunteerRegistration[]; projects: VolunteerProject[] } {
    const registrations = this.getVolunteerRegistrations();
    const updatedRegistrations = [reg, ...registrations];
    localStorage.setItem(STORAGE_KEYS.VOLUNTEER_REGISTRATIONS, JSON.stringify(updatedRegistrations));

    // Update project registered count
    const projects = this.getVolunteerProjects();
    const updatedProjects = projects.map(p => {
      if (p.id === reg.projectId) {
        return { ...p, registeredVolunteersCount: p.registeredVolunteersCount + 1 };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.VOLUNTEER_PROJECTS, JSON.stringify(updatedProjects));

    return { registrations: updatedRegistrations, projects: updatedProjects };
  },

  getServiceHourLogs(): ServiceHourLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICE_LOGS);
      return data ? JSON.parse(data) : initialServiceLogs;
    } catch {
      return initialServiceLogs;
    }
  },

  addServiceHourLog(log: ServiceHourLog): ServiceHourLog[] {
    const list = this.getServiceHourLogs();
    const updated = [log, ...list];
    localStorage.setItem(STORAGE_KEYS.SERVICE_LOGS, JSON.stringify(updated));
    return updated;
  },

  updateServiceHourLogStatus(id: string, status: 'approved' | 'rejected'): ServiceHourLog[] {
    const list = this.getServiceHourLogs();
    const updated = list.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem(STORAGE_KEYS.SERVICE_LOGS, JSON.stringify(updated));
    return updated;
  },

  getConsultantExperts(): ConsultantExpert[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSULTANT_EXPERTS);
      return data ? JSON.parse(data) : initialConsultantExperts;
    } catch {
      return initialConsultantExperts;
    }
  },

  getConsultationBookings(): ConsultationBooking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSULTATION_BOOKINGS);
      return data ? JSON.parse(data) : initialConsultationBookings;
    } catch {
      return initialConsultationBookings;
    }
  },

  addConsultationBooking(booking: ConsultationBooking): ConsultationBooking[] {
    const list = this.getConsultationBookings();
    const updated = [booking, ...list];
    localStorage.setItem(STORAGE_KEYS.CONSULTATION_BOOKINGS, JSON.stringify(updated));
    return updated;
  },

  getStrategicKnowledge(): StrategicKnowledgeItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STRATEGIC_KNOWLEDGE);
      return data ? JSON.parse(data) : initialStrategicKnowledge;
    } catch {
      return initialStrategicKnowledge;
    }
  },

  getCashWaqfPrograms(): CashWaqfProgram[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASH_WAQF);
      return data ? JSON.parse(data) : initialCashWaqfPrograms;
    } catch {
      return initialCashWaqfPrograms;
    }
  },

  saveCashWaqfProgram(program: CashWaqfProgram): CashWaqfProgram[] {
    const list = this.getCashWaqfPrograms();
    const idx = list.findIndex(p => p.id === program.id);
    let updated: CashWaqfProgram[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = program;
    } else {
      updated = [program, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.CASH_WAQF, JSON.stringify(updated));
    return updated;
  },

  getProductiveWaqfAssets(): ProductiveWaqfAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTIVE_WAQF);
      return data ? JSON.parse(data) : initialProductiveWaqfAssets;
    } catch {
      return initialProductiveWaqfAssets;
    }
  },

  getWaqfBlockchainTransactions(): WaqfBlockchainTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAQF_TX);
      return data ? JSON.parse(data) : initialWaqfBlockchainTransactions;
    } catch {
      return initialWaqfBlockchainTransactions;
    }
  },

  getWaqfBlockchainBlocks(): WaqfBlockchainBlock[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAQF_BLOCKS);
      return data ? JSON.parse(data) : initialWaqfBlockchainBlocks;
    } catch {
      return initialWaqfBlockchainBlocks;
    }
  },

  getWaqfPledges(): WaqfPledgeRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAQF_PLEDGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addWaqfPledge(pledge: WaqfPledgeRecord): {
    pledges: WaqfPledgeRecord[];
    programs: CashWaqfProgram[];
    transactions: WaqfBlockchainTransaction[];
  } {
    // 1. Save pledge
    const pledges = this.getWaqfPledges();
    const updatedPledges = [pledge, ...pledges];
    localStorage.setItem(STORAGE_KEYS.WAQF_PLEDGES, JSON.stringify(updatedPledges));

    // 2. Update cash waqf program target progress
    const programs = this.getCashWaqfPrograms();
    const progIdx = programs.findIndex(p => p.id === pledge.programId);
    let updatedPrograms = [...programs];
    if (progIdx >= 0) {
      const prog = updatedPrograms[progIdx];
      updatedPrograms[progIdx] = {
        ...prog,
        collectedAmount: prog.collectedAmount + pledge.amount,
        wakifCount: prog.wakifCount + 1,
      };
      localStorage.setItem(STORAGE_KEYS.CASH_WAQF, JSON.stringify(updatedPrograms));
    }

    // 3. Mint on-chain transaction
    const txList = this.getWaqfBlockchainTransactions();
    const newTx: WaqfBlockchainTransaction = {
      txHash: pledge.txHash,
      blockNumber: pledge.blockNumber,
      timestamp: pledge.timestamp,
      wakifName: pledge.wakifName,
      wakifNbm: pledge.wakifNbm,
      programTitle: pledge.programTitle,
      type: 'wakaf_tunai',
      amount: pledge.amount,
      nazhirSigner: '0xNazhir_MPW_PPMuhammadiyah_Node01',
      gasFee: '0 Gwei (Free Sharia Protocol)',
      status: 'finalized',
      merkleProof: `0x${Math.random().toString(16).substring(2, 10)}... (Merkle Root Valid)`,
      mauqufAlaihDistribution: `Alokasi Manfaat untuk ${pledge.programTitle}`,
    };
    const updatedTxList = [newTx, ...txList];
    localStorage.setItem(STORAGE_KEYS.WAQF_TX, JSON.stringify(updatedTxList));

    // 4. Also register in Zakat Transactions for unified financial transparency
    const zakatTrxList = this.getZakatTransactions();
    const zakatItem = {
      id: `trx-wkf-${Date.now()}`,
      code: `WKF-${Math.floor(100000 + Math.random() * 900000)}`,
      donorName: pledge.wakifName,
      donorNbm: pledge.wakifNbm,
      program: 'Wakaf Pendidikan' as const,
      amount: pledge.amount,
      paymentMethod: (pledge.paymentMethod as any) || 'QRIS',
      status: 'completed' as const,
      timestamp: pledge.timestamp,
      branch: 'PWM Daerah Istimewa Yogyakarta',
      distributionCategory: 'Fisabilillah' as const,
      hash: pledge.txHash,
    };
    this.addZakatTransaction(zakatItem);

    return {
      pledges: updatedPledges,
      programs: updatedPrograms,
      transactions: updatedTxList,
    };
  }
};



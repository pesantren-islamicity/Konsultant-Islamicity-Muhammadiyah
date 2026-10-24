export type Language = 'id' | 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface UserProfile {
  id: string;
  nbm: string; // Nomor Baku Muhammadiyah
  name: string;
  email: string;
  phone: string;
  role: 'superadmin' | 'branch_admin' | 'consultant' | 'member';
  branch: {
    pwm: string; // Pimpinan Wilayah
    pdm: string; // Pimpinan Daerah
    pcm: string; // Pimpinan Cabang
    prm: string; // Pimpinan Ranting
  };
  ortom: 'Aisyiyah' | 'Pemuda Muhammadiyah' | 'Nasyiatul Aisyiyah' | 'IMM' | 'IPM' | 'Hizbul Wathan' | 'Tapak Suci' | 'Umum';
  avatar: string;
  joinedDate: string;
  is2FAEnabled: boolean;
  activityPoints: number;
  status: 'active' | 'pending' | 'suspended';
}

export interface ZakatCalculation {
  type: 'maal' | 'profesi' | 'fitrah' | 'perniagaan';
  totalWealth: number;
  nisabGoldPrice: number; // Harga emas per gram
  nisabThreshold: number; // 85 gram * harga emas
  isObligated: boolean;
  zakatDue: number;
}

export interface ZakatTransaction {
  id: string;
  code: string;
  donorName: string;
  donorNbm?: string;
  program: 'Zakat Maal' | 'Zakat Profesi' | 'Zakat Fitrah' | 'Infaq Kemanusiaan' | 'Shadaqah Subuh' | 'Wakaf Pendidikan' | 'Bencana MDMC';
  amount: number;
  paymentMethod: 'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'VA_BCA' | 'GOPAY' | 'OVO' | 'SHOPEEPAY';
  status: 'completed' | 'pending' | 'processing';
  timestamp: string;
  branch: string;
  distributionCategory?: 'Fakir-Miskin' | 'Amil' | 'Muallaf' | 'Gharimin' | 'Fisabilillah' | 'Ibnu Sabil' | 'Bencana';
  hash: string; // Enkripsi verifikasi SHA-256
}

export interface DakwahItem {
  id: string;
  title: string;
  speaker: string;
  speakerTitle: string;
  speakerAvatar?: string;
  category: 'Kajian Tarjih' | 'Keluarga Sakinah' | 'Tafsir Tematik' | 'Ekonomi Syariah' | 'Ideologi Muhammadiyah';
  date: string;
  duration: string;
  type: 'live' | 'recorded' | 'audio' | 'article';
  viewers: number;
  isLiveNow?: boolean;
  thumbnail: string;
  summary: string;
  hptReference?: string; // Himpunan Putusan Tarjih
}

export interface ConsultationQuestion {
  id: string;
  authorName: string;
  authorBranch: string;
  question: string;
  category: 'Ibadah' | 'Muamalah' | 'Keluarga Sakinah' | 'Hukum Kontemporer' | 'Zakat & Wakaf';
  date: string;
  status: 'answered' | 'in_review';
  answer?: {
    consultantName: string;
    consultantTitle: string;
    answerText: string;
    hptDalil: string;
    dateAnswered: string;
  };
}

export interface BranchPerformance {
  id: string;
  name: string;
  code: string;
  level: 'PWM' | 'PDM' | 'PCM';
  province: string;
  totalMembers: number;
  activeActivitiesCount: number;
  zakatCollectedYTD: number;
  performanceScore: number; // 0 - 100
  attendanceRate: number; // percentage
  status: 'Unggul' | 'Berkembang' | 'Perlu Pembinaan';
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  category: 'prayer' | 'dakwah' | 'zakat' | 'emergency' | 'persyarikatan';
  timestamp: string;
  read: boolean;
  targetBranch?: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  hijriDate: string;
  gregorianDate: string;
  type: 'agenda_muhammadiyah' | 'hari_besar_islam' | 'puasa_sunnah';
  description: string;
  location?: string;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  city: string;
  hijriDateStr: string;
}

export interface VolunteerProject {
  id: string;
  title: string;
  organizer: 'MDMC' | 'LAZISMU' | 'MPKU (Kesehatan)' | 'Majelis Dikdasmen' | 'Aisyiyah' | 'Hizbul Wathan';
  category: 'Tanggap Bencana' | 'Layanan Kesehatan' | 'Pendidikan 3T' | 'Distribusi Pangan' | 'Pemberdayaan Sosial';
  location: string;
  targetBranch: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'ongoing' | 'completed';
  requiredVolunteers: number;
  registeredVolunteersCount: number;
  description: string;
  skillsNeeded: string[];
  serviceHoursReward: number; // estimasi jam khidmat
}

export interface VolunteerRegistration {
  id: string;
  projectId: string;
  projectTitle: string;
  memberId: string;
  memberName: string;
  memberNbm: string;
  registeredAt: string;
  roleAssigned: string;
  emergencyContact: string;
  status: 'registered' | 'deployed' | 'completed';
}

export interface ServiceHourLog {
  id: string;
  memberId: string;
  memberName: string;
  memberNbm: string;
  projectId: string;
  projectTitle: string;
  date: string;
  hours: number;
  activityDescription: string;
  supervisorName: string;
  status: 'approved' | 'pending' | 'rejected';
  verifiedHash: string;
}

export interface ConsultantExpert {
  id: string;
  name: string;
  title: string;
  specialization: 'Islamicity Finance & Sukuk' | 'Halal Certification & Assurance' | 'Muslim-Friendly Tourism' | 'Holistic Islamic Education' | 'Social Enterprise & Waqf';
  affiliation: string;
  location: string;
  languages: string[];
  avatar: string;
  experienceYears: number;
  rating: number;
  availableDays: string[];
  hourlyRate: string;
}

export interface ConsultationBooking {
  id: string;
  clientName: string;
  clientOrg: string;
  clientEmail: string;
  expertId: string;
  expertName: string;
  pillar: 'Finance' | 'Halal' | 'Tourism' | 'Education' | 'Social Enterprise';
  date: string;
  timeSlot: string;
  timezone: string;
  topicSummary: string;
  status: 'confirmed' | 'in_session' | 'completed';
  virtualRoomUrl: string;
  encryptionKey: string;
}

export interface StrategicKnowledgeItem {
  id: string;
  title: string;
  category: 'Policy Brief' | 'Sharia Standard' | 'SWOT Matrix' | 'Business Model Canvas' | 'Audit Toolkit';
  publishedDate: string;
  author: string;
  summary: string;
  downloadUrl: string;
  pages: number;
}

export interface CashWaqfProgram {
  id: string;
  title: string;
  code: string;
  category: 'Pendidikan' | 'Kesehatan' | 'Ekonomi Ummat' | 'Infrastruktur' | 'Dakwah';
  targetAmount: number;
  collectedAmount: number;
  wakifCount: number;
  minAmount: number;
  tenureType: 'abadi' | 'berjangka';
  tenureYears?: number;
  description: string;
  mauqufAlaih: string; // Mauquf 'Alaih (Penerima Manfaat)
  nazhir: string;
  bwiRegNumber: string;
  blockchainContract: string;
  status: 'active' | 'fulfilled';
}

export interface ProductiveWaqfAsset {
  id: string;
  assetCode: string;
  name: string;
  category: 'Kesehatan (RS PKU)' | 'Pendidikan (Universitas/Pesantren)' | 'Ritel & Komersial' | 'Agribisnis & Perkebunan' | 'Gedung Dakwah & AUM';
  location: string;
  branchPwm: string;
  landAreaM2: number;
  buildingAreaM2: number;
  valuationAmount: number; // Nilai Wajar Aset (Fair Value)
  annualGrossIncome: number;
  annualNetYield: number; // Surplus Bersih Wakaf (Yield)
  yieldPercentage: number;
  beneficiariesServed: number; // Penerima manfaat dhuafa/mustahik
  nazhirName: string;
  nazhirRegistrationNo: string;
  status: 'operational' | 'expansion' | 'audited';
  blockchainRecord: {
    blockNumber: number;
    txHash: string;
    verifiedDate: string;
    qrHash: string;
    merkleRoot: string;
  };
}

export interface WaqfBlockchainTransaction {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  wakifName: string;
  wakifNbm?: string;
  programTitle: string;
  type: 'wakaf_tunai' | 'wakaf_produktif' | 'penyaluran_hasil';
  amount: number;
  nazhirSigner: string;
  gasFee: string; // '0 Gwei (Sharia Protocol)'
  status: 'confirmed' | 'finalized';
  merkleProof: string;
  mauqufAlaihDistribution?: string;
}

export interface WaqfBlockchainBlock {
  blockNumber: number;
  timestamp: string;
  txCount: number;
  blockHash: string;
  previousHash: string;
  validatorPwm: string;
  smartContractAddress: string;
  merkleRoot: string;
  status: 'validated';
}

export interface WaqfPledgeRecord {
  id: string;
  certificateNumber: string;
  wakifName: string;
  wakifNbm?: string;
  wakifEmail: string;
  programId: string;
  programTitle: string;
  amount: number;
  tenureType: 'abadi' | 'berjangka';
  tenureYears?: number;
  timestamp: string;
  paymentMethod: string;
  txHash: string;
  blockNumber: number;
  bwiRegNumber: string;
  aiwDocumentHash: string;
}



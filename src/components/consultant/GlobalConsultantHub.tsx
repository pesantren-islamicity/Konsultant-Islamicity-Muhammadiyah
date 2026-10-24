import React, { useState } from 'react';
import {
  Globe,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Video,
  FileText,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Plus,
  X,
  Lock,
  Download,
  Share2
} from 'lucide-react';
import {
  ConsultantExpert,
  ConsultationBooking,
  StrategicKnowledgeItem,
  Language
} from '../../types';

interface GlobalConsultantHubProps {
  experts: ConsultantExpert[];
  bookings: ConsultationBooking[];
  knowledgeItems: StrategicKnowledgeItem[];
  onAddBooking: (booking: ConsultationBooking) => void;
  language: Language;
}

export const GlobalConsultantHub: React.FC<GlobalConsultantHubProps> = ({
  experts,
  bookings,
  knowledgeItems,
  onAddBooking,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'booking' | 'strategy' | 'knowledge'>('pillars');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [bookingModalExpert, setBookingModalExpert] = useState<ConsultantExpert | null>(null);

  // Booking Form State
  const [clientName, setClientName] = useState<string>('H. Dr. Muhammad Arif Rahmatullah');
  const [clientOrg, setClientOrg] = useState<string>('Pesantren & Badan Usaha Muhammadiyah Kauman');
  const [clientEmail, setClientEmail] = useState<string>('pesantren.islamicity@gmail.com');
  const [bookingDate, setBookingDate] = useState<string>('2026-11-02');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('10:00 - 11:30 WIB');
  const [bookingTimezone, setBookingTimezone] = useState<string>('Asia/Jakarta (GMT+7)');
  const [topicSummary, setTopicSummary] = useState<string>('');

  // Strategy Tool sub-tab
  const [strategyView, setStrategyView] = useState<'swot' | 'bmc' | 'journey' | 'kpi'>('swot');

  // Pillar details modal
  const [pillarModalDetail, setPillarModalDetail] = useState<{
    title: string;
    description: string;
    challenges: string;
    opportunities: string;
    bestPracticeCase: string;
    infrastructureNeeds: string[];
  } | null>(null);

  const pillarsData = [
    {
      id: 'finance',
      key: 'Islamicity Finance & Sukuk',
      title: 'Islamicity Finance Consultant',
      arabic: 'استشارات المالية الإسلامية والصكوك',
      badge: 'Keuangan & Investasi',
      summary: 'Konsultasi penataan sukuk korporasi, sovereign green sukuk, takaful, dan digital micro-financing sesuai prinsip syariah.',
      description: 'Menjembatani korporasi dan institusi publik dalam menstrukturisasi instrumen finansial syariah global. Meliputi penyusunan prospektus Sukuk Ijarah/Mudharabah, Cash Waqf Linked Sukuk (CWLS), serta kepatuhan regulator internasional (AAOIFI & IFSB).',
      challenges: 'Standardisasi fatwa lintas yurisdiksi dan integrasi suku bunga acuan konvensional dengan bagi hasil syariah yang adil.',
      opportunities: 'Pertumbuhan pasar perbankan & sukuk syariah global yang menembus $3.2 triliun dengan permintaan tinggi investor ESG global.',
      bestPracticeCase: 'Penerbitan Sukuk Wakaf Rumah Sakit Muhammadiyah dan Sovereign Green Sukuk Republik Indonesia.',
      infrastructureNeeds: ['Core Banking Syariah Gateway', 'Smart Contract Sukuk Ledger', 'Sharia Board Audit Portal'],
    },
    {
      id: 'halal',
      key: 'Halal Certification & Assurance',
      title: 'Halal Assurance & Certification Body',
      arabic: 'ضمان الجودة وشهادات الحلال العالمية',
      badge: 'Sertifikasi & Rantai Pasok',
      summary: 'Standardisasi kepatuhan rantai pasok halal dari hulu ke hilir (Farm-to-Fork) berstandar global HAS 23000 & ISO 17065.',
      description: 'Lembaga konsultan dan audit jaminan produk halal mencakup industri makanan-minuman, farmasi, kosmetik, logistik, dan rumah potong hewan. Didukung laboratorium biologi molekuler untuk deteksi DNA babi dan kontaminan non-halal.',
      challenges: 'Harmonisasi regulasi sertifikasi halal antar-negara (BPJPH, JAKIM, SFDA, MUI, GSO, ESMA).',
      opportunities: 'Industri makanan & kosmetik halal global bernilai lebih dari $2 triliun dengan tren konsumen yang mengedepankan keamanan hayati (thayyib).',
      bestPracticeCase: 'Lembaga Pemeriksa Halal (LPH) Muhammadiyah dengan sertifikasi rantai pasok daging sapi & industri herbal nasional.',
      infrastructureNeeds: ['Sistem Informasi Halal Terintegrasi (SIHALAL API)', 'Layanan Uji Lab DNA qPCR Real-time', 'QR Code Traceability Scanner'],
    },
    {
      id: 'tourism',
      key: 'Muslim-Friendly Tourism',
      title: 'Islamicity Tourism Consultant',
      arabic: 'استشارات السياحة والضيافة الحلال',
      badge: 'Hospitalitas & Wisata',
      summary: 'Perancangan destinasi, perhotelan syariah, sarana ibadah representatif, dan tata kelola wisata ramah keluarga.',
      description: 'Membantu pemerintah daerah, hotel resort, dan biro perjalanan merancang ekosistem ramah muslim tanpa mengorbankan daya tarik universal. Menyediakan audit fasilitas kiblat, sajadah, air bersuci, serta pemisahan area rekreasi keluarga sakinah.',
      challenges: 'Miskonsepsi publik tentang pariwisata halal dan keterbatasan ketersediaan kuliner halal tersertifikasi di destinasi non-mayoritas muslim.',
      opportunities: 'Wisatawan muslim global menyumbang devisa lebih dari $220 miliar per tahun dengan durasi tinggal (length of stay) di atas rata-rata turis umum.',
      bestPracticeCase: 'Pengembangan kawasan ekowisata halal Lombok & standardisasi hotel syariah di Yogyakarta, Tokyo, dan London.',
      infrastructureNeeds: ['Aplikasi Panduan Wisata Ramah Muslim GPS', 'Audit Checklist Kepatuhan Hotel', 'Rating Platform Terbuka'],
    },
    {
      id: 'education',
      key: 'Holistic Islamic Education',
      title: 'Islamicity Education Consultant',
      arabic: 'استشارات التعليم الإسلامي المتطور',
      badge: 'Pendidikan & Pesantren',
      summary: 'Modernisasi kurikulum integrasi sains-islam, akreditasi internasional, dan transformasi tata kelola madrasah unggul.',
      description: 'Konsultasi institusional bagi sekolah, madrasah, pesantren, dan perguruan tinggi Islam. Fokus pada penguatan epistemologi Islam Berkemajuan, integrasi Al-Qur\'an dengan riset sains modern, serta tata kelola keuangan pendidikan mandiri.',
      challenges: 'Dikotomi ilmu pengetahuan umum versus agama serta keterbatasan sarana laboratorium teknologi di sekolah pelosok.',
      opportunities: 'Tingginya minat orang tua kelas menengah muslim terhadap sekolah Islam terpadu berkualitas global (International Islamic Boarding School).',
      bestPracticeCase: 'Jaringan Perguruan Muhammadiyah & Aisyiyah dengan 170+ Kampus Universitas dan 10.000+ Sekolah/Madrasah di Indonesia dan Luar Negeri (Universiti Muhammadiyah Malaysia).',
      infrastructureNeeds: ['Learning Management System (LMS) Cloud Terpadu', 'Sistem Informasi Akademik SIMA Kampus', 'Database Repositori Riset Tarjih'],
    },
    {
      id: 'waqf',
      key: 'Social Enterprise & Waqf',
      title: 'Islamicity Social Enterprise & Waqf',
      arabic: 'المشاريع الاجتماعية والوقف الاستثمari',
      badge: 'Wakaf Produktif & UMKM',
      summary: 'Pengembangan wakaf produktif uang, venture philanthropy, dan model bisnis usaha sosial untuk pengentasan kemiskinan.',
      description: 'Merancang model bisnis sosial berkeberlanjutan yang memadukan dana sosial Islam (Zakat, Infaq, Shadaqah, Wakaf) dengan strategi ventura komersial. Fokus pada penciptaan lapangan kerja, ketahanan pangan, dan pemberdayaan mustahik.',
      challenges: 'Edukasi masyarakat mengenai keabadian nilai pokok wakaf uang dan profesionalisme nazhir pengelola wakaf produktif.',
      opportunities: 'Potensi wakaf uang nasional Indonesia sebesar Rp 180 triliun dan pasar social impact investing dunia yang terus mencari model etis.',
      bestPracticeCase: 'Pengelolaan Rumah Sakit & Klinik PKU Muhammadiyah berbasis wakaf produktif dan Toko Suara Muhammadiyah (SM Corner).',
      infrastructureNeeds: ['Platform Digital Cash Waqf Management', 'Impact Measurement & ESG Reporting Engine', 'Nazhir Audit Compliance Ledger'],
    },
  ];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalExpert) return;

    const randomHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newBooking: ConsultationBooking = {
      id: `bkg-${Date.now()}`,
      clientName: clientName.trim(),
      clientOrg: clientOrg.trim(),
      clientEmail: clientEmail.trim(),
      expertId: bookingModalExpert.id,
      expertName: bookingModalExpert.name,
      pillar: bookingModalExpert.specialization.includes('Finance') ? 'Finance' :
              bookingModalExpert.specialization.includes('Halal') ? 'Halal' :
              bookingModalExpert.specialization.includes('Tourism') ? 'Tourism' :
              bookingModalExpert.specialization.includes('Education') ? 'Education' : 'Social Enterprise',
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      timezone: bookingTimezone,
      topicSummary: topicSummary.trim() || `Konsultasi strategis ${bookingModalExpert.specialization}`,
      status: 'confirmed',
      virtualRoomUrl: `https://meet.islamicity.org/virtual-room-${Date.now().toString().slice(-4)}`,
      encryptionKey: `AES256:${randomHash}`,
    };

    onAddBooking(newBooking);
    setBookingModalExpert(null);
    setTopicSummary('');
    setActiveTab('booking');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Global Consultant Architecture & Mission */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-extrabold">
              <Globe className="w-4 h-4" />
              <span>Global Consultant Islamicity · Pusat Konsultasi Strategis Dunia</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Infrastruktur, Platform & Praktik Terbaik Konsultan Syariah Global
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Menyelaraskan nilai-nilai luhur Islam Berkemajuan dengan praktik bisnis modern kelas dunia. Melayani pemerintah, korporasi, institusi pendidikan, dan UMKM di 24+ negara dengan tata kelola amanah, kepatuhan syariah mutlak, dan teknologi cloud terenkripsi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">ISO 27001 & AAOIFI Standards</span>
              <span aria-hidden="true">·</span>
              <span>5 Pilar Konsultasi Spesialis</span>
              <span aria-hidden="true">·</span>
              <span>Virtual Room Terenkripsi AES-256</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('booking')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan Konsultasi Pakar</span>
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Buka Matriks Strategis (SWOT/BMC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('pillars')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'pillars'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5 Pilar Contoh Terbaik (Best Practices)</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'booking'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Booking Sesi Konsultasi Virtual ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'strategy'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Toolkit Strategi (SWOT, BMC, Journey, KPI)</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'knowledge'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manajemen Pengetahuan & Publikasi ({knowledgeItems.length})</span>
        </button>
      </div>

      {/* Tab 1: 5 Pillars / Best Practices Breakdown */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                5 Domain Utama Konsultasi Berbasis Syariah Skala Global
              </h3>
              <p className="text-xs text-slate-500">
                Setiap pilar dilengkapi dengan landasan fikih muamalah, arsitektur teknologi, serta studi kasus implementasi nyata.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillarsData.map(p => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {p.badge}
                    </span>
                    <span className="font-arabic text-slate-400 text-[11px]">{p.arabic}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {p.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Contoh Sukses: </span>
                      <span className="text-slate-600 dark:text-slate-400">{p.bestPracticeCase}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setPillarModalDetail(p)}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Bedah Konsep & Mekanisme</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const expert = experts.find(e => e.specialization === p.key) || experts[0];
                      setBookingModalExpert(expert);
                    }}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    Konsultasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Consultation Booking System & Virtual Sessions */}
      {activeTab === 'booking' && (
        <div className="space-y-6">
          
          {/* Active Bookings Strip */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Jadwal Sesi Konsultasi Virtual Terjadwal
                </h4>
                <p className="text-xs text-slate-500">
                  Sesi 1-on-1 virtual conference terenkripsi dengan penjaminan kerahasiaan informasi klien (NDA).
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                {bookings.length} Sesi Terkonfirmasi
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map(b => (
                <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{b.clientOrg}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{b.clientName}</span>
                    </div>

                    <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Konsultan: {b.expertName}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300">
                      Topik: "{b.topicSummary}"
                    </p>

                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] pt-1">
                      <span>{b.date} ({b.timeSlot})</span>
                      <span>{b.timezone}</span>
                      <span className="text-emerald-600">Key: {b.encryptionKey}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => window.open(b.virtualRoomUrl, '_blank')}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Masuk Virtual Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directory of Global Consultant Experts */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Dewan Pakar & Konsultan Senior Global
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {experts.map(expert => (
                <div
                  key={expert.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600 shadow-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <h5 className="font-bold text-slate-900 dark:text-white truncate">
                          {expert.name}
                        </h5>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium line-clamp-1">
                          {expert.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {expert.experienceYears} tahun pengalaman · Rating {expert.rating}/5.0
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Spesialisasi: </span>
                        <span>{expert.specialization}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Afiliasi: </span>
                        <span className="text-slate-500">{expert.affiliation}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Bahasa: </span>
                        <span className="text-slate-500">{expert.languages.join(' · ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-semibold">{expert.hourlyRate}</span>

                    <button
                      onClick={() => setBookingModalExpert(expert)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors"
                    >
                      Pilih Jadwal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Strategic Implementation Toolkit (SWOT, BMC, Journey, KPI) */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          
          {/* Sub-Switch for Strategy Tools */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-max">
            <button
              onClick={() => setStrategyView('swot')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                strategyView === 'swot'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Analisis SWOT
            </button>
            <button
              onClick={() => setStrategyView('bmc')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                strategyView === 'bmc'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Business Model Canvas (BMC)
            </button>
            <button
              onClick={() => setStrategyView('journey')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                strategyView === 'journey'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Customer Journey Map
            </button>
            <button
              onClick={() => setStrategyView('kpi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                strategyView === 'kpi'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Key Performance Indicators (KPI)
            </button>
          </div>

          {/* View 1: SWOT Matrix */}
          {strategyView === 'swot' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* Strengths */}
              <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">S</div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Kekuatan Utama (Strengths)
                  </h4>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li><strong>Legitimasi Keagamaan Kuat</strong>: Otoritas fatwa Majelis Tarjih & Tajdid berusia lebih dari satu abad dengan reputasi kredibel tanpa kompromi.</li>
                  <li><strong>Infrastruktur Nyata Terbesar</strong>: Didukung 170+ perguruan tinggi, ribuan madrasah, 120+ rumah sakit PKU, dan cabang istimewa luar negeri (PCIM).</li>
                  <li><strong>Teknologi Cloud Terenkripsi</strong>: Sistem digital terintegrasi SIMA dengan enkripsi AES-256 dan standar perbankan syariah ISO 27001.</li>
                  <li><strong>Kader Ahli Multidisiplin</strong>: Guru besar dan pakar dalam fikih muamalah, ekonomi makro, hukum internasional, dan teknologi hayati.</li>
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-700 text-white flex items-center justify-center font-bold text-xs">W</div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Tantangan Internal (Weaknesses)
                  </h4>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li><strong>Kecepatan Komersialisasi Global</strong>: Proses birokrasi persyarikatan yang mengedepankan musyawarah mufakat terkadang membutuhkan waktu respons lebih panjang dibanding firma konsultan murni swasta.</li>
                  <li><strong>Standardisasi Bahasa Asing</strong>: Kebutuhan konsultan yang fasih bahasa Arab fasih tingkat diplomatik dan istilah hukum komersial Anglo-Saxon.</li>
                  <li><strong>Skalabilitas Pemasaran Digital</strong>: Ketergantungan pada jaringan organik dibanding paid global acquisition campaigns.</li>
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center font-bold text-xs">O</div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                    Peluang Pasar Global (Opportunities)
                  </h4>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li><strong>Ekonomi Syariah Global $3.8T</strong>: Pertumbuhan pesat sektor makanan halal, keuangan Islam, farmasi ramah muslim di Asia, Timur Tengah, dan Eropa.</li>
                  <li><strong>Kebutuhan Audit Kepatuhan ESG Syariah</strong>: Investor global mencari instrumen Green Sukuk dan investasi dampak sosial (*impact investing*) yang bebas riba dan transparan.</li>
                  <li><strong>Pemberdayaan PCIM di 30 Negara</strong>: Mengoptimalkan diaspora kader Muhammadiyah di London, Washington DC, Tokyo, Kairo, Melbourne sebagai kantor perwakilan konsultan lokal.</li>
                </ul>
              </div>

              {/* Threats */}
              <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-700 text-white flex items-center justify-center font-bold text-xs">T</div>
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    Tantangan Eksternal (Threats)
                  </h4>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li><strong>Fragmentasi Regulasi Sertifikasi Halal</strong>: Perbedaan standar antara negara GCC, ASEAN, dan Eropa yang mempersyaratkan akreditasi ganda.</li>
                  <li><strong>Kompetisi dari Big Four Consulting</strong>: Firma multinasional (PwC, EY, Deloitte, KPMG) yang mulai membentuk divisi Islamic Advisory tersendiri.</li>
                  <li><strong>Volatilitas Geopolitik & Disrupsi AI Finansial</strong>: Kecepatan regulasi smart contract kripto dan decentralized finance (DeFi) yang menuntut ijtihad kontemporer kilat.</li>
                </ul>
              </div>

            </div>
          )}

          {/* View 2: Business Model Canvas (BMC) */}
          {strategyView === 'bmc' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 text-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Business Model Canvas (BMC) Global Consultant Islamicity
                </h4>
                <p className="text-slate-500">
                  Model bisnis holistik yang menggabungkan kemandirian finansial institusi dengan pengabdian kemanusiaan kaffah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                
                {/* 1. Key Partners */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">1. Mitra Kunci (Key Partners)</div>
                  <p className="text-slate-600 dark:text-slate-400">
                    • Majelis Tarjih & Lazismu<br/>
                    • OJK, Bank Indonesia & Kemenag<br/>
                    • Lembaga Sertifikasi Halal Luar Negeri<br/>
                    • Perguruan Tinggi Muhammadiyah (PTM)<br/>
                    • Platform Cloud & Payment Gateway
                  </p>
                </div>

                {/* 2. Key Activities */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">2. Aktivitas Kunci (Key Activities)</div>
                  <p className="text-slate-600 dark:text-slate-400">
                    • Audit & Sertifikasi Kepatuhan Syariah<br/>
                    • Perumusan Fatwa Kontemporer Bisnis<br/>
                    • Structuring Sukuk & Wakaf Produktif<br/>
                    • Penyelenggaraan Virtual Consultation<br/>
                    • Pelatihan & Akreditasi Eksekutif
                  </p>
                </div>

                {/* 3. Value Propositions */}
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-300 dark:border-emerald-800 space-y-1.5">
                  <div className="font-bold text-emerald-800 dark:text-emerald-200">3. Nilai Unik (Value Props)</div>
                  <p className="text-slate-700 dark:text-slate-300">
                    • 100% Maqashid Syariah Verified<br/>
                    • Rekam jejak integritas institusi 114+ tahun<br/>
                    • Enkripsi data klien tingkat perbankan<br/>
                    • Akses jaringan ribuan amal usaha (AUM)<br/>
                    • Solusi holistik bisnis, legal & teknologi
                  </p>
                </div>

                {/* 4. Customer Relationships */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">4. Hubungan Klien (Relationships)</div>
                  <p className="text-slate-600 dark:text-slate-400">
                    • Dedicated Sharia Advisory Desk<br/>
                    • Akun Pendampingan Virtual 1-on-1<br/>
                    • Komunitas Forum Eksekutif Muslim<br/>
                    • Transparansi Pelaporan & Audit Berkala
                  </p>
                </div>

                {/* 5. Customer Segments */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">5. Segmen Klien (Segments)</div>
                  <p className="text-slate-600 dark:text-slate-400">
                    • Korporasi & Eksportir Produk Halal<br/>
                    • Bank & Lembaga Keuangan Syariah<br/>
                    • Pengelola Kawasan Pariwisata & Hotel<br/>
                    • Yayasan & Lembaga Pendidikan Islam<br/>
                    • Pemerintahan & Regulator Global
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Struktur Biaya (Cost Structure)</div>
                  <p className="text-slate-500">
                    Infrastruktur server cloud terenkripsi, honorarium dewan pakar auditor, laboratorium uji DNA qPCR, pengembangan sistem riset, operasional sekretariat global.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">Arus Pendapatan (Revenue Streams)</div>
                  <p className="text-slate-500">
                    Retainer advisory fee korporasi, biaya audit & sertifikasi jaminan halal, royalti lisensi metodologi kurikulum, success fee penataan sukuk, pelatihan sertifikasi profesional.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* View 3: Customer Journey Map */}
          {strategyView === 'journey' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 text-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customer Journey Map: Pengalaman Klien Global Consultant
                </h4>
                <p className="text-slate-500">
                  Tahapan terstruktur mulai dari identifikasi kebutuhan syariah hingga sertifikasi dan pengawasan berkelanjutan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  {
                    step: '01. Discovery & Intake',
                    desc: 'Klien mengakses portal, memilih domain spesialisasi, dan mengisi initial sharia questionnaire online.',
                    output: 'Profil Kebutuhan Awal',
                  },
                  {
                    step: '02. Initial Assessment',
                    desc: 'Tim teknis menganalisis dokumen akad, rantai pasok, atau model bisnis untuk skrining kepatuhan fikih dasar.',
                    output: 'Gap Analysis Report',
                  },
                  {
                    step: '03. Advisory Session',
                    desc: 'Pertemuan virtual 1-on-1 dengan Dewan Pakar Tarjih melalui ruang video terenkripsi untuk perumusan solusi.',
                    output: 'Rekomendasi Putusan Tarjih',
                  },
                  {
                    step: '04. Implementation',
                    desc: 'Pendampingan restrukturisasi akad, perbaikan SOP rantai pasok halal, dan integrasi digital infrastructure.',
                    output: 'SOP Kepatuhan Syariah',
                  },
                  {
                    step: '05. Certification',
                    desc: 'Penerbitan opini kepatuhan syariah (Sharia Compliance Certificate) dan audit berkala otomatis di SIMA Cloud.',
                    output: 'Sertifikat & Audit Log',
                  },
                ].map((s, idx) => (
                  <div key={s.step} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">{s.step}</div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                      Output: <strong>{s.output}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 4: KPI Dashboard */}
          {strategyView === 'kpi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-500">Tingkat Kepatuhan Syariah Klien</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">99.8%</div>
                <div className="text-[11px] text-slate-500">Zero Critical Sharia Non-Compliance</div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-500">Indeks Kepuasan Klien Global</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">4.94 / 5.0</div>
                <div className="text-[11px] text-emerald-600 font-medium">Berdasarkan 340+ Ulasan Klien</div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-500">Waktu Respons Fatwa Bisnis</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">&lt; 48 Jam</div>
                <div className="text-[11px] text-slate-500">Fast-track Majelis Tarjih Panel</div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-500">Valuasi Portofolio Dikelola</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">Rp 14.2 T</div>
                <div className="text-[11px] text-slate-500">Sukuk, Wakaf & Ekosistem Halal</div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 4: Knowledge Management & Strategic Publications */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Repositori Pengetahuan & Standar Kebijakan Syariah Global
              </h3>
              <p className="text-xs text-slate-500">
                Akses dokumen panduan, whitepaper resmi, dan toolkit audit untuk praktisi dan akademisi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeItems.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {item.category}
                  </span>
                  <span className="text-slate-400">{item.publishedDate}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Penyusun: {item.author.slice(0, 32)}</span>

                  <button
                    onClick={() => alert(`Mengunduh publikasi: ${item.title} (${item.pages} Halaman)`)}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF ({item.pages} Hal)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Book Consultation Session */}
      {bookingModalExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Booking Sesi Konsultasi Virtual Pakar
                </h3>
                <span className="text-xs text-slate-500">
                  Terenkripsi AES-256 · Kerahasiaan Dilindungi Perjanjian NDA
                </span>
              </div>
              <button
                onClick={() => setBookingModalExpert(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs">
              <img
                src={bookingModalExpert.avatar}
                alt={bookingModalExpert.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-emerald-500 shrink-0"
              />
              <div>
                <div className="font-bold text-emerald-900 dark:text-emerald-200">{bookingModalExpert.name}</div>
                <div className="text-slate-600 dark:text-slate-300 text-[11px]">{bookingModalExpert.title}</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                  Spesialisasi: {bookingModalExpert.specialization}
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Pemohon / Eksekutif
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Institusi / Perusahaan / Yayasan
                </label>
                <input
                  type="text"
                  required
                  value={clientOrg}
                  onChange={e => setClientOrg(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Resmi Klien
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pilih Zona Waktu (Timezone)
                  </label>
                  <select
                    value={bookingTimezone}
                    onChange={e => setBookingTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Asia/Jakarta (GMT+7)">WIB (Jakarta / GMT+7)</option>
                    <option value="Asia/Makassar (GMT+8)">WITA (Makassar / GMT+8)</option>
                    <option value="Asia/Dubai (GMT+4)">GST (Dubai / GMT+4)</option>
                    <option value="Europe/London (GMT+0)">BST/UTC (London / GMT+0)</option>
                    <option value="America/New_York (GMT-5)">EST (New York / GMT-5)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pilih Tanggal Sesi
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pilih Slot Jam Konsultasi
                  </label>
                  <select
                    value={bookingTimeSlot}
                    onChange={e => setBookingTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  >
                    <option value="09:00 - 10:30 WIB">09:00 - 10:30 WIB</option>
                    <option value="10:00 - 11:30 WIB">10:00 - 11:30 WIB</option>
                    <option value="13:30 - 15:00 WIB">13:30 - 15:00 WIB</option>
                    <option value="15:30 - 17:00 WIB">15:30 - 17:00 WIB</option>
                    <option value="19:30 - 21:00 WIB">19:30 - 21:00 WIB (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Uraian Persoalan & Pokok Bahasan Konsultasi
                </label>
                <textarea
                  required
                  rows={3}
                  value={topicSummary}
                  onChange={e => setTopicSummary(e.target.value)}
                  placeholder="Deskripsikan latar belakang kasus bisnis, kebutuhan kepatuhan syariah, atau target penerbitan instrumen sukuk/sertifikasi..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setBookingModalExpert(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Konfirmasi Booking & Buat Virtual Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pillar Detailed Breakdown */}
      {pillarModalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {pillarModalDetail.title}
                </h3>
                <span className="text-xs text-slate-500">
                  Bedah Konsep, Prinsip & Mekanisme Kerja
                </span>
              </div>
              <button
                onClick={() => setPillarModalDetail(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Deskripsi & Ruang Lingkup:</h5>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillarModalDetail.description}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800">
                <h5 className="font-bold text-amber-900 dark:text-amber-200 mb-1">Tantangan Utama (Key Challenges):</h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {pillarModalDetail.challenges}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h5 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">Peluang & Potensi Pasar (Opportunities):</h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {pillarModalDetail.opportunities}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Studi Kasus Implementasi Terbaik:</h5>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {pillarModalDetail.bestPracticeCase}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Kebutuhan Infrastruktur & Platform:</h5>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  {pillarModalDetail.infrastructureNeeds.map(need => (
                    <li key={need}>{need}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPillarModalDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-lg"
              >
                Tutup Pembahasan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

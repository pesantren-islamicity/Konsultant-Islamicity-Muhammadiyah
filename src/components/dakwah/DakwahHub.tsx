import React, { useState } from 'react';
import {
  Tv,
  Play,
  Volume2,
  BookOpen,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Bookmark,
  Send,
  UserCheck
} from 'lucide-react';
import { DakwahItem, ConsultationQuestion, Language } from '../../types';
import { translations } from '../../services/i18n';

interface DakwahHubProps {
  dakwahList: DakwahItem[];
  consultations: ConsultationQuestion[];
  onAddConsultation: (q: ConsultationQuestion) => void;
  language: Language;
}

export const DakwahHub: React.FC<DakwahHubProps> = ({
  dakwahList,
  consultations,
  onAddConsultation,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'kajian' | 'consultation'>('kajian');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected video for player view
  const [activeVideo, setActiveVideo] = useState<DakwahItem>(dakwahList[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(false);

  // New consultation state
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newQuestionCategory, setNewQuestionCategory] = useState<'Ibadah' | 'Muamalah' | 'Keluarga Sakinah' | 'Hukum Kontemporer' | 'Zakat & Wakaf'>('Muamalah');
  const [newAuthorName, setNewAuthorName] = useState<string>('Anggota Persyarikatan');
  const [newAuthorBranch, setNewAuthorBranch] = useState<string>('PCM Gondomanan, Kauman');

  const filteredDakwah = dakwahList.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: ConsultationQuestion = {
      id: `cst-${Date.now()}`,
      authorName: newAuthorName,
      authorBranch: newAuthorBranch,
      question: newQuestionText.trim(),
      category: newQuestionCategory,
      date: new Date().toISOString().slice(0, 10),
      status: 'in_review',
    };

    onAddConsultation(newQ);
    setNewQuestionText('');
    setShowQuestionModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Sub-Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.dakwah.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.dakwah.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('kajian')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'kajian'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Kajian & Siaran Digital
          </button>
          <button
            onClick={() => setActiveTab('consultation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'consultation'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Konsultan Syariah & Fatwa
          </button>
        </div>
      </div>

      {activeTab === 'kajian' && (
        <div className="space-y-6">
          
          {/* Main Media Player Player Console */}
          <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* Media Viewport */}
              <div className="lg:col-span-2 relative bg-black flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
                {!isAudioOnly ? (
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover max-h-[420px] opacity-90"
                  />
                ) : (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-800/80 border-2 border-emerald-400 mx-auto flex items-center justify-center">
                      <Volume2 className="w-10 h-10 text-emerald-200" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
                        Podcast Dakwah Suara Muhammadiyah
                      </div>
                      <div className="text-base font-bold mt-1 text-slate-200">{activeVideo.speaker}</div>
                    </div>
                  </div>
                )}

                {/* Overlaid Badges & Play Button */}
                {activeVideo.isLiveNow && (
                  <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>LIVE STREAM</span>
                  </div>
                )}

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Jeda Siaran' : 'Putar Siaran'}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                  <Play className={`w-8 h-8 ${isPlaying ? 'fill-white' : 'translate-x-0.5 fill-white'}`} />
                </button>

                {/* Floating control bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAudioOnly(!isAudioOnly)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        isAudioOnly ? 'bg-emerald-600 text-white' : 'bg-slate-800/80 hover:bg-slate-700'
                      }`}
                    >
                      {isAudioOnly ? 'Mode Video' : 'Hemat Kuota (Audio Podcast)'}
                    </button>
                    <span>{activeVideo.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums">{activeVideo.viewers.toLocaleString('id-ID')} jemaah</span>
                  </div>
                </div>
              </div>

              {/* Lecture Metadata & Official Tarjih Rulings */}
              <div className="p-6 bg-slate-900 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
                <div className="space-y-4">
                  <div className="text-xs text-emerald-400 font-semibold tracking-wide">
                    {activeVideo.category}
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">
                    {activeVideo.title}
                  </h3>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-bold border border-emerald-600">
                      M
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{activeVideo.speaker}</div>
                      <div className="text-[11px] text-slate-400">{activeVideo.speakerTitle}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-2">
                    {activeVideo.summary}
                  </p>

                  {activeVideo.hptReference && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs space-y-1">
                      <div className="text-emerald-400 font-semibold text-[11px]">
                        Rujukan Putusan Tarjih / Dokumen Resmi:
                      </div>
                      <div className="text-slate-300 text-[11px] italic">
                        {activeVideo.hptReference}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Tanggal: {activeVideo.date}</span>
                  <button
                    onClick={() => alert('Tautan kajian telah disalin')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Search, Category Filters, and Grid */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari narasumber, topik, atau kata kunci kajian..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
              />
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['all', 'Kajian Tarjih', 'Ideologi Muhammadiyah', 'Keluarga Sakinah', 'Ekonomi Syariah'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'Semua Kajian' : cat}
                </button>
              ))}
            </div>

          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDakwah.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveVideo(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group cursor-pointer bg-white dark:bg-slate-900 border rounded-xl overflow-hidden transition-all hover:border-emerald-600 dark:hover:border-emerald-500 shadow-xs ${
                  activeVideo.id === item.id ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded">
                    {item.duration}
                  </div>
                  {item.isLiveNow && (
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      LIVE
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    {item.category}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {item.title}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.speaker}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>{item.date}</span>
                    <span className="font-mono">{item.viewers.toLocaleString('id-ID')} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Consultation Tab (Tanya Majelis Tarjih / Konsultan Islamicity) */}
      {activeTab === 'consultation' && (
        <div className="space-y-6">
          
          {/* Tarjih Consultant Banner */}
          <div className="p-6 bg-emerald-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                Layanan Fatwa & Konsultasi Syariah Online
              </div>
              <h3 className="text-xl font-bold">
                Tanya Jawab Majelis Tarjih dan Tajdid PP Muhammadiyah
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Konsultasikan persoalan ibadah, muamalah modern, ekonomi syariah, dan keluarga sakinah secara langsung kepada dewan pakar Tarjih dengan rujukan Al-Qur'an, Sunnah Shahihah, dan Himpunan Putusan Tarjih (HPT).
              </p>
            </div>

            <button
              onClick={() => setShowQuestionModal(true)}
              className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>{t.dakwah.askNewQuestion}</span>
            </button>
          </div>

          {/* List of Consultations */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Arsip Tanya Jawab & Fatwa Terkini
            </h4>

            {consultations.map(cst => (
              <div
                key={cst.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {cst.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="text-slate-500">{cst.authorName} ({cst.authorBranch})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{cst.date}</span>
                    {cst.status === 'answered' ? (
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        Telah Dijawab Tarjih
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                        Dalam Telaah Dewan Pakar
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  Q: "{cst.question}"
                </div>

                {/* Answer if available */}
                {cst.answer && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{cst.answer.consultantName}</span>
                        <span className="text-slate-500 dark:text-slate-400"> — {cst.answer.consultantTitle}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {cst.answer.answerText}
                    </p>

                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 font-mono">
                      <strong>Dalil & Ketetapan:</strong> {cst.answer.hptDalil}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* New Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ajukan Pertanyaan Konsultasi Syariah
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pertanyaan Anda akan ditelaah oleh Dewan Pakar Majelis Tarjih dan Tajdid PP Muhammadiyah.
            </p>

            <form onSubmit={handleSubmitQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Penanya
                </label>
                <input
                  type="text"
                  required
                  value={newAuthorName}
                  onChange={e => setNewAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Asal Cabang / Ranting
                </label>
                <input
                  type="text"
                  required
                  value={newAuthorBranch}
                  onChange={e => setNewAuthorBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Permasalahan
                </label>
                <select
                  value={newQuestionCategory}
                  onChange={e => setNewQuestionCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                >
                  <option value="Muamalah">Muamalah & Fiqih Finansial</option>
                  <option value="Ibadah">Ibadah Praktis (Shalat, Puasa, Thaharah)</option>
                  <option value="Keluarga Sakinah">Keluarga Sakinah & Munakahat</option>
                  <option value="Hukum Kontemporer">Hukum Kontemporer & Bioetika</option>
                  <option value="Zakat & Wakaf">Zakat, Infaq, Shadaqah & Wakaf</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Pertanyaan Lengkap
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  placeholder="Uraikan persoalan secara detail, kronologis masalah, dan apa yang ingin dipastikan menurut tuntunan syariat..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Kirim Pertanyaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Share2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BellRing
} from 'lucide-react';
import { IslamicEvent, PrayerTimeData, Language } from '../../types';
import { upcomingIslamicEvents, defaultPrayerTime } from '../../data/mockData';
import { translations } from '../../services/i18n';

interface IslamicCalendarProps {
  language: Language;
}

export const IslamicCalendar: React.FC<IslamicCalendarProps> = ({ language }) => {
  const t = translations[language];

  const [selectedCity, setSelectedCity] = useState<string>('Yogyakarta');
  const [selectedMonth, setSelectedMonth] = useState<string>('Jumadil Ula 1448 H');

  const cityPrayerTimes: Record<string, PrayerTimeData> = {
    Yogyakarta: {
      fajr: '04:12',
      sunrise: '05:27',
      dhuhr: '11:39',
      asr: '14:48',
      maghrib: '17:47',
      isha: '18:58',
      city: 'Yogyakarta / Kauman (GMT+7)',
      hijriDateStr: '12 Jumadil Ula 1448 H',
    },
    Jakarta: {
      fajr: '04:22',
      sunrise: '05:38',
      dhuhr: '11:49',
      asr: '14:59',
      maghrib: '17:58',
      isha: '19:09',
      city: 'DKI Jakarta / Menteng (GMT+7)',
      hijriDateStr: '12 Jumadil Ula 1448 H',
    },
    Surabaya: {
      fajr: '04:04',
      sunrise: '05:19',
      dhuhr: '11:31',
      asr: '14:40',
      maghrib: '17:39',
      isha: '18:50',
      city: 'Surabaya / Jawa Timur (GMT+7)',
      hijriDateStr: '12 Jumadil Ula 1448 H',
    },
    Medan: {
      fajr: '04:55',
      sunrise: '06:11',
      dhuhr: '12:15',
      asr: '15:32',
      maghrib: '18:15',
      isha: '19:25',
      city: 'Medan / Sumatera Utara (GMT+7)',
      hijriDateStr: '12 Jumadil Ula 1448 H',
    },
    Makassar: {
      fajr: '04:30',
      sunrise: '05:46',
      dhuhr: '11:57',
      asr: '15:10',
      maghrib: '18:05',
      isha: '19:16',
      city: 'Makassar / Sulawesi Selatan (GMT+8)',
      hijriDateStr: '12 Jumadil Ula 1448 H',
    },
  };

  const currentPrayer = cityPrayerTimes[selectedCity] || defaultPrayerTime;

  const handleSyncToGoogleCalendar = (event: IslamicEvent) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description} - Diselenggarakan oleh Persyarikatan Muhammadiyah`);
    const location = encodeURIComponent(event.location || 'Indonesia');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* Title & City Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.calendar}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kalender Islam Internasional Sinkron Hisab Hakiki Wujudul Hilal Majelis Tarjih Muhammadiyah
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-slate-500">Pilih Kota:</span>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white font-semibold"
          >
            <option value="Yogyakarta">Yogyakarta (Kauman)</option>
            <option value="Jakarta">DKI Jakarta (Pusat Dakwah)</option>
            <option value="Surabaya">Surabaya (Jawa Timur)</option>
            <option value="Medan">Medan (Sumatera Utara)</option>
            <option value="Makassar">Makassar (Sulawesi Selatan)</option>
          </select>
        </div>
      </div>

      {/* Synchronized Prayer Times Live Card */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-lg border border-emerald-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/80">
          <div>
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Waktu Shalat Sinkron Digital · Hisab Astronomi Ephemeris</span>
            </div>
            <h3 className="text-xl font-bold mt-1">
              {currentPrayer.city}
            </h3>
            <div className="text-sm text-emerald-200 mt-0.5 font-medium">
              Hari Ini: {currentPrayer.hijriDateStr} / {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-800 text-xs font-semibold rounded text-emerald-200">
              Koreksi Waktu: ±0 Detik
            </span>
          </div>
        </div>

        {/* 6 Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-center">
            <div className="text-xs text-emerald-300 font-medium">Subuh</div>
            <div className="text-xl font-bold font-mono mt-1 tabular-nums">{currentPrayer.fajr}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Fajar Shadiq (-20°)</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-center">
            <div className="text-xs text-emerald-300 font-medium">Syuruq (Terbit)</div>
            <div className="text-xl font-bold font-mono mt-1 tabular-nums">{currentPrayer.sunrise}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Matahari Terbit</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-center">
            <div className="text-xs text-emerald-300 font-medium">Dzuhur</div>
            <div className="text-xl font-bold font-mono mt-1 tabular-nums">{currentPrayer.dhuhr}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Zawalusy-Syams</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-center">
            <div className="text-xs text-emerald-300 font-medium">Ashar</div>
            <div className="text-xl font-bold font-mono mt-1 tabular-nums">{currentPrayer.asr}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Bayangan 1:1</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-700/80 border-2 border-emerald-300 text-center shadow-md">
            <div className="text-xs text-emerald-100 font-bold flex items-center justify-center gap-1">
              <span>Maghrib</span>
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
            </div>
            <div className="text-xl font-black font-mono mt-1 tabular-nums">{currentPrayer.maghrib}</div>
            <div className="text-[10px] text-emerald-200 mt-1">Berbuka Puasa</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-center">
            <div className="text-xs text-emerald-300 font-medium">Isya</div>
            <div className="text-xl font-bold font-mono mt-1 tabular-nums">{currentPrayer.isha}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Syafaq Ahmar (-18°)</div>
          </div>
        </div>
      </div>

      {/* Islamic Events & Persyarikatan Agenda List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Agenda Persyarikatan & Kalender Hijriah Terpadu
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Dapat langsung disinkronkan ke Google Calendar dan Apple iCal
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg self-start">
            Metode: Hisab Hakiki Wujudul Hilal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingIslamicEvents.map(event => (
            <div
              key={event.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors flex flex-col justify-between space-y-3 bg-slate-50/50 dark:bg-slate-800/30"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {event.hijriDate}
                  </span>
                  <span className="text-slate-500">{event.gregorianDate}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {event.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] truncate max-w-[200px]">
                  {event.location}
                </span>

                <button
                  onClick={() => handleSyncToGoogleCalendar(event)}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Sinkron Google Calendar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

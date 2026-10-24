import React, { useState } from 'react';
import {
  Bell,
  X,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Coins,
  Calendar,
  Volume2
} from 'lucide-react';
import { PushNotification, Language } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  onSendNewNotification: (notif: PushNotification) => void;
  language: Language;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onSendNewNotification,
}) => {
  const [showCreateCustom, setShowCreateCustom] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState<PushNotification['category']>('dakwah');
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const notif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      category: newCategory,
      timestamp: 'Baru saja',
      read: false,
    };

    onSendNewNotification(notif);
    setNewTitle('');
    setNewBody('');
    setShowCreateCustom(false);

    if (soundEnabled && typeof Audio !== 'undefined') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 tone
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch {
        // audio fail-safe
      }
    }
  };

  const getCategoryIcon = (category: PushNotification['category']) => {
    switch (category) {
      case 'prayer':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'dakwah':
        return <Radio className="w-4 h-4 text-rose-600" />;
      case 'zakat':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-all">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Pusat Notifikasi Push & Pengingat
              </h3>
              <span className="text-[10px] text-slate-500">
                Pembaruan Real-time Skala Nasional
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Sound toggle and Custom notification broadcast */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              soundEnabled ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{soundEnabled ? 'Suara Push Aktif' : 'Senyap'}</span>
          </button>

          <button
            onClick={() => setShowCreateCustom(!showCreateCustom)}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>{showCreateCustom ? 'Tutup Form' : 'Kirim Siaran Push'}</span>
          </button>
        </div>

        {/* Create Custom Notification Form */}
        {showCreateCustom && (
          <form onSubmit={handleCreateNotification} className="p-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5 text-xs">
            <div className="font-bold text-slate-800 dark:text-white">
              Siarkan Pengumuman / Pengingat Baru:
            </div>
            <input
              type="text"
              required
              placeholder="Judul notifikasi..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:text-white"
            />
            <textarea
              required
              rows={2}
              placeholder="Isi pesan pembaruan kegiatan..."
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:text-white"
            />
            <div className="flex items-center justify-between">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded dark:text-white"
              >
                <option value="dakwah">Dakwah Digital</option>
                <option value="prayer">Pengingat Shalat</option>
                <option value="zakat">LAZISMU / Zakat</option>
                <option value="emergency">Siaga MDMC</option>
                <option value="persyarikatan">Agenda Persyarikatan</option>
              </select>

              <button
                type="submit"
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
              >
                Kirim Sekarang
              </button>
            </div>
          </form>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 opacity-75'
                  : 'bg-emerald-50/50 dark:bg-emerald-950/30'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.body}
                </p>

                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  {notif.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-950 text-xs text-slate-500">
          Sistem Notifikasi Web Push API Terenkripsi SSL/TLS
        </div>

      </div>
    </div>
  );
};

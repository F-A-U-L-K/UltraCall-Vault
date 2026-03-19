import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIncoming, PhoneOutgoing, Phone, Star, Clock, Mic, Radio,
  ChevronRight, Trash2, Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRecordingsStore } from '../stores/recordingsStore';
import { useAppStore } from '../stores/appStore';

export function RecordingsList() {
  const { recordings } = useRecordingsStore();
  const { toggleFavorite, deleteRecording } = useRecordingsStore();
  const { setSelectedRecordingId } = useAppStore();

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getDirectionIcon = (dir: string) => {
    switch (dir) {
      case 'incoming': return <PhoneIncoming className="w-4 h-4 text-vault-cyan" />;
      case 'outgoing': return <PhoneOutgoing className="w-4 h-4 text-vault-purple" />;
      default: return <Phone className="w-4 h-4 text-vault-muted" />;
    }
  };

  const getSourceBadge = (method: string) => {
    switch (method) {
      case 'system': return { icon: <Radio className="w-3 h-3" />, label: 'SYS', color: 'text-vault-cyan bg-vault-cyan/10' };
      case 'microphone': return { icon: <Mic className="w-3 h-3" />, label: 'MIC', color: 'text-vault-purple bg-vault-purple/10' };
      case 'both': return { icon: <Radio className="w-3 h-3" />, label: 'DUAL', color: 'text-vault-success bg-vault-success/10' };
      default: return { icon: <Mic className="w-3 h-3" />, label: 'UNK', color: 'text-vault-muted bg-vault-muted/10' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-lg font-bold text-white">Recordings</h2>
          <p className="text-xs text-vault-muted">{recordings.length} total recordings</p>
        </div>
      </div>

      <AnimatePresence>
        {recordings.length === 0 ? (
          <motion.div
            className="glass-card p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Phone className="w-12 h-12 mx-auto text-vault-muted mb-3" />
            <p className="text-sm text-vault-muted">No recordings found</p>
            <p className="text-xs text-vault-muted/60 mt-1">Start a simulated call from the Home tab</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {recordings.map((rec, idx) => {
              const source = getSourceBadge(rec.sourceMethod);
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.03 }}
                  className="glass-card p-4 hover:border-vault-cyan/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Direction Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      rec.direction === 'incoming' ? 'bg-vault-cyan/10' : 'bg-vault-purple/10'
                    }`}>
                      {getDirectionIcon(rec.direction)}
                    </div>

                    {/* Content */}
                    <button
                      onClick={() => setSelectedRecordingId(rec.id)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white truncate">
                          {rec.contactName || rec.phoneNumber}
                        </p>
                        {rec.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-vault-warning fill-vault-warning flex-shrink-0" />
                        )}
                      </div>
                      {rec.contactName && (
                        <p className="text-xs text-vault-muted mb-1">{rec.phoneNumber}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-vault-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(rec.startTime), { addSuffix: true })}
                        </span>
                        <span>{formatDuration(rec.durationSeconds || 0)}</span>
                        <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium ${source.color}`}>
                          {source.icon} {source.label}
                        </span>
                      </div>
                      {rec.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          <Tag className="w-3 h-3 text-vault-muted" />
                          {rec.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-vault-glass border border-vault-border text-[10px] text-vault-muted">
                              {tag}
                            </span>
                          ))}
                          {rec.tags.length > 3 && (
                            <span className="text-[10px] text-vault-muted">+{rec.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </button>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(rec.id); }}
                        className="p-1.5 rounded-lg hover:bg-vault-glass transition-colors"
                      >
                        <Star className={`w-4 h-4 ${rec.isFavorite ? 'text-vault-warning fill-vault-warning' : 'text-vault-muted'}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteRecording(rec.id); }}
                        className="p-1.5 rounded-lg hover:bg-vault-danger/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-vault-muted hover:text-vault-danger" />
                      </button>
                      <button
                        onClick={() => setSelectedRecordingId(rec.id)}
                        className="p-1.5 rounded-lg hover:bg-vault-glass transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-vault-muted" />
                      </button>
                    </div>
                  </div>

                  {/* Transcript preview */}
                  <p className="text-xs text-vault-text/50 mt-2 line-clamp-2 leading-relaxed pl-13">
                    {rec.transcript.slice(0, 120)}...
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

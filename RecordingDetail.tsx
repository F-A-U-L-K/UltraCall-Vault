import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Play, Pause, Trash2, Share2,
  PhoneIncoming, PhoneOutgoing, Phone, Radio, Mic,
  Sparkles, Tag, Calendar, FileText, Copy, Check
} from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '../stores/appStore';
import { useRecordingsStore } from '../stores/recordingsStore';

export function RecordingDetail() {
  const { selectedRecordingId, setSelectedRecordingId } = useAppStore();
  const { recordings, toggleFavorite, deleteRecording } = useRecordingsStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [activeWord, setActiveWord] = useState(-1);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recording = recordings.find(r => r.id === selectedRecordingId);

  const words = useMemo(() => recording?.transcript.split(' ') || [], [recording?.transcript]);

  useEffect(() => {
    if (!isPlaying || !recording) return;
    const duration = recording.durationSeconds || 60;
    const totalWords = words.length;
    const msPerTick = (duration * 1000) / 100;
    const wordsPerTick = totalWords / 100;

    intervalRef.current = setInterval(() => {
      setPlayProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        setActiveWord(Math.floor(p * wordsPerTick));
        return p + 1;
      });
    }, msPerTick);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, recording, words.length]);

  if (!recording) return null;

  const togglePlay = () => {
    if (playProgress >= 100) {
      setPlayProgress(0);
      setActiveWord(-1);
    }
    setIsPlaying(!isPlaying);
  };

  const handleDelete = () => {
    deleteRecording(recording.id);
    setSelectedRecordingId(null);
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(recording.transcript).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((playProgress / 100) * (recording.durationSeconds || 0));

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedRecordingId(null)}
          className="p-2 rounded-lg hover:bg-vault-glass transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-vault-muted" />
        </button>
        <div className="flex-1">
          <h2 className="font-orbitron text-sm font-bold text-white">Recording Detail</h2>
          <p className="text-xs text-vault-muted">{recording.callId}</p>
        </div>
        <button
          onClick={() => toggleFavorite(recording.id)}
          className="p-2 rounded-lg hover:bg-vault-glass transition-colors"
        >
          <Star className={`w-5 h-5 ${recording.isFavorite ? 'text-vault-warning fill-vault-warning' : 'text-vault-muted'}`} />
        </button>
      </div>

      {/* Contact Info */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            recording.direction === 'incoming' ? 'bg-vault-cyan/10' : 'bg-vault-purple/10'
          }`}>
            {recording.direction === 'incoming'
              ? <PhoneIncoming className="w-7 h-7 text-vault-cyan" />
              : recording.direction === 'outgoing'
              ? <PhoneOutgoing className="w-7 h-7 text-vault-purple" />
              : <Phone className="w-7 h-7 text-vault-muted" />
            }
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-white">
              {recording.contactName || 'Unknown Contact'}
            </p>
            <p className="text-sm text-vault-muted">{recording.phoneNumber}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-vault-muted">
              <span className="capitalize flex items-center gap-1">
                {recording.direction === 'incoming' ? <PhoneIncoming className="w-3 h-3 text-vault-cyan" /> : <PhoneOutgoing className="w-3 h-3 text-vault-purple" />}
                {recording.direction}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(recording.startTime), 'MMM d, yyyy · h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron text-xs text-vault-muted">AUDIO PLAYBACK</h3>
          <div className="flex items-center gap-2">
            {recording.sourceMethod === 'both' || recording.sourceMethod === 'system' ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-vault-cyan bg-vault-cyan/10">
                <Radio className="w-3 h-3" /> SYS
              </span>
            ) : null}
            {recording.sourceMethod === 'both' || recording.sourceMethod === 'microphone' ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-vault-purple bg-vault-purple/10">
                <Mic className="w-3 h-3" /> MIC
              </span>
            ) : null}
          </div>
        </div>

        {/* Simulated Waveform */}
        <div className="relative h-20 flex items-center gap-[2px] overflow-hidden rounded-lg bg-vault-glass p-2">
          {Array.from({ length: 80 }).map((_, i) => {
            const h = 10 + Math.sin(i * 0.3) * 15 + Math.random() * 20;
            const isActive = (i / 80) * 100 <= playProgress;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors duration-100 ${
                  isActive ? 'bg-gradient-to-t from-vault-cyan to-vault-purple' : 'bg-vault-muted/20'
                }`}
                style={{ height: `${h}%`, minWidth: '2px' }}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-vault-cyan to-vault-purple flex items-center justify-center hover:shadow-lg hover:shadow-vault-cyan/20 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-[#000111]" /> : <Play className="w-5 h-5 text-[#000111] ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-vault-glass overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setPlayProgress(pct);
                setActiveWord(Math.floor((pct / 100) * words.length));
              }}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-vault-cyan to-vault-purple transition-all"
                style={{ width: `${playProgress}%` }}
              />
            </div>
          </div>
          <span className="font-orbitron text-xs text-vault-muted w-20 text-right">
            {formatDuration(currentTime)} / {formatDuration(recording.durationSeconds || 0)}
          </span>
        </div>
      </div>

      {/* AI Summary */}
      {recording.summary && (
        <div className="glass-card-purple p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-vault-purple" />
            <h3 className="font-orbitron text-xs text-vault-purple">AI SUMMARY</h3>
          </div>
          <p className="text-sm text-vault-text/80 leading-relaxed">{recording.summary}</p>
        </div>
      )}

      {/* Transcript */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-vault-cyan" />
            <h3 className="font-orbitron text-xs text-vault-cyan">TRANSCRIPT</h3>
          </div>
          <button
            onClick={copyTranscript}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-vault-muted hover:text-white hover:bg-vault-glass transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-vault-success" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="text-sm leading-relaxed">
          {words.map((word, i) => (
            <span
              key={i}
              className={`transition-colors duration-200 ${
                i <= activeWord
                  ? 'text-vault-cyan'
                  : 'text-vault-text/60'
              } ${i === activeWord ? 'font-semibold text-white bg-vault-cyan/10 px-0.5 rounded' : ''}`}
            >
              {word}{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      {recording.tags.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-vault-muted" />
            <h3 className="font-orbitron text-xs text-vault-muted">TAGS</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recording.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-vault-glass border border-vault-border text-xs text-vault-text/70">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 glass-card p-3 flex items-center justify-center gap-2 text-sm text-vault-muted hover:text-white hover:border-vault-cyan/30 transition-colors">
          <Share2 className="w-4 h-4" /> Export
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 glass-card p-3 flex items-center justify-center gap-2 text-sm text-vault-danger/70 hover:text-vault-danger hover:border-vault-danger/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </motion.div>
  );
}

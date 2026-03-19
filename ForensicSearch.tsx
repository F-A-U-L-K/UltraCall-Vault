import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, Star, Clock,
  PhoneIncoming, PhoneOutgoing, Phone, ArrowUpDown,
  Tag, Calendar, Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRecordingsStore } from '../stores/recordingsStore';
import { useAppStore } from '../stores/appStore';
import type { FilterDirection, SortBy } from '../types';

export function ForensicSearch() {
  const { filters, setFilters, resetFilters, getFilteredRecordings, recordings } = useRecordingsStore();
  const { setSelectedRecordingId, setActiveTab } = useAppStore();

  const filteredRecordings = useMemo(() => getFilteredRecordings(), [
    recordings, filters.keyword, filters.direction, filters.minDuration,
    filters.maxDuration, filters.dateFrom, filters.dateTo, filters.tags,
    filters.favoritesOnly, filters.sortBy, filters.sortOrder,
  ]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    recordings.forEach(r => r.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [recordings]);

  const hasActiveFilters = filters.keyword || filters.direction !== 'all' ||
    filters.minDuration > 0 || filters.maxDuration < 3600 ||
    filters.dateFrom || filters.dateTo || filters.tags.length > 0 || filters.favoritesOnly;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTag = (tag: string) => {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    setFilters({ tags });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-orbitron text-lg font-bold text-white">Forensic Search</h2>
          <p className="text-xs text-vault-muted">Deep search across all recordings</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-vault-danger bg-vault-danger/10 hover:bg-vault-danger/20 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="glass-card p-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
          <input
            type="text"
            placeholder="Search transcripts, contacts, phone numbers..."
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-white placeholder-vault-muted focus:outline-none font-inter"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'incoming', 'outgoing'] as FilterDirection[]).map(dir => (
          <button
            key={dir}
            onClick={() => setFilters({ direction: dir })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filters.direction === dir
                ? 'bg-vault-cyan/20 text-vault-cyan border border-vault-cyan/30'
                : 'bg-vault-glass text-vault-muted border border-vault-border hover:border-vault-cyan/20'
            }`}
          >
            {dir === 'incoming' && <PhoneIncoming className="w-3 h-3" />}
            {dir === 'outgoing' && <PhoneOutgoing className="w-3 h-3" />}
            {dir === 'all' && <Phone className="w-3 h-3" />}
            {dir.charAt(0).toUpperCase() + dir.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setFilters({ favoritesOnly: !filters.favoritesOnly })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            filters.favoritesOnly
              ? 'bg-vault-warning/20 text-vault-warning border border-vault-warning/30'
              : 'bg-vault-glass text-vault-muted border border-vault-border hover:border-vault-warning/20'
          }`}
        >
          <Star className="w-3 h-3" /> Favorites
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontal className="w-4 h-4 text-vault-cyan" />
          <h3 className="font-orbitron text-xs text-vault-cyan">FILTERS</h3>
        </div>

        {/* Duration Slider */}
        <div>
          <label className="text-xs text-vault-muted flex items-center gap-1 mb-2">
            <Clock className="w-3 h-3" /> Duration Range
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-vault-muted w-10">{formatDuration(filters.minDuration)}</span>
            <input
              type="range"
              min={0}
              max={600}
              step={10}
              value={filters.minDuration}
              onChange={(e) => setFilters({ minDuration: Number(e.target.value) })}
              className="flex-1 accent-cyan-400"
            />
            <input
              type="range"
              min={0}
              max={3600}
              step={10}
              value={filters.maxDuration}
              onChange={(e) => setFilters({ maxDuration: Number(e.target.value) })}
              className="flex-1 accent-purple-400"
            />
            <span className="text-xs text-vault-muted w-10 text-right">{formatDuration(filters.maxDuration)}</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-vault-muted flex items-center gap-1 mb-1.5">
              <Calendar className="w-3 h-3" /> From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-vault-glass border border-vault-border text-xs text-white focus:outline-none focus:border-vault-cyan/30"
            />
          </div>
          <div>
            <label className="text-xs text-vault-muted flex items-center gap-1 mb-1.5">
              <Calendar className="w-3 h-3" /> To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ dateTo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-vault-glass border border-vault-border text-xs text-white focus:outline-none focus:border-vault-cyan/30"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-vault-muted">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </div>
          <div className="flex gap-1">
            {(['date', 'duration', 'name'] as SortBy[]).map(s => (
              <button
                key={s}
                onClick={() => setFilters({ sortBy: s })}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  filters.sortBy === s
                    ? 'bg-vault-cyan/20 text-vault-cyan'
                    : 'bg-vault-glass text-vault-muted hover:text-white'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFilters({ sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })}
            className="px-2 py-1 rounded-md text-[10px] font-medium bg-vault-glass text-vault-muted hover:text-white transition-colors"
          >
            {filters.sortOrder === 'desc' ? '↓ DESC' : '↑ ASC'}
          </button>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-vault-purple" />
            <h3 className="font-orbitron text-xs text-vault-purple">TAGS</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  filters.tags.includes(tag)
                    ? 'bg-vault-purple/20 text-vault-purple border border-vault-purple/30'
                    : 'bg-vault-glass text-vault-muted border border-vault-border hover:border-vault-purple/20'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-vault-muted" />
          <span className="font-orbitron text-xs text-vault-muted">
            {filteredRecordings.length} RESULT{filteredRecordings.length !== 1 ? 'S' : ''}
          </span>
        </div>

        <AnimatePresence>
          {filteredRecordings.length === 0 ? (
            <motion.div
              className="glass-card p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="w-8 h-8 mx-auto text-vault-muted mb-2" />
              <p className="text-sm text-vault-muted">No recordings match your filters</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredRecordings.map((rec, idx) => (
                <motion.button
                  key={rec.id}
                  onClick={() => {
                    setSelectedRecordingId(rec.id);
                    setActiveTab('recordings');
                  }}
                  className="w-full glass-card p-3 flex items-center gap-3 hover:border-vault-cyan/30 transition-colors text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    rec.direction === 'incoming' ? 'bg-vault-cyan/10' : 'bg-vault-purple/10'
                  }`}>
                    {rec.direction === 'incoming'
                      ? <PhoneIncoming className="w-4 h-4 text-vault-cyan" />
                      : <PhoneOutgoing className="w-4 h-4 text-vault-purple" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {rec.contactName || rec.phoneNumber}
                    </p>
                    <p className="text-xs text-vault-muted">
                      {formatDistanceToNow(new Date(rec.startTime), { addSuffix: true })}
                      {' · '}{formatDuration(rec.durationSeconds || 0)}
                    </p>
                    {filters.keyword && (
                      <p className="text-xs text-vault-text/40 mt-1 truncate">
                        ...{highlightMatch(rec.transcript, filters.keyword)}
                      </p>
                    )}
                  </div>
                  {rec.isFavorite && <Star className="w-3.5 h-3.5 text-vault-warning fill-vault-warning flex-shrink-0" />}
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function highlightMatch(text: string, keyword: string): string {
  if (!keyword) return text.slice(0, 80);
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return text.slice(0, 80);
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + keyword.length + 30);
  return text.slice(start, end);
}

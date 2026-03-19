import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './stores/appStore';
import { useRecordingsStore } from './stores/recordingsStore';
import { db } from './db/database';
import { generateSeedRecordings } from './db/seed';
import { LegalModal } from './components/LegalModal';
import { SetupWizard } from './components/SetupWizard';
import { Dashboard } from './components/Dashboard';
import { RecordingsList } from './components/RecordingsList';
import { RecordingDetail } from './components/RecordingDetail';
import { ForensicSearch } from './components/ForensicSearch';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';

export function App() {
  const {
    hasCompletedLegal,
    hasCompletedSetup,
    activeTab,
    selectedRecordingId,
    isSeeded,
    setIsSeeded,
  } = useAppStore();
  const loadRecordings = useRecordingsStore(s => s.loadRecordings);

  // Seed database on first launch
  useEffect(() => {
    const init = async () => {
      if (!isSeeded) {
        const count = await db.recordings.count();
        if (count === 0) {
          const seeds = generateSeedRecordings();
          await db.recordings.bulkAdd(seeds);
        }
        setIsSeeded(true);
      }
      await loadRecordings();
    };
    init();
  }, [isSeeded, setIsSeeded, loadRecordings]);

  // Show legal modal first
  if (!hasCompletedLegal) {
    return <LegalModal />;
  }

  // Show setup wizard
  if (!hasCompletedSetup) {
    return <SetupWizard />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-[#000111] relative">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-vault-cyan/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-vault-purple/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24">
        <AnimatePresence mode="wait">
          {selectedRecordingId && activeTab === 'recordings' ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              <RecordingDetail />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && <Dashboard />}
              {activeTab === 'recordings' && <RecordingsList />}
              {activeTab === 'search' && <ForensicSearch />}
              {activeTab === 'settings' && <Settings />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

import { motion } from 'framer-motion';
import { Home, ListMusic, Search, Settings } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

const tabs = [
  { key: 'home' as const, icon: Home, label: 'Home' },
  { key: 'recordings' as const, icon: ListMusic, label: 'Recordings' },
  { key: 'search' as const, icon: Search, label: 'Search' },
  { key: 'settings' as const, icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const { activeTab, setActiveTab, setSelectedRecordingId } = useAppStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-lg mx-auto">
        <div className="glass-card rounded-none rounded-t-2xl border-b-0 px-2 py-1 flex items-center justify-around"
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          {tabs.map(({ key, icon: Icon, label }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  if (key !== 'recordings') setSelectedRecordingId(null);
                }}
                className="relative flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-vault-cyan/10 rounded-xl"
                    layoutId="nav-active"
                    transition={{ type: 'spring', damping: 25 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-vault-cyan' : 'text-vault-muted'}`} />
                <span className={`text-[10px] relative z-10 font-medium ${isActive ? 'text-vault-cyan' : 'text-vault-muted'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Shield, Database, Mic, Radio,
  Bell, Trash2, Download, Info, ChevronRight, Lock,
  Smartphone, Zap, AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useRecordingsStore } from '../stores/recordingsStore';
import { db } from '../db/database';

export function Settings() {
  const { recordings } = useRecordingsStore();
  const permissions = usePermissionsStore();
  const { setHasCompletedLegal, setHasCompletedSetup, setIsSeeded } = useAppStore();
  const [showReset, setShowReset] = useState(false);

  const totalDuration = recordings.reduce((s, r) => s + (r.durationSeconds || 0), 0);
  const estimatedSizeMB = (recordings.length * 2.4).toFixed(1);

  const handleReset = async () => {
    await db.recordings.clear();
    setHasCompletedLegal(false);
    setHasCompletedSetup(false);
    setIsSeeded(false);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-orbitron text-lg font-bold text-white">Settings</h2>
        <p className="text-xs text-vault-muted">Configure your vault</p>
      </div>

      {/* App Info */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vault-cyan/20 to-vault-purple/20 flex items-center justify-center">
            <Zap className="w-7 h-7 text-vault-cyan" />
          </div>
          <div>
            <h3 className="font-orbitron text-sm font-bold neon-text">UltraCall Vault</h3>
            <p className="text-xs text-vault-muted">Version 2026.1.0</p>
            <p className="text-[10px] text-vault-muted/60 mt-0.5">Build: NEON-GLASS-2026</p>
          </div>
        </div>
      </div>

      {/* Recording Settings */}
      <div className="space-y-1">
        <h3 className="font-orbitron text-xs text-vault-muted px-1 mb-2">RECORDING</h3>
        <SettingItem icon={<Mic className="w-4 h-4" />} label="Audio Source" value="Dual-Path" />
        <SettingItem icon={<Radio className="w-4 h-4" />} label="Quality" value="320 kbps" />
        <SettingItem icon={<SettingsIcon className="w-4 h-4" />} label="Auto-Record" value="Enabled" />
        <SettingItem icon={<Bell className="w-4 h-4" />} label="Notifications" value="On" />
      </div>

      {/* Permissions */}
      <div className="space-y-1">
        <h3 className="font-orbitron text-xs text-vault-muted px-1 mb-2">PERMISSIONS</h3>
        <PermItem label="Microphone" granted={permissions.microphone} />
        <PermItem label="Call Log" granted={permissions.callLog} />
        <PermItem label="Accessibility" granted={permissions.accessibility} />
      </div>

      {/* Storage */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-vault-cyan" />
          <h3 className="font-orbitron text-xs text-vault-cyan">STORAGE</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="font-orbitron text-lg font-bold text-white">{recordings.length}</p>
            <p className="text-[10px] text-vault-muted">Recordings</p>
          </div>
          <div className="text-center">
            <p className="font-orbitron text-lg font-bold text-white">{estimatedSizeMB}</p>
            <p className="text-[10px] text-vault-muted">MB Used</p>
          </div>
          <div className="text-center">
            <p className="font-orbitron text-lg font-bold text-white">{Math.floor(totalDuration / 60)}</p>
            <p className="text-[10px] text-vault-muted">Minutes</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-vault-glass overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-vault-cyan to-vault-purple"
            style={{ width: `${Math.min((recordings.length / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-vault-muted text-center">Encrypted local storage via Dexie.js</p>
      </div>

      {/* Security */}
      <div className="space-y-1">
        <h3 className="font-orbitron text-xs text-vault-muted px-1 mb-2">SECURITY</h3>
        <SettingItem icon={<Shield className="w-4 h-4" />} label="Encryption" value="AES-256" />
        <SettingItem icon={<Lock className="w-4 h-4" />} label="Vault Lock" value="Biometric" />
        <SettingItem icon={<Smartphone className="w-4 h-4" />} label="Device Binding" value="Active" />
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full glass-card p-4 flex items-center gap-3 hover:border-vault-cyan/30 transition-colors">
          <Download className="w-4 h-4 text-vault-cyan" />
          <span className="text-sm text-vault-text flex-1 text-left">Export All Data</span>
          <ChevronRight className="w-4 h-4 text-vault-muted" />
        </button>
        <button className="w-full glass-card p-4 flex items-center gap-3 hover:border-vault-cyan/30 transition-colors">
          <Info className="w-4 h-4 text-vault-cyan" />
          <span className="text-sm text-vault-text flex-1 text-left">Legal & Privacy</span>
          <ChevronRight className="w-4 h-4 text-vault-muted" />
        </button>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-4 border-vault-danger/20 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-vault-danger" />
          <h3 className="font-orbitron text-xs text-vault-danger">DANGER ZONE</h3>
        </div>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full p-3 rounded-lg border border-vault-danger/20 text-sm text-vault-danger/70 hover:text-vault-danger hover:border-vault-danger/40 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Reset Everything
          </button>
        ) : (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <p className="text-xs text-vault-danger/70">This will delete all recordings and reset the app. This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 p-2.5 rounded-lg bg-vault-danger text-white text-sm font-semibold hover:bg-vault-danger/80 transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 p-2.5 rounded-lg border border-vault-border text-sm text-vault-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="font-orbitron text-[10px] text-vault-muted/40">ULTRACALL VAULT 2026 · NEON GLASSMORPHISM EDITION</p>
        <p className="text-[10px] text-vault-muted/30 mt-1">Simulation Mode · No actual calls are recorded</p>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-3 flex items-center gap-3">
      <span className="text-vault-cyan">{icon}</span>
      <span className="text-sm text-vault-text flex-1">{label}</span>
      <span className="text-xs text-vault-muted">{value}</span>
    </div>
  );
}

function PermItem({ label, granted }: { label: string; granted: boolean }) {
  return (
    <div className="glass-card p-3 flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${granted ? 'bg-vault-success' : 'bg-vault-danger'}`} />
      <span className="text-sm text-vault-text flex-1">{label}</span>
      <span className={`text-xs ${granted ? 'text-vault-success' : 'text-vault-danger'}`}>
        {granted ? 'Granted' : 'Denied'}
      </span>
    </div>
  );
}

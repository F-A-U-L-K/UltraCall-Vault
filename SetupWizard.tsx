import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Phone, Accessibility, ChevronRight, ChevronLeft, Check,
  Zap, Shield, Radio, Settings, Sparkles
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { usePermissionsStore } from '../stores/permissionsStore';

const steps = [
  { title: 'Welcome', subtitle: 'Your Premium Call Vault' },
  { title: 'Permissions', subtitle: 'Required Access' },
  { title: 'Test Call', subtitle: 'Verify Setup' },
  { title: 'Recording Rules', subtitle: 'Auto-Record Config' },
  { title: 'All Set!', subtitle: 'Ready to Record' },
];

export function SetupWizard() {
  const { setupStep, setSetupStep, setHasCompletedSetup } = useAppStore();
  const permissions = usePermissionsStore();
  const [testCallDone, setTestCallDone] = useState(false);
  const [testCallRunning, setTestCallRunning] = useState(false);
  const [autoRecord, setAutoRecord] = useState(true);
  const [recordBoth, setRecordBoth] = useState(true);

  const canProceed = () => {
    switch (setupStep) {
      case 0: return true;
      case 1: return permissions.microphone && permissions.callLog && permissions.accessibility;
      case 2: return testCallDone;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const next = () => {
    if (setupStep < 4) setSetupStep(setupStep + 1);
    else setHasCompletedSetup(true);
  };

  const prev = () => {
    if (setupStep > 0) setSetupStep(setupStep - 1);
  };

  const simulateTestCall = () => {
    setTestCallRunning(true);
    setTimeout(() => {
      setTestCallRunning(false);
      setTestCallDone(true);
    }, 3000);
  };

  const renderStep = () => {
    switch (setupStep) {
      case 0:
        return <StepIntro />;
      case 1:
        return <StepPermissions permissions={permissions} />;
      case 2:
        return <StepTestCall running={testCallRunning} done={testCallDone} onStart={simulateTestCall} />;
      case 3:
        return <StepRules autoRecord={autoRecord} setAutoRecord={setAutoRecord} recordBoth={recordBoth} setRecordBoth={setRecordBoth} />;
      case 4:
        return <StepFinish />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#000111] p-4">
      <motion.div
        className="glass-card w-full max-w-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress Bar */}
        <div className="p-4 border-b border-vault-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-orbitron text-xs text-vault-cyan">Step {setupStep + 1} of 5</span>
            <span className="text-xs text-vault-muted">{steps[setupStep].subtitle}</span>
          </div>
          <div className="h-1.5 bg-vault-glass rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-vault-cyan to-vault-purple"
              animate={{ width: `${((setupStep + 1) / 5) * 100}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={setupStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-vault-border flex items-center justify-between">
          <button
            onClick={prev}
            disabled={setupStep === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-vault-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed()}
            className="neon-button flex items-center gap-2 text-sm font-orbitron"
          >
            {setupStep === 4 ? 'Launch Vault' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StepIntro() {
  return (
    <div className="text-center space-y-6">
      <motion.div
        className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-vault-cyan/20 to-vault-purple/20 flex items-center justify-center"
        animate={{ boxShadow: ['0 0 20px rgba(0,245,255,0.2)', '0 0 40px rgba(0,245,255,0.4)', '0 0 20px rgba(0,245,255,0.2)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-10 h-10 text-vault-cyan" />
      </motion.div>
      <div>
        <h2 className="font-orbitron text-2xl font-bold neon-text mb-2">UltraCall Vault</h2>
        <p className="font-orbitron text-sm text-vault-purple">2026 Edition</p>
      </div>
      <p className="text-sm text-vault-text/70 leading-relaxed">
        Welcome to the most advanced call recording vault. We'll guide you through the setup process to ensure optimal recording quality and legal compliance.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Radio, label: 'Dual Record' },
          { icon: Sparkles, label: 'AI Transcribe' },
          { icon: Shield, label: 'Encrypted' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="p-3 rounded-xl bg-vault-glass border border-vault-border text-center">
            <Icon className="w-5 h-5 mx-auto mb-1.5 text-vault-cyan" />
            <span className="text-xs text-vault-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPermissions({ permissions }: { permissions: ReturnType<typeof usePermissionsStore.getState> }) {
  const grant = usePermissionsStore(s => s.grantPermission);

  const perms = [
    { key: 'microphone' as const, icon: Mic, label: 'Microphone', desc: 'Required for audio capture', granted: permissions.microphone },
    { key: 'callLog' as const, icon: Phone, label: 'Call Log', desc: 'Access call metadata', granted: permissions.callLog },
    { key: 'accessibility' as const, icon: Accessibility, label: 'Accessibility', desc: 'Detect incoming/outgoing calls', granted: permissions.accessibility },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="font-orbitron text-lg font-bold text-white mb-1">Grant Permissions</h2>
        <p className="text-xs text-vault-muted">Tap each permission to simulate granting access</p>
      </div>
      <div className="space-y-3">
        {perms.map(({ key, icon: Icon, label, desc, granted }) => (
          <motion.button
            key={key}
            onClick={() => !granted && grant(key)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
              granted
                ? 'border-vault-success/30 bg-vault-success/5'
                : 'border-vault-border bg-vault-glass hover:border-vault-cyan/30 cursor-pointer'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              granted ? 'bg-vault-success/20' : 'bg-vault-cyan/10'
            }`}>
              {granted ? <Check className="w-5 h-5 text-vault-success" /> : <Icon className="w-5 h-5 text-vault-cyan" />}
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-vault-muted">{desc}</p>
            </div>
            {granted && <span className="text-xs font-semibold text-vault-success">GRANTED</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepTestCall({ running, done, onStart }: { running: boolean; done: boolean; onStart: () => void }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    setElapsed(0);
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [running]);

  return (
    <div className="text-center space-y-6">
      <h2 className="font-orbitron text-lg font-bold text-white">Test Recording</h2>
      <p className="text-xs text-vault-muted">Simulate a test call to verify the recording engine</p>

      <div className="relative w-32 h-32 mx-auto">
        <motion.div
          className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
            done ? 'border-vault-success bg-vault-success/10' :
            running ? 'border-vault-cyan bg-vault-cyan/10' :
            'border-vault-border bg-vault-glass'
          }`}
          animate={running ? {
            boxShadow: ['0 0 20px rgba(0,245,255,0.2)', '0 0 50px rgba(0,245,255,0.5)', '0 0 20px rgba(0,245,255,0.2)']
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {done ? (
            <Check className="w-12 h-12 text-vault-success" />
          ) : running ? (
            <div className="text-center">
              <Phone className="w-8 h-8 text-vault-cyan mx-auto mb-1 recording-dot" />
              <span className="font-orbitron text-lg text-vault-cyan">{elapsed}s</span>
            </div>
          ) : (
            <Phone className="w-12 h-12 text-vault-muted" />
          )}
        </motion.div>
      </div>

      {done ? (
        <div className="p-4 rounded-xl bg-vault-success/10 border border-vault-success/20">
          <p className="text-sm text-vault-success font-semibold">✓ Test recording successful!</p>
          <p className="text-xs text-vault-muted mt-1">Dual-path recording engine operational</p>
        </div>
      ) : (
        <button
          onClick={onStart}
          disabled={running}
          className="neon-button text-sm font-orbitron"
        >
          {running ? 'Recording...' : 'Start Test Call'}
        </button>
      )}
    </div>
  );
}

function StepRules({
  autoRecord, setAutoRecord, recordBoth, setRecordBoth,
}: {
  autoRecord: boolean; setAutoRecord: (v: boolean) => void;
  recordBoth: boolean; setRecordBoth: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="font-orbitron text-lg font-bold text-white mb-1">Recording Rules</h2>
        <p className="text-xs text-vault-muted">Configure automatic recording behavior</p>
      </div>

      <div className="space-y-3">
        <ToggleOption
          icon={<Settings className="w-5 h-5" />}
          label="Auto-Record All Calls"
          desc="Automatically start recording when a call begins"
          checked={autoRecord}
          onChange={setAutoRecord}
        />
        <ToggleOption
          icon={<Radio className="w-5 h-5" />}
          label="Dual-Path Recording"
          desc="Capture both system audio and microphone"
          checked={recordBoth}
          onChange={setRecordBoth}
        />
      </div>

      <div className="p-4 rounded-xl bg-vault-purple/10 border border-vault-purple/20">
        <p className="text-xs text-vault-text/70">
          <strong className="text-vault-purple">Pro Tip:</strong> Dual-path recording ensures maximum audio quality by capturing from both the system audio bus and device microphone simultaneously.
        </p>
      </div>
    </div>
  );
}

function ToggleOption({
  icon, label, desc, checked, onChange,
}: {
  icon: React.ReactNode; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-vault-border bg-vault-glass">
      <div className="w-10 h-10 rounded-lg bg-vault-cyan/10 flex items-center justify-center text-vault-cyan">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-vault-muted">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? 'bg-vault-cyan' : 'bg-vault-muted/30'
        }`}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white absolute top-0.5"
          animate={{ left: checked ? 26 : 2 }}
          transition={{ type: 'spring', damping: 20 }}
        />
      </button>
    </div>
  );
}

function StepFinish() {
  return (
    <div className="text-center space-y-6">
      <motion.div
        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-vault-cyan to-vault-purple flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
      >
        <Check className="w-10 h-10 text-[#000111]" />
      </motion.div>
      <div>
        <h2 className="font-orbitron text-xl font-bold text-white mb-2">Setup Complete!</h2>
        <p className="text-sm text-vault-text/70">Your UltraCall Vault is ready. All systems are operational.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Engine', status: 'Online', color: 'text-vault-success' },
          { label: 'Storage', status: 'Encrypted', color: 'text-vault-cyan' },
          { label: 'Transcription', status: 'Active', color: 'text-vault-success' },
          { label: 'Dual-Path', status: 'Enabled', color: 'text-vault-purple' },
        ].map(({ label, status, color }) => (
          <div key={label} className="p-3 rounded-xl bg-vault-glass border border-vault-border">
            <p className="text-xs text-vault-muted mb-0.5">{label}</p>
            <p className={`text-sm font-semibold ${color}`}>{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

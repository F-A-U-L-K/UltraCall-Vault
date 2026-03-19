import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Scale } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

export function LegalModal() {
  const [agreed, setAgreed] = useState(false);
  const setHasCompletedLegal = useAppStore(s => s.setHasCompletedLegal);

  const handleAgree = () => {
    if (agreed) {
      setHasCompletedLegal(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-card w-full max-w-lg flex flex-col overflow-hidden"
          style={{ maxHeight: '90vh' }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-vault-border flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vault-cyan/20 to-vault-purple/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-vault-cyan" />
              </div>
              <div>
                <h2 className="font-orbitron text-lg font-bold text-white">Legal Disclaimer</h2>
                <p className="text-xs text-vault-muted">UltraCall Vault 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-vault-warning/10 border border-vault-warning/20">
              <AlertTriangle className="w-4 h-4 text-vault-warning flex-shrink-0" />
              <p className="text-xs text-vault-warning">Please read and accept the agreement to proceed.</p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed text-vault-text/80 space-y-4 min-h-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-vault-purple" />
              <h3 className="font-orbitron text-sm font-semibold text-vault-purple">Terms of Service & Privacy Policy</h3>
            </div>

            <p><strong className="text-white">1. CALL RECORDING LAWS.</strong> Call recording laws vary by jurisdiction. In many regions, recording phone calls without the consent of all parties is illegal. It is YOUR sole responsibility to understand and comply with all applicable federal, state, local, and international laws regarding the recording of telephone conversations.</p>

            <p><strong className="text-white">2. TWO-PARTY CONSENT.</strong> Many jurisdictions require "two-party" or "all-party" consent. This means ALL participants in a phone call must give their explicit consent before recording can begin. UltraCall Vault does not automatically obtain consent from other parties. You must inform all parties that the call is being recorded.</p>

            <p><strong className="text-white">3. ONE-PARTY CONSENT.</strong> Some jurisdictions allow "one-party" consent, where only one participant (you) needs to know about the recording. Even in these jurisdictions, specific regulations may apply to the use, storage, and sharing of recorded conversations.</p>

            <p><strong className="text-white">4. PROHIBITED USES.</strong> You agree NOT to use this application for: (a) illegal wiretapping or surveillance; (b) recording conversations without required consent; (c) blackmail, harassment, or intimidation; (d) any activity that violates local, state, federal, or international law.</p>

            <p><strong className="text-white">5. DATA STORAGE & PRIVACY.</strong> All recordings are stored locally on your device using encrypted storage. UltraCall Vault does not transmit recordings to external servers. You are responsible for the security of your device and any recordings stored on it. We recommend using device encryption and strong authentication.</p>

            <p><strong className="text-white">6. DATA RETENTION.</strong> You are responsible for managing the retention period of your recordings. Some jurisdictions have specific requirements about how long recorded conversations may be stored. We recommend establishing a regular review and deletion schedule.</p>

            <p><strong className="text-white">7. TRANSCRIPTION ACCURACY.</strong> AI-powered transcription features are provided as a convenience and may contain errors. Transcripts should not be considered verbatim records. Always refer to the original audio recording for accuracy. Do not rely solely on transcripts for legal or business decisions.</p>

            <p><strong className="text-white">8. LIABILITY LIMITATION.</strong> UltraCall Vault, its developers, and affiliates are NOT liable for any legal consequences arising from your use of this application. This includes, but is not limited to, violations of wiretapping laws, privacy violations, or any civil or criminal penalties you may incur.</p>

            <p><strong className="text-white">9. INDEMNIFICATION.</strong> You agree to indemnify and hold harmless UltraCall Vault and its developers from any claims, damages, losses, or legal fees arising from your use of this application or your violation of these terms.</p>

            <p><strong className="text-white">10. SIMULATION NOTICE.</strong> This application operates as a technology demonstration and simulator. All "recordings" are simulated and no actual phone calls are recorded, intercepted, or monitored. The application does not access your device's actual telephony system.</p>

            <p><strong className="text-white">11. UPDATES TO TERMS.</strong> These terms may be updated at any time. Continued use of the application constitutes acceptance of updated terms. We recommend reviewing these terms periodically.</p>

            <p><strong className="text-white">12. GOVERNING LAW.</strong> These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.</p>

            <p className="text-vault-cyan font-semibold pt-2 border-t border-vault-border">By clicking "I Agree" below, you acknowledge that you have read, understood, and agree to be bound by all terms stated above. You confirm that you will comply with all applicable laws regarding call recording in your jurisdiction.</p>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-vault-border space-y-4 flex-shrink-0">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded accent-vault-cyan flex-shrink-0"
              />
              <span className="text-sm text-vault-text">
                I have read and agree to the Terms of Service and Privacy Policy. I understand my legal obligations regarding call recording.
              </span>
            </label>

            <button
              onClick={handleAgree}
              disabled={!agreed}
              className="neon-button w-full text-sm font-orbitron"
            >
              I Agree — Enter UltraCall Vault
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

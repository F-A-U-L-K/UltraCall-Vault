import { v4 as uuidv4 } from 'uuid';
import type { Recording } from '../types';

const contacts = [
  { name: 'Sarah Chen', phone: '+1 (555) 234-8901' },
  { name: 'Marcus Johnson', phone: '+1 (555) 876-5432' },
  { name: 'Dr. Emily Park', phone: '+1 (555) 111-2233' },
  { name: 'Alex Rivera', phone: '+1 (555) 999-0011' },
  { name: 'Jordan Blake', phone: '+1 (555) 444-7788' },
  { name: 'Priya Sharma', phone: '+1 (555) 321-6547' },
  { name: 'David Kim', phone: '+1 (555) 654-3210' },
  { name: undefined, phone: '+1 (555) 777-8899' },
  { name: 'Lisa Thompson', phone: '+1 (555) 123-4567' },
  { name: 'Carlos Mendez', phone: '+1 (555) 890-1234' },
  { name: 'Nina Volkov', phone: '+1 (555) 567-8901' },
  { name: undefined, phone: '+44 20 7946 0958' },
  { name: 'Robert Hayes', phone: '+1 (555) 345-6789' },
  { name: 'Mei Ling Wu', phone: '+1 (555) 012-3456' },
  { name: 'Tyler Grant', phone: '+1 (555) 678-9012' },
];

const transcripts = [
  `Hey Sarah, I wanted to follow up on the quarterly report. The numbers look great this quarter — revenue is up 23% compared to last year. I think we should schedule a meeting with the board to present these findings. Can you set that up for next Tuesday? Also, please make sure the marketing team has their updated slides ready.`,
  `Marcus, this is regarding the property on Oak Street. The inspection came back and there are a few issues we need to discuss. The foundation has some minor cracks and the roof needs attention. Nothing deal-breaking, but we should negotiate the price down. What do you think about countering at fifteen thousand below asking?`,
  `Hi Dr. Park, I'm calling about my lab results. I've been feeling much better since starting the new medication, but I noticed some side effects — mainly dizziness in the morning. Should I adjust the dosage or is this normal? Also, I need to schedule my six-month follow-up appointment.`,
  `Alex! Great news about the project deadline extension. The client agreed to push it two weeks. That gives us time to polish the UI and run proper QA testing. Let's reassign the sprint tasks tomorrow morning. Also, the new developer starts Monday — can you handle the onboarding?`,
  `Jordan, I got your voicemail about the concert tickets. I managed to grab four tickets for the Saturday show. Section B, row 12. Meet at the venue at 6 PM so we can grab dinner at that Italian place nearby. Let me know if anyone else wants to join — I might be able to get two more.`,
  `Hi Priya, just confirming our flight details for the conference. We depart Thursday at 8 AM from Terminal 3. The hotel reservation is under my name. I've prepared the presentation deck — can you review slides 15 through 22? Those cover the technical architecture and I want your input on the database schema section.`,
  `David, the server migration is almost complete. We've moved 85% of the data to the new cloud infrastructure. There's a brief maintenance window tonight from midnight to 3 AM. All services should be back online by morning. I need you to monitor the database replication and alert me if any sync errors come up.`,
  `Hello, I'm calling about the car service appointment. My 2024 sedan needs its 30,000 mile maintenance. I'd like to schedule it for next Friday morning if possible. Also, the check engine light came on last week — could you run a diagnostic? The extended warranty should cover most of the work.`,
  `Lisa, I have the final draft of the contract ready for review. The legal team made a few amendments to sections 4 and 7 regarding liability and termination clauses. Everything else looks standard. Can you sign the DocuSign by end of day tomorrow? The client is eager to get started.`,
  `Hey Carlos, the restaurant renovation is on schedule. The kitchen equipment arrives next Monday and the new flooring goes in Wednesday. We should be ready for the soft opening by the 15th. I need you to finalize the menu and get the wine list to the printer. Don't forget we have the health inspection on the 12th.`,
  `Nina, I reviewed the research paper you sent. The methodology is solid but I have concerns about the sample size in section 3. We might need to expand the study group by at least 40 participants to achieve statistical significance. Can we schedule a video call this week to discuss the revisions?`,
  `Hi, I'm returning your call about the insurance claim. Your case number is VLT-2026-4471. The adjuster visited the property yesterday and the damage assessment is complete. We're looking at approximately twelve thousand in covered repairs. I'll email you the detailed breakdown and next steps within 48 hours.`,
  `Robert, I wrapped up the financial audit for Q3. Everything checks out — no discrepancies in the accounts receivable. However, I noticed we're overspending on vendor contracts by about 8%. I recommend renegotiating the top three contracts when they come up for renewal in January. I'll prepare a cost analysis report.`,
  `Mei Ling, the art exhibition opening went phenomenally. We had over 200 attendees and sold 12 pieces on opening night. The gallery wants to extend the show for another three weeks. Also, a collector from Hong Kong expressed interest in commissioning a series. Shall I set up an introduction call?`,
  `Tyler, practice is moved to the indoor facility tomorrow because of the weather forecast. Coach wants everyone there by 5:30 AM for warm-ups. Bring your playbook — we're reviewing the new defensive formations. Also, the team dinner is moved to Saturday at 7 PM at the steakhouse. Let everyone on the group chat know.`,
];

const summaries = [
  'Quarterly report follow-up: Revenue up 23%. Board meeting to be scheduled for next Tuesday.',
  'Property negotiation on Oak Street. Inspection found minor issues. Counter-offer discussion at $15K below asking.',
  'Medical follow-up: Patient reporting dizziness side effect. Dosage adjustment discussion needed. Six-month appointment scheduling.',
  'Project deadline extended 2 weeks. Sprint reassignment planned. New developer onboarding Monday.',
  'Concert ticket confirmation: 4 tickets, Section B Row 12, Saturday show. Dinner plans at 6 PM.',
  'Conference travel confirmation: Thursday 8 AM departure. Presentation deck review requested for slides 15-22.',
  'Server migration 85% complete. Maintenance window midnight-3 AM. Database replication monitoring required.',
  'Car service scheduling for 30K mile maintenance. Check engine light diagnostic needed. Warranty coverage check.',
  'Contract finalization: Amendments to sections 4 and 7. DocuSign needed by end of day tomorrow.',
  'Restaurant renovation on schedule. Soft opening target: the 15th. Health inspection on the 12th.',
  'Research paper review: Sample size concerns in section 3. Need 40+ additional participants.',
  'Insurance claim update: Case VLT-2026-4471. $12K in covered repairs. Detailed breakdown coming via email.',
  'Q3 audit complete, no discrepancies. Vendor contract overspending at 8%. Renegotiation recommended for January.',
  'Art exhibition success: 200+ attendees, 12 pieces sold. Show extended 3 weeks. HK collector commission interest.',
  'Practice moved indoors due to weather. 5:30 AM warm-up. New defensive formations review. Team dinner Saturday 7 PM.',
];

const tagSets = [
  ['work', 'important', 'finance'],
  ['real-estate', 'negotiation'],
  ['medical', 'personal'],
  ['work', 'project', 'deadline'],
  ['personal', 'entertainment'],
  ['work', 'travel', 'conference'],
  ['work', 'technical', 'urgent'],
  ['personal', 'car', 'maintenance'],
  ['work', 'legal', 'contract'],
  ['business', 'restaurant', 'renovation'],
  ['work', 'research', 'academic'],
  ['insurance', 'claim', 'property'],
  ['work', 'finance', 'audit'],
  ['art', 'gallery', 'business'],
  ['personal', 'sports', 'team'],
];

const directions: Array<'incoming' | 'outgoing'> = ['incoming', 'outgoing'];
const sourceMethods: Array<'system' | 'microphone' | 'both'> = ['system', 'microphone', 'both'];

export function generateSeedRecordings(): Recording[] {
  const recordings: Recording[] = [];
  const now = Date.now();

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const startTime = new Date(now - daysAgo * 86400000 - hoursAgo * 3600000);
    const duration = 30 + Math.floor(Math.random() * 570); // 30s to 600s
    const endTime = new Date(startTime.getTime() + duration * 1000);
    const contact = contacts[i];

    recordings.push({
      id: uuidv4(),
      callId: `CALL-${Date.now()}-${i.toString().padStart(3, '0')}`,
      phoneNumber: contact.phone,
      contactName: contact.name,
      direction: directions[Math.floor(Math.random() * 2)],
      startTime,
      endTime,
      durationSeconds: duration,
      audioFilePath: `/recordings/call_${i}.opus`,
      micFallbackPath: Math.random() > 0.5 ? `/recordings/mic_${i}.opus` : undefined,
      transcript: transcripts[i],
      tags: tagSets[i],
      isFavorite: Math.random() > 0.7,
      sourceMethod: sourceMethods[Math.floor(Math.random() * 3)],
      summary: summaries[i],
    });
  }

  return recordings.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
}

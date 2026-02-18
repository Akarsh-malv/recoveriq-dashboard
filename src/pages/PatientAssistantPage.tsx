import { Sparkles } from 'lucide-react';
import { PatientProfile } from '../types/patient';
import { PatientChatbot } from '../components/patient/PatientChatbot';

interface PatientAssistantPageProps {
  profile: PatientProfile;
}

export function PatientAssistantPage({ profile }: PatientAssistantPageProps) {
  const suggestedQuestions = [
    'Why is my resting heart rate higher this week?',
    'Can reduced sleep explain my daytime fatigue?',
    'What should I track before contacting my care team?',
    'Could lower activity be related to how tired I feel today?',
    'How can I describe dizziness patterns clearly for my care team?',
  ];

  return (
    <main className="h-full overflow-auto bg-neutral-light">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center p-6">
        <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Sparkles className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-neutral-darkest">Good to See You, {profile.name}</h1>
            <p className="mt-2 text-sm text-neutral-mid">
              Ask about symptom patterns, baseline changes, and what those trends may mean in plain language.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-3xl">
            <PatientChatbot profile={profile} suggestions={suggestedQuestions} />
            <p className="mt-3 text-center text-xs text-neutral-mid">
              This assistant explains trends and offers general recommendations only. It does not diagnose medical conditions.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

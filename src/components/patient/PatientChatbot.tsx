import { FormEvent, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { PatientProfile } from '../../types/patient';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

interface PatientChatbotProps {
  profile: PatientProfile;
  suggestions?: string[];
}

const DIAGNOSIS_PATTERN = /\b(diagnos|disease|condition do i have|what do i have|is this (?:a|an)|heart attack|stroke|cancer)\b/i;
const SERIOUS_SYMPTOMS_PATTERN = /\b(chest pain|severe shortness of breath|fainting|confusion|emergency|passed out|cannot breathe)\b/i;
const HEART_RATE_PATTERN = /\b(heart rate|resting hr|pulse|hr)\b/i;
const SLEEP_PATTERN = /\b(sleep|insomnia|restless|awake|woke up)\b/i;
const ACTIVITY_PATTERN = /\b(activity|steps|walking|walk|exercise|active)\b/i;
const TREND_PATTERN = /\b(trend|alert|flag|should i be worried|what does this mean|why did this)\b/i;
const GREETING_PATTERN = /\b(hi|hello|hey)\b/i;

const EMERGENCY_DISCLAIMER =
  'If you experience serious symptoms such as chest pain, severe shortness of breath, fainting, or confusion, call emergency services immediately.';

const HEART_RATE_TEMPLATES = [
  'Your resting heart rate is currently higher than your usual pattern. This can be due to factors like stress, poor sleep, or physical activity. It does not diagnose a condition. If your symptoms worsen, contact your care team.',
  'We see an increase in resting heart rate compared to your typical baseline. Many benign factors can contribute, and it is not a medical diagnosis. It has been noted for clinician review.',
  'A modest rise in resting HR may occur with tiredness or stress. If you feel unusual symptoms, please check in with your clinician.',
];

const ACTIVITY_TEMPLATES = [
  'Your activity levels are lower than your baseline over the past few days. This can happen due to fatigue, weather, or schedule changes. It is not a medical assessment. If this continues or you feel unwell, consider reaching out to your care team.',
  'Compared to your usual pattern, your activity has dipped. This does not imply a specific diagnosis. Your recovery team has been notified to review it.',
  'Lower activity can be normal post-discharge. If you are concerned or experiencing symptoms, talk with your clinician.',
];

const SLEEP_TEMPLATES = [
  'Your sleep duration or quality is below your recent baseline. Sleep changes can be caused by many things. If this persists or you are feeling worse, contact your care provider.',
  'We noticed more fragmented or shorter sleep than usual. This is informational only and not a diagnosis. Please check in with your care team if needed.',
  'Sleep disruptions are common, but if you have additional symptoms or feel unusual, please consult your clinician.',
];

const TREND_TEMPLATES = [
  'Your recent recovery pattern differs from your baseline, which we have flagged for review. This is for informational purposes and not medical advice. Contact your clinician if you have questions.',
  'We see changes in your recovery metrics. These are reflective signals, not diagnoses. Your care team can help interpret them.',
  'Recovery variations happen. This does not imply a specific condition. If you feel unwell, reach out to your care team.',
];

function chooseTemplate(question: string, templates: string[]): string {
  const hash = question.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

function buildContextLead(profile: PatientProfile, topic: 'hr' | 'activity' | 'sleep' | 'trend'): string {
  if (topic === 'hr') {
    return `Current trend: resting HR is ${Math.round(profile.metrics.restingHR)} bpm (${Math.round(profile.metrics.restingHRDelta)}% vs baseline).`;
  }
  if (topic === 'activity') {
    return `Current trend: activity is ${Math.round(profile.metrics.steps).toLocaleString()} steps (${Math.round(profile.metrics.stepsDelta)}% vs baseline).`;
  }
  if (topic === 'sleep') {
    return `Current trend: sleep is ${Math.round(profile.metrics.sleepHours)} hours (${Math.round(profile.metrics.sleepDelta)}% vs baseline).`;
  }
  return `Current trend snapshot: HR ${Math.round(profile.metrics.restingHRDelta)}%, Steps ${Math.round(profile.metrics.stepsDelta)}%, Sleep ${Math.round(profile.metrics.sleepDelta)}% versus baseline.`;
}

function getResponseForQuestion(question: string, profile: PatientProfile): string {
  if (GREETING_PATTERN.test(question)) {
    return 'Hi there. I can explain your recovery trends, answer general questions, and offer non-diagnostic recommendations.';
  }

  if (DIAGNOSIS_PATTERN.test(question)) {
    return [
      'I cannot provide a diagnosis.',
      buildContextLead(profile, 'trend'),
      'I can help explain what changed and suggest questions to ask your care team.',
      'Your care team has been notified of this trend and will review it. If you prefer, you can also contact them to discuss.',
    ].join(' ');
  }

  if (HEART_RATE_PATTERN.test(question)) {
    return [buildContextLead(profile, 'hr'), chooseTemplate(question, HEART_RATE_TEMPLATES)].join(' ');
  }

  if (ACTIVITY_PATTERN.test(question)) {
    return [buildContextLead(profile, 'activity'), chooseTemplate(question, ACTIVITY_TEMPLATES)].join(' ');
  }

  if (SLEEP_PATTERN.test(question)) {
    return [buildContextLead(profile, 'sleep'), chooseTemplate(question, SLEEP_TEMPLATES)].join(' ');
  }

  if (TREND_PATTERN.test(question)) {
    return [buildContextLead(profile, 'trend'), chooseTemplate(question, TREND_TEMPLATES)].join(' ');
  }

  return [
    'I can answer general recovery questions and explain your trend changes in plain language.',
    buildContextLead(profile, 'trend'),
    'This information is non-diagnostic. If you feel unwell, contact your care team.',
  ].join(' ');
}

export function PatientChatbot({ profile, suggestions = [] }: PatientChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) {
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: prompt,
    };

    setMessages((previous) => [...previous, nextUserMessage]);
    setInput('');
    setLoading(true);
    const responseText = getResponseForQuestion(prompt, profile);
    const withEmergency = SERIOUS_SYMPTOMS_PATTERN.test(prompt)
      ? `${responseText} ${EMERGENCY_DISCLAIMER}`
      : responseText;

    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: withEmergency,
        },
      ]);
      setLoading(false);
    }, 250);
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-gray-200 bg-neutral-light p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-neutral-mid">Ask a question to get started.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`text-sm ${message.role === 'user' ? 'text-neutral-darkest' : 'text-neutral-mid'}`}
            >
              <span className="font-semibold">{message.role === 'user' ? 'You' : 'Assistant'}: </span>
              <span>{message.text}</span>
            </div>
          ))
        )}
      </div>

      <form className="mt-3 flex gap-2" onSubmit={sendMessage}>
        <input
          aria-label="Ask recovery assistant"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about your trend changes..."
          className="h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Send question"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? '...' : <ArrowUp className="h-4 w-4" />}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="mt-3 overflow-hidden pb-1">
          <div className="suggestion-marquee-track">
            <div className="suggestion-marquee-group">
              {suggestions.map((suggestion) => (
                <button
                  key={`primary-${suggestion}`}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs text-primary hover:bg-primary/20"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="suggestion-marquee-group" aria-hidden="true">
              {suggestions.map((suggestion) => (
                <span
                  key={`duplicate-${suggestion}`}
                  className="shrink-0 whitespace-nowrap rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs text-primary"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

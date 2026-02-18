import { useState } from 'react';
import { Activity, Check } from 'lucide-react';
import { Button } from '../../components/Button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [consented, setConsented] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Activity className="w-9 h-9 text-white" />
          </div>
        </div>

        <h1 className="mb-3 text-center text-2xl font-semibold text-neutral-darkest">
          Welcome to RecoverIQ
        </h1>

        <p className="mb-8 text-center text-base text-neutral-mid">
          RecoverIQ helps your care team monitor your recovery progress through simple health data.
        </p>

        <div className="mb-8 rounded-xl border border-primary/20 bg-primary-light p-5">
          <h2 className="mb-3 text-sm font-semibold text-neutral-darkest">
            How it works
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-neutral-darkest">
                Connect your wearable device or upload health data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-neutral-darkest">
                Your care team reviews your progress regularly
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-neutral-darkest">
                Get support when you need it most
              </span>
            </li>
          </ul>
        </div>

        <label className="mb-8 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-neutral-darkest">
            I understand and consent to sharing my health data with my care team to support my recovery.
          </span>
        </label>

        <Button
          onClick={onComplete}
          disabled={!consented}
          className="w-full"
        >
          Get Started
        </Button>

        <p className="mt-6 text-center text-xs text-neutral-mid">
          Your data is private and only shared with your authorized care team
        </p>
      </div>
    </div>
  );
}

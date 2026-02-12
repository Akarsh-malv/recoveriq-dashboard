import { useState } from 'react';
import { Activity, Check } from 'lucide-react';
import { Button } from '../../components/Button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [consented, setConsented] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Activity className="w-9 h-9 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-3">
          Welcome to RecoverIQ
        </h1>

        <p className="text-base text-gray-600 text-center mb-8">
          RecoverIQ helps your care team monitor your recovery progress through simple health data.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            How it works
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700">
                Connect your wearable device or upload health data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700">
                Your care team reviews your progress regularly
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700">
                Get support when you need it most
              </span>
            </li>
          </ul>
        </div>

        <label className="flex items-start gap-3 mb-8 cursor-pointer">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
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

        <p className="text-xs text-gray-500 text-center mt-6">
          Your data is private and only shared with your authorized care team
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Activity, HeartPulse, Moon, Search } from 'lucide-react';
import { PatientAppointment, PatientProfile } from '../types/patient';
import { seedPatients, getPatientDetail } from '../mocks/seedPatients';
import { PatientSummaryCards } from '../components/patient/PatientSummaryCards';
import { MetricRow } from '../components/patient/MetricRow';
import { TrendChart } from '../components/patient/TrendChart';
import { Button } from '../components/common/Button';
import { ScheduledAppointments } from '../components/patient/ScheduledAppointments';

interface PatientDashboardProps {
  profile: PatientProfile;
}

function formatSyncTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getRecoveryStatus(metrics: PatientProfile['metrics']): 'Stable' | 'Watch' | 'Check-in Recommended' {
  const highestDeviation = Math.max(
    Math.abs(metrics.restingHRDelta),
    Math.abs(metrics.stepsDelta),
    Math.abs(metrics.sleepDelta)
  );
  if (highestDeviation >= 25) return 'Check-in Recommended';
  if (highestDeviation >= 12) return 'Watch';
  return 'Stable';
}

function getTrendLabel(metrics: PatientProfile['metrics']): 'Improving' | 'Stable' | 'Worsening' {
  const aggregate = metrics.restingHRDelta - metrics.stepsDelta - metrics.sleepDelta;
  if (aggregate >= 20) return 'Worsening';
  if (aggregate <= -10) return 'Improving';
  return 'Stable';
}

function toShortDayLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString([], { weekday: 'short' });
}

export function buildPatientProfile(seedNameOrId?: string): PatientProfile {
  const matchedById = seedNameOrId ? seedPatients.some((patient) => patient.id === seedNameOrId) : false;
  const selectedSeed =
    seedPatients.find((patient) => patient.id === seedNameOrId || patient.name === seedNameOrId) ??
    seedPatients[0];
  const displayName = seedNameOrId && !matchedById ? seedNameOrId : selectedSeed.name;

  const detail = getPatientDetail(selectedSeed.id);
  const hrTrend = (detail?.detail.trends.heartRate ?? []).slice(-7);
  const activityTrend = (detail?.detail.trends.activity ?? []).slice(-7);
  const sleepTrend = (detail?.detail.trends.sleep ?? []).slice(-7);
  const latestSleep = sleepTrend.length > 0 ? sleepTrend[sleepTrend.length - 1].value : selectedSeed.metrics.sleep.current;
  const baselineSleep = sleepTrend.length > 0 ? sleepTrend[0].value : selectedSeed.metrics.sleep.baseline;

  return {
    id: selectedSeed.id,
    name: displayName,
    metrics: {
      restingHR: Math.round(selectedSeed.metrics.restingHR.current),
      restingHRDelta: Math.round(selectedSeed.metrics.restingHR.percentChange),
      steps: Math.round(selectedSeed.metrics.steps.current),
      stepsDelta: Math.round(selectedSeed.metrics.steps.percentChange),
      sleepHours: Math.round(latestSleep),
      sleepDelta: Math.round(((latestSleep - baselineSleep) / Math.max(1, baselineSleep)) * 100),
      lastSync: selectedSeed.lastSync,
      trend7d: hrTrend.map((point) => ({ date: toShortDayLabel(point.date), value: Math.round(point.value) })),
      activity7d: activityTrend.map((point) => ({ date: toShortDayLabel(point.date), value: Math.round(point.value) })),
    },
  };
}

function downloadSummary(profile: PatientProfile) {
  const payload = {
    patientId: profile.id,
    name: profile.name,
    generatedAt: new Date().toISOString(),
    metrics: profile.metrics,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${profile.id}-recovery-summary.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PatientDashboard({ profile }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'appointments'>('summary');
  const status = getRecoveryStatus(profile.metrics);
  const trend = getTrendLabel(profile.metrics);
  const demoAppointments: PatientAppointment[] = [
    {
      id: 'appt-1',
      type: 'Routine Checkup',
      title: 'Damian Lewis - Standard Consult',
      provider: 'Dr. Angela Taylor',
      startAt: new Date(Date.now() + 25 * 60_000).toISOString(),
      durationMinutes: 40,
      status: 'upcoming',
      location: 'Cardiology Suite A',
    },
    {
      id: 'appt-2',
      type: 'Follow-Up',
      title: 'Recovery Follow-Up',
      provider: 'Nurse Care Team',
      startAt: new Date(Date.now() + 3 * 60 * 60_000).toISOString(),
      durationMinutes: 30,
      status: 'confirmed',
      location: 'Telehealth',
    },
    {
      id: 'appt-3',
      type: 'Rehab',
      title: 'Mobility Progress Session',
      provider: 'PT Services',
      startAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
      durationMinutes: 45,
      status: 'confirmed',
      location: 'Rehab Center',
    },
  ];

  return (
    <main className="h-full overflow-auto bg-neutral-light">
      <div className="mx-auto max-w-7xl space-y-4 p-4">
        <header className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Patient Details</h1>
              <p className="mt-1 text-sm text-gray-600">Track your recovery and understand changes over time, {profile.name}.</p>
            </div>
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                aria-label="Search patient page content"
                placeholder="Search patient..."
                className="h-10 w-60 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                activeTab === 'summary' ? 'bg-primary text-white' : 'border border-gray-200 text-neutral-darkest bg-white'
              }`}
            >
              Recovery View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appointments')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                activeTab === 'appointments' ? 'bg-primary text-white' : 'border border-gray-200 text-neutral-darkest bg-white'
              }`}
            >
              Scheduled Appointments
            </button>
          </div>
        </header>

        {activeTab === 'appointments' ? (
          <ScheduledAppointments appointments={demoAppointments} className="min-h-[640px]" />
        ) : (
          <>
            <PatientSummaryCards
              status={status}
              trendLabel={trend}
              lastSyncLabel={formatSyncTime(profile.metrics.lastSync)}
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_0.9fr]">
              <div className="space-y-4">
                <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center">
                    <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                    <MetricRow
                      label="Resting Heart Rate"
                      value={`${Math.round(profile.metrics.restingHR)} bpm`}
                      deltaPercent={profile.metrics.restingHRDelta}
                      icon={HeartPulse}
                    />
                    <MetricRow
                      label="Activity Level"
                      value={`${Math.round(profile.metrics.steps).toLocaleString()} steps`}
                      deltaPercent={profile.metrics.stepsDelta}
                      icon={Activity}
                    />
                    <MetricRow
                      label="Sleep Duration"
                      value={`${Math.round(profile.metrics.sleepHours)} hrs`}
                      deltaPercent={profile.metrics.sleepDelta}
                      icon={Moon}
                    />
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <TrendChart title="7-Day Resting HR" data={profile.metrics.trend7d} valueLabel="bpm" />
                  <TrendChart title="7-Day Activity" data={profile.metrics.activity7d} valueLabel="steps" />
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    <a href="mailto:care-team@recoveriq.health" className="inline-flex">
                      <Button aria-label="Contact care team">Contact care team</Button>
                    </a>
                    <Button
                      variant="secondary"
                      aria-label="Download recovery summary"
                      onClick={() => downloadSummary(profile)}
                    >
                      Download summary
                    </Button>
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <ScheduledAppointments appointments={demoAppointments} className="min-h-[640px]" />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

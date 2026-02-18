import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { seedPatients } from '../mocks/seedPatients';
import { AlertCard } from '../components/alerts/AlertCard';
import { AlertTabs } from '../components/alerts/AlertTabs';
import { AlertsSummary } from '../components/alerts/AlertsSummary';
import { GeneratedAlert, generateAlertsFromPatients } from '../utils/alertGenerator';

type AlertTab = 'active' | 'reviewed' | 'all';

interface AlertsPageProps {
  onPatientClick: (patientId: string) => void;
}

const groupedSeverities: GeneratedAlert['severity'][] = ['high'];

const severityTitle: Record<GeneratedAlert['severity'], string> = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low',
};

function getHoursSince(timestamp: string): number {
  const elapsed = Math.max(0, Date.now() - new Date(timestamp).getTime());
  return Math.round(elapsed / (60 * 60 * 1000));
}

function isDeterioratingPatient(patient: (typeof seedPatients)[number]): boolean {
  if (patient.trend === 'worsening') {
    return true;
  }

  const worseningSignals = [
    patient.metrics.restingHR.percentChange >= 12,
    patient.metrics.steps.percentChange <= -15,
    patient.metrics.sleep.percentChange <= -15,
  ].filter(Boolean).length;

  return worseningSignals >= 2;
}

export function AlertsPage({ onPatientClick }: AlertsPageProps) {
  const [tab, setTab] = useState<AlertTab>('active');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, GeneratedAlert['status']>>({});

  const prioritizedAlerts = useMemo(
    () =>
      generateAlertsFromPatients(
        seedPatients.filter((patient) => patient.riskTier === 'high' && isDeterioratingPatient(patient))
      )
        .filter((alert) => alert.severity === 'high')
        .slice(0, 15),
    []
  );

  const alerts = useMemo(
    () =>
      prioritizedAlerts.map((alert) => ({
        ...alert,
        status: statusOverrides[alert.id] ?? 'active',
      })),
    [prioritizedAlerts, statusOverrides]
  );

  const counts = useMemo(
    () => ({
      active: Math.round(alerts.filter((alert) => alert.status === 'active').length),
      reviewed: Math.round(alerts.filter((alert) => alert.status === 'reviewed').length),
      all: Math.round(alerts.length),
    }),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    if (tab === 'all') {
      return alerts;
    }
    return alerts.filter((alert) => alert.status === tab);
  }, [alerts, tab]);

  const groupedAlerts = useMemo(() => {
    return groupedSeverities.map((severity) => ({
      severity,
      alerts: filteredAlerts.filter((alert) => alert.severity === severity),
    }));
  }, [filteredAlerts]);

  const highSeverityCount = Math.round(
    alerts.filter((alert) => alert.status === 'active' && alert.severity === 'high').length
  );

  const avgTimeSinceAlertHours = useMemo(() => {
    const activeAlerts = alerts.filter((alert) => alert.status === 'active');
    if (activeAlerts.length === 0) {
      return 0;
    }
    const totalHours = activeAlerts.reduce((total, alert) => total + getHoursSince(alert.createdAt), 0);
    return Math.round(totalHours / activeAlerts.length);
  }, [alerts]);

  const lastResolvedHours = useMemo(() => {
    const reviewedAlerts = alerts.filter((alert) => alert.status === 'reviewed');
    if (reviewedAlerts.length === 0) {
      return 0;
    }
    const latestReviewed = reviewedAlerts.reduce((latest, current) =>
      new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime() ? current : latest
    );
    return getHoursSince(latestReviewed.createdAt);
  }, [alerts]);

  const updateStatusToReviewed = (alertId: string) => {
    setStatusOverrides((previous) => ({ ...previous, [alertId]: 'reviewed' }));
  };

  const handleReview = (alert: GeneratedAlert) => {
    updateStatusToReviewed(alert.id);
    onPatientClick(alert.patientId);
  };

  const hasNoActiveAlerts = tab === 'active' && filteredAlerts.length === 0;
  const hasNoAlertsInTab = filteredAlerts.length === 0;

  return (
    <div className="h-full overflow-auto bg-neutral-light">
      <div className="mx-auto max-w-6xl space-y-5 p-6">
        <header className="rounded-xl border border-gray-200 bg-white p-5">
          <h1 className="text-2xl font-semibold text-neutral-darkest">Alert Management</h1>
          <p className="mt-1 text-sm text-neutral-mid">Monitor patient deterioration signals and triage interventions.</p>
        </header>

        <AlertsSummary
          activeCount={counts.active}
          highSeverityCount={highSeverityCount}
          avgTimeSinceAlertHours={avgTimeSinceAlertHours}
        />

        <AlertTabs activeTab={tab} counts={counts} onChange={setTab} />

        <section id={`alerts-panel-${tab}`} role="tabpanel" className="space-y-4">
          {hasNoActiveAlerts ? (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-xl font-semibold text-neutral-darkest">All patients stable</h2>
              <p className="mt-2 text-sm text-neutral-mid">Last alert resolved {Math.round(lastResolvedHours)} hours ago</p>
            </div>
          ) : hasNoAlertsInTab ? (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
              <p className="text-lg font-semibold text-neutral-darkest">No alerts in this view</p>
              <p className="mt-2 text-sm text-neutral-mid">Adjust filters or check back after the next sync cycle.</p>
            </div>
          ) : (
            groupedAlerts.map((group) =>
              group.alerts.length > 0 ? (
                <div key={group.severity} className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    {severityTitle[group.severity]}
                  </h2>
                  <div className="space-y-3">
                    {group.alerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onReview={handleReview}
                        onResolve={updateStatusToReviewed}
                      />
                    ))}
                  </div>
                </div>
              ) : null
            )
          )}
        </section>
      </div>
    </div>
  );
}

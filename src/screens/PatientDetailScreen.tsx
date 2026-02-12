import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '../lib/queryShim';
import { Button } from '../components/Button';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { RiskPill } from '../components/ui/RiskPill';
import { fetchPatientDetail } from '../services/api';
import { ActivityChart } from '../components/charts/ActivityChart';
import { HeartRateChart } from '../components/charts/HeartRateChart';
import { PatientDetail as PatientDetailType } from '../types/patient';

interface PatientDetailScreenProps {
  patientId: string;
  onBack: () => void;
}

export function PatientDetailScreen({ patientId, onBack }: PatientDetailScreenProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['patient-detail', patientId],
    queryFn: () => fetchPatientDetail(patientId),
  });

  const detail = data as PatientDetailType | undefined;

  const riskTier = useMemo(() => {
    if (!detail) return 'low' as const;
    const latestHR = detail.recent.restingHR;
    if (latestHR > 85) return 'high';
    if (latestHR > 75) return 'medium';
    return 'low';
  }, [detail]);

  if (isLoading) return <LoadingState message="Loading patient details..." />;
  if (isError || !detail) return <ErrorState message="Patient not found" onRetry={() => refetch()} />;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Patient {patientId}</h1>
            <div className="flex items-center gap-3 mt-2">
              <RiskPill tier={riskTier} />
              <span className="text-xs text-gray-500">
                Last sync: {new Date(detail.trends.activity.at(-1)?.date ?? Date.now()).toLocaleString()}
              </span>
            </div>
          </div>
          <Button variant="secondary">Create Outreach Task</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Resting HR</p>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-900">{detail.recent.restingHR} bpm</div>
                <p className="text-xs text-gray-500">Baseline {detail.baseline.restingHR} bpm</p>
              </div>
              <RiskPill tier={riskTier} size="sm" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Activity</p>
            <div className="text-3xl font-semibold text-gray-900">{detail.recent.activityLevel} steps</div>
            <p className="text-xs text-gray-500">Baseline {detail.baseline.activityLevel} steps</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Heart Rate Trend</h3>
            <span className="text-xs text-gray-500">Baseline {detail.baseline.restingHR} bpm</span>
          </div>
          <HeartRateChart data={detail.trends.heartRate} baseline={detail.baseline.restingHR} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Activity Trend</h3>
            <span className="text-xs text-gray-500">Baseline {detail.baseline.activityLevel} steps</span>
          </div>
          <ActivityChart data={detail.trends.activity} baseline={detail.baseline.activityLevel} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Alerts</h3>
          <div className="space-y-3">
            {detail.alerts.length === 0 ? (
              <p className="text-sm text-gray-600">No alerts</p>
            ) : (
              detail.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 border border-gray-200 rounded-lg p-3">
                  <RiskPill tier={alert.severity} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

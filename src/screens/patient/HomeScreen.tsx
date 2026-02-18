import { useState, useEffect } from 'react';
import { Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Metric } from '../../types';
import { MetricCard } from '../../components/MetricCard';
import { LoadingState } from '../../components/LoadingState';

export function HomeScreen() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    loadPatientData();
  }, [user]);

  const loadPatientData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: patientData } = await supabase
        .from('patients')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (patientData) {
        setPatientName(patientData.full_name);
      }

      const { data: patientRecord } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (patientRecord) {
        const { data: metricsData } = await supabase
          .from('metrics')
          .select('*')
          .eq('patient_id', patientRecord.id)
          .order('recorded_at', { ascending: false })
          .limit(10);

        setMetrics(metricsData || []);
      }
    } catch (err) {
      console.error('Failed to load patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your data..." />;
  }

  const latestMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metric_name]) {
      acc[metric.metric_name] = metric;
    }
    return acc;
  }, {} as Record<string, Metric>);

  const getRecoveryStatus = () => {
    const metricsArray = Object.values(latestMetrics);
    if (metricsArray.length === 0) return { color: 'gray', message: 'No data yet', description: 'Connect your device to get started' };

    const avgPercentChange = metricsArray.reduce((sum, m) => {
      const change = m.baseline_value !== 0 ? ((m.current_value - m.baseline_value) / m.baseline_value) * 100 : 0;
      return sum + Math.abs(change);
    }, 0) / metricsArray.length;

    if (avgPercentChange < 10) {
      return { color: 'green', message: 'Recovery on track', description: 'Your metrics are stable and within expected ranges' };
    } else if (avgPercentChange < 25) {
      return { color: 'amber', message: 'Some changes detected', description: 'Minor variations in your metrics. Your care team is monitoring' };
    } else {
      return { color: 'amber', message: 'Your care team is reviewing', description: 'Notable changes in your metrics. Your team will reach out if needed' };
    }
  };

  const status = getRecoveryStatus();

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-mid">Welcome back</p>
            <h1 className="text-3xl font-semibold text-neutral-darkest">Hi {patientName.split(' ')[0] || 'there'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
              {(patientName || 'You').charAt(0).toUpperCase()}
            </div>
            <div className="text-sm text-neutral-mid">
              Securely synced
              <div className="flex items-center gap-1 text-xs font-semibold text-success">
                <ShieldCheck className="w-4 h-4" /> Protected data
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recovery Status</p>
                <h2 className="text-lg font-semibold text-neutral-darkest">{status.message}</h2>
                <p className="text-sm text-neutral-mid">{status.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-mid">Need help?</p>
            <p className="mb-3 text-sm text-neutral-darkest">If you have questions, your care team is here to help.</p>
            <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
              Contact care team
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-mid">Vitals</p>
              <h3 className="text-lg font-semibold text-neutral-darkest">Your Metrics</h3>
            </div>
          </div>

          {Object.keys(latestMetrics).length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <Activity className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-darkest">No data connected yet</p>
              <p className="text-xs text-neutral-mid">Connect your wearable to start tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {Object.values(latestMetrics).map((metric) => (
                <div
                  key={metric.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
                >
                  <MetricCard
                    label={metric.metric_name.replace('_', ' ').toUpperCase()}
                    baseline={metric.baseline_value}
                    current={metric.current_value}
                    unit={metric.unit}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

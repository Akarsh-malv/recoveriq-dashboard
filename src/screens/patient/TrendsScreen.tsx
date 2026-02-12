import { useState, useEffect } from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Metric } from '../../types';
import { LoadingState } from '../../components/LoadingState';

export function TrendsScreen() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [user]);

  const loadMetrics = async () => {
    if (!user) return;

    try {
      setLoading(true);

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
          .order('recorded_at', { ascending: false });

        setMetrics(metricsData || []);
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading trends..." />;
  }

  const metricsByName = metrics.reduce((acc, metric) => {
    if (!acc[metric.metric_name]) {
      acc[metric.metric_name] = [];
    }
    acc[metric.metric_name].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">Insights</p>
            <h1 className="text-3xl font-semibold text-gray-900">Your Trends</h1>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
            Updated daily
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(metricsByName).length === 0 ? (
            <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <Activity className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-800 mb-1">No trend data available</p>
              <p className="text-xs text-gray-500">Data will appear as your metrics are tracked</p>
            </div>
          ) : (
            Object.entries(metricsByName).map(([metricName, metricList]) => {
              const latest = metricList[0];
              const baseline = latest.baseline_value;
              const current = latest.current_value;
              const diff = current - baseline;
              const percentChange = baseline !== 0 ? ((diff / baseline) * 100).toFixed(1) : '0';

              const getTrendColor = () => {
                if (Math.abs(diff) < baseline * 0.1) return 'text-green-600';
                if (Math.abs(diff) < baseline * 0.25) return 'text-amber-600';
                return 'text-amber-600';
              };

              return (
                <div key={metricName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Metric</p>
                      <h3 className="text-base font-semibold text-gray-900">
                        {metricName.replace('_', ' ').toUpperCase()}
                      </h3>
                    </div>
                    <TrendingUp className={`w-5 h-5 ${getTrendColor()}`} />
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {current} <span className="text-base text-gray-500">{latest.unit}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Baseline: {baseline} {latest.unit}
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${getTrendColor()}`}>
                      {diff > 0 ? '+' : ''}{percentChange}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 mb-1">Recent readings</div>
                    {metricList.slice(0, 3).map((metric) => (
                      <div key={metric.id} className="flex justify-between text-xs text-gray-600 py-2 border-t border-gray-100">
                        <span>{new Date(metric.recorded_at).toLocaleDateString()}</span>
                        <span className="font-medium">{metric.current_value} {metric.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      {Math.abs(parseFloat(percentChange)) < 10
                        ? 'Your metrics are stable and within expected ranges'
                        : 'Your care team is monitoring these changes'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

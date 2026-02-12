import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Alert, Patient } from '../types';
import { RiskPill } from '../components/RiskPill';
import { Button } from '../components/Button';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

interface AlertWithPatient extends Alert {
  patient?: Patient;
}

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*, patient:patients(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ acknowledged: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    filter === 'active' ? !alert.acknowledged : true
  );

  if (loading) {
    return <LoadingState message="Loading alerts..." />;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Alert Management</h1>
        <p className="text-sm text-gray-600">Review and respond to patient alerts</p>
      </div>

      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({alerts.filter(a => !a.acknowledged).length})
          </Button>
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Alerts ({alerts.length})
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {filteredAlerts.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No alerts"
            description={filter === 'active' ? 'All alerts have been acknowledged' : 'No alerts found'}
          />
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-5 ${
                  alert.acknowledged
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <RiskPill tier={alert.severity} size="sm" />
                      {alert.acknowledged && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3" />
                          Acknowledged
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {alert.patient?.full_name}
                    </h3>

                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Patient ID: {alert.patient?.patient_id}</span>
                      <span>•</span>
                      <span>Metric: {alert.metric_name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!alert.acknowledged && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button variant="tertiary" size="sm">
                      View Patient
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

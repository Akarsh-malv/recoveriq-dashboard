import { SeedPatient } from '../../mocks/seedPatients';
import { Button } from '../Button';

interface PriorityAlertsPanelProps {
  patients: SeedPatient[];
  onPatientClick: (patientId: string) => void;
}

export function PriorityAlertsPanel({ patients, onPatientClick }: PriorityAlertsPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-darkest">Priority Alerts</h3>
        <span className="text-xs text-neutral-mid">Top 5 highest risk</span>
      </div>

      {patients.length === 0 ? (
        <p className="text-sm text-neutral-mid">No priority alerts at this time.</p>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <div key={patient.id} className="rounded-xl border border-gray-200 bg-neutral-light p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-darkest">{patient.name}</p>
                  <p className="mt-1 text-xs text-neutral-mid">{patient.drivers[0] ?? 'No primary driver'}</p>
                  <p className="mt-1 text-xs text-neutral-mid">
                    Last sync: {new Date(patient.lastSync).toLocaleString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                  Risk {Math.round(patient.riskScore)}
                </span>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={() => onPatientClick(patient.id)}>
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

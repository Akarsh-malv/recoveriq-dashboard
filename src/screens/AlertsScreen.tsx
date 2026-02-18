import { AlertsPage } from '../pages/Alerts';

interface AlertsScreenProps {
  onPatientClick: (patientId: string) => void;
}

export function AlertsScreen({ onPatientClick }: AlertsScreenProps) {
  return <AlertsPage onPatientClick={onPatientClick} />;
}

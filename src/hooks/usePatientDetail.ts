import { useQuery } from '@tanstack/react-query';
import { fetchPatientDetail } from '../services/api';

export function usePatientDetail(patientId: string) {
  return useQuery({
    queryKey: ['patient-detail', patientId],
    queryFn: () => fetchPatientDetail(patientId),
  });
}

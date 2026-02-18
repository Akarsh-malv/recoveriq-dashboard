import { CalendarClock, MapPin } from 'lucide-react';
import { PatientAppointment } from '../../types/patient';

interface ScheduledAppointmentsProps {
  appointments: PatientAppointment[];
  className?: string;
}

function formatTimeRange(startAt: string, durationMinutes: number): string {
  const start = new Date(startAt);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const format = (value: Date) =>
    value.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${format(start)} - ${format(end)}`;
}

function getStartsIn(startAt: string): string {
  const diffMinutes = Math.max(0, Math.round((new Date(startAt).getTime() - Date.now()) / 60_000));
  if (diffMinutes < 60) return `Starts in ${diffMinutes}m`;
  const hours = Math.round(diffMinutes / 60);
  return `Starts in ${hours}h`;
}

export function ScheduledAppointments({ appointments, className = '' }: ScheduledAppointmentsProps) {
  return (
    <section className={`flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`.trim()}>
      <h2 className="text-lg font-semibold text-gray-900">Scheduled Appointments</h2>
      <div className="mt-3 flex flex-1 flex-col gap-3">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="flex flex-1 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-blue-200 bg-primary-light px-2 py-0.5 text-[11px] text-primary">
                {appointment.type}
              </span>
              <span className="text-xs font-medium text-primary">{getStartsIn(appointment.startAt)}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">{appointment.title}</p>
            <p className="text-xs text-gray-600">{appointment.provider}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatTimeRange(appointment.startAt, appointment.durationMinutes)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {appointment.location}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

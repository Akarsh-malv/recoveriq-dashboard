import { Patient } from '../../types/patient';
import { RiskPill } from '../ui/RiskPill';
import { Sparkline } from '../charts/Sparkline';
import { Button } from '../Button';

interface PatientTableProps {
  patients: Patient[];
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
}

export function PatientTable({ patients, page, pages, onPageChange, onRowClick }: PatientTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Risk</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Patient</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Drivers</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Trend</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Discharge</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {patients.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick(p.id)}
            >
              <td className="px-4 py-3">
                <RiskPill tier={p.riskTier} score={p.riskScore} size="sm" />
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500">Last sync • {new Date(p.lastSync).toLocaleString()}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.drivers.map((d) => (
                    <span key={d} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {d}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <Sparkline
                  data={Array.from({ length: 7 }).map((_, idx) => ({
                    date: String(idx),
                    value: p.riskScore + Math.sin(idx) * 5,
                  }))}
                  color="#0ea5e9"
                />
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-700">{p.dischargeDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <span className="text-xs text-gray-600">
          Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Prev
          </Button>
          <Button variant="secondary" size="sm" disabled={page === pages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

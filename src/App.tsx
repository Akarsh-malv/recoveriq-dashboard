import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { ClinicianNav } from './components/ClinicianNav';
import { ClinicianDashboard } from './screens/ClinicianDashboard';
import { PatientsScreen } from './screens/PatientsScreen';
import { PatientDetailScreen } from './screens/PatientDetailScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { LoadingState } from './components/LoadingState';
import { OutreachScreen } from './screens/OutreachScreen';
import { MomentumFilter } from './utils/dashboardInsights';
import { SettingsPage } from './pages/Settings';
import { buildPatientProfile, PatientDashboard } from './pages/PatientDashboard';
import { PatientNav } from './components/PatientNav';
import { PatientSettingsPage } from './pages/PatientSettingsPage';
import { PatientAssistantPage } from './pages/PatientAssistantPage';

type ClinicianView = 'dashboard' | 'patients' | 'alerts' | 'outreach' | 'settings' | 'patient-detail';
type PatientView = 'home' | 'assistant' | 'settings';

function App() {
  const { user, role, profile, loading, signIn, signUp, signOut } = useAuth();
  const [clinicianView, setClinicianView] = useState<ClinicianView>('dashboard');
  const [patientView, setPatientView] = useState<PatientView>('home');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientsMomentumFilter, setPatientsMomentumFilter] = useState<MomentumFilter | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingState message="Loading RecoverIQ..." />
      </div>
    );
  }

  if (!user || !role) {
    return <LoginScreen onLogin={signIn} onSignup={signUp} />;
  }

  if (role === 'clinician') {
    const handlePatientClick = (patientId: string) => {
      setSelectedPatientId(patientId);
      setClinicianView('patient-detail');
    };

    const handleBackToPatientTriage = () => {
      setClinicianView('patients');
      setSelectedPatientId(null);
    };

    const handleMomentumFilterSelect = (filter: MomentumFilter) => {
      setPatientsMomentumFilter(filter);
      setClinicianView('patients');
    };

    return (
      <div className="h-screen flex bg-neutral-light">
        <ClinicianNav
          currentView={clinicianView}
          onNavigate={(view) => setClinicianView(view as ClinicianView)}
          onLogout={signOut}
          clinicianName={profile?.fullName}
        />
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {clinicianView === 'dashboard' && (
              <ClinicianDashboard onMomentumFilterSelect={handleMomentumFilterSelect} />
            )}
            {clinicianView === 'alerts' && <AlertsScreen onPatientClick={handlePatientClick} />}
            {clinicianView === 'outreach' && <OutreachScreen />}
            {clinicianView === 'patient-detail' && selectedPatientId && (
              <PatientDetailScreen
                patientId={selectedPatientId}
                onBack={handleBackToPatientTriage}
              />
            )}
            {clinicianView === 'patients' && (
              <PatientsScreen
                onPatientClick={handlePatientClick}
                momentumFilter={patientsMomentumFilter}
                onMomentumFilterApplied={() => setPatientsMomentumFilter(null)}
              />
            )}
            {clinicianView === 'settings' && (
              <SettingsPage
                profile={{
                  fullName: profile?.fullName ?? '',
                  email: profile?.email ?? user.email ?? '',
                  roleLabel: profile?.roleLabel ?? 'Clinical Staff',
                }}
              />
            )}
          </div>
          <div className="border-t border-gray-200 bg-primary-light px-6 py-2 text-[11px] text-neutral-mid">
            Priority scores reflect deviations from a patient baseline recovery trajectory and are intended for workflow triage only. Not diagnostic.
          </div>
        </div>
      </div>
    );
  }

  if (role === 'patient') {
    const patientProfile = buildPatientProfile(profile?.fullName);
    return (
      <div className="h-screen flex bg-neutral-light">
        <PatientNav
          currentView={patientView}
          onNavigate={setPatientView}
          onLogout={signOut}
          patientName={profile?.fullName}
        />
        <div className="flex-1 min-h-0">
          {patientView === 'home' && <PatientDashboard profile={patientProfile} />}
          {patientView === 'assistant' && <PatientAssistantPage profile={patientProfile} />}
          {patientView === 'settings' && (
            <PatientSettingsPage
              profile={{
                fullName: profile?.fullName ?? patientProfile.name,
                email: profile?.email ?? user.email ?? '',
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;

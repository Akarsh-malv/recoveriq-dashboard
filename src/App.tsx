import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { ClinicianNav } from './components/ClinicianNav';
import { PatientNav } from './components/PatientNav';
import { ClinicianDashboard } from './screens/ClinicianDashboard';
import { PatientDetailScreen } from './screens/PatientDetailScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { OnboardingScreen } from './screens/patient/OnboardingScreen';
import { HomeScreen } from './screens/patient/HomeScreen';
import { TrendsScreen } from './screens/patient/TrendsScreen';
import { ProfileScreen } from './screens/patient/ProfileScreen';
import { LoadingState } from './components/LoadingState';
import { OutreachScreen } from './screens/OutreachScreen';

type ClinicianView = 'dashboard' | 'patients' | 'alerts' | 'outreach' | 'settings' | 'patient-detail';
type PatientView = 'onboarding' | 'home' | 'trends' | 'profile';

function App() {
  const { user, role, loading, signIn, signUp, signOut } = useAuth();
  const [clinicianView, setClinicianView] = useState<ClinicianView>('dashboard');
  const [patientView, setPatientView] = useState<PatientView>('onboarding');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientOnboarded, setPatientOnboarded] = useState(false);

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

    const handleBackToDashboard = () => {
      setClinicianView('dashboard');
      setSelectedPatientId(null);
    };

    return (
      <div className="h-screen flex bg-gray-50">
        <ClinicianNav
          currentView={clinicianView}
          onNavigate={(view) => setClinicianView(view as ClinicianView)}
          onLogout={signOut}
        />
        <div className="flex-1 overflow-hidden">
          {clinicianView === 'dashboard' && (
            <ClinicianDashboard onPatientClick={handlePatientClick} />
          )}
          {clinicianView === 'alerts' && <AlertsScreen />}
          {clinicianView === 'outreach' && <OutreachScreen />}
          {clinicianView === 'patient-detail' && selectedPatientId && (
            <PatientDetailScreen
              patientId={selectedPatientId}
              onBack={handleBackToDashboard}
            />
          )}
          {clinicianView === 'patients' && (
            <ClinicianDashboard onPatientClick={handlePatientClick} />
          )}
          {clinicianView === 'settings' && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-600">Settings coming soon</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (role === 'patient') {
    if (!patientOnboarded && patientView === 'onboarding') {
      return (
        <OnboardingScreen
          onComplete={() => {
            setPatientOnboarded(true);
            setPatientView('home');
          }}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {patientView === 'home' && <HomeScreen />}
        {patientView === 'trends' && <TrendsScreen />}
        {patientView === 'profile' && <ProfileScreen />}
        <PatientNav
          currentView={patientView}
          onNavigate={(view) => setPatientView(view as PatientView)}
        />
      </div>
    );
  }

  return null;
}

export default App;

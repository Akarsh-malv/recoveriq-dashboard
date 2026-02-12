import { useState, useEffect } from 'react';
import { User, Bell, FileText, HelpCircle, LogOut, Upload, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [programName, setProgramName] = useState('');

  useEffect(() => {
    loadPatientProfile();
  }, [user]);

  const loadPatientProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('patients')
        .select('full_name, patient_id, program:programs(name)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPatientName(data.full_name);
        setPatientId(data.patient_id);
        setProgramName(data.program?.name || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Account</p>
            <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{patientName || 'Patient'}</h2>
                <p className="text-sm text-gray-600">Patient ID: {patientId || '—'}</p>
                <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  <ShieldCheck className="w-4 h-4" />
                  Trusted Profile
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              </div>
              {programName && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Enrolled Program</p>
                  <p className="text-sm font-semibold text-gray-900">{programName}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Management</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <Upload className="w-5 h-5 text-blue-700" />
                <span className="text-sm text-gray-900">Connect Wearable Device</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-blue-700" />
                <span className="text-sm text-gray-900">Upload Health Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Preferences</h3>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-blue-700" />
              <span className="text-sm text-gray-900">Notifications</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-blue-700" />
                <span className="text-sm text-gray-900">Help & Support</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-blue-700" />
                <span className="text-sm text-gray-900">Privacy Policy</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Session</h3>
              <p className="text-sm text-gray-600 mb-4">You are signed in securely.</p>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

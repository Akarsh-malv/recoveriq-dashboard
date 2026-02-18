export type SettingsSectionId =
  | 'profile'
  | 'workspace'
  | 'notifications'
  | 'integrations'
  | 'security'
  | 'appearance'
  | 'privacy';

export interface SettingsState {
  profile: {
    fullName: string;
    role: string;
    workEmail: string;
    phone: string;
    timeZone: string;
    signatureTemplate: string;
  };
  workspace: {
    workspaceName: string;
    defaultPatientListView: 'triage' | 'all_patients';
    highRiskMin: number;
    mediumRiskMin: number;
  };
  notifications: {
    emailAlerts: boolean;
    inAppAlerts: boolean;
    digestFrequency: 'none' | 'daily' | 'weekly';
    notifyOn: 'high_only' | 'high_medium';
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  integrations: {
    ehrStatus: 'not_connected' | 'connected';
    wearablesMode: 'demo' | 'live';
    webhookUrl: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: '15m' | '30m' | '1h' | '4h';
  };
  appearance: {
    density: 'comfortable' | 'compact';
    accentColor: 'green' | 'teal' | 'slate';
    reduceMotion: boolean;
  };
  privacy: {
    dataRetention: '30d' | '90d' | '180d' | '1y';
  };
}

function getBrowserTimeZone(): string {
  const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return resolved || 'UTC';
}

export function getDefaultSettings(): SettingsState {
  return {
    profile: {
      fullName: 'Clinician',
      role: 'Clinical Staff',
      workEmail: 'clinician@recoveriq.health',
      phone: '',
      timeZone: getBrowserTimeZone(),
      signatureTemplate: 'Follow-up completed. Reviewed baseline deviations and provided next-step guidance.',
    },
    workspace: {
      workspaceName: 'RecoverIQ - Community Hospital',
      defaultPatientListView: 'triage',
      highRiskMin: 75,
      mediumRiskMin: 50,
    },
    notifications: {
      emailAlerts: true,
      inAppAlerts: true,
      digestFrequency: 'daily',
      notifyOn: 'high_medium',
      quietHoursStart: '22:00',
      quietHoursEnd: '06:00',
    },
    integrations: {
      ehrStatus: 'not_connected',
      wearablesMode: 'demo',
      webhookUrl: '',
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: '30m',
    },
    appearance: {
      density: 'comfortable',
      accentColor: 'green',
      reduceMotion: false,
    },
    privacy: {
      dataRetention: '180d',
    },
  };
}

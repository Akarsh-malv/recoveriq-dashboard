# RecoverIQ UI Specification

## Overview

RecoverIQ is a dual-surface healthcare platform consisting of:
1. **Clinician Dashboard** (desktop web) - for clinical staff to monitor patient recovery
2. **Patient Mobile App** (mobile-first) - for patients to track their recovery progress

The UI adheres to healthcare UX best practices: simplicity, clarity, intuitive navigation, calm visual language, and minimal cognitive load.

---

## Design Principles

### 1. Minimalism First
- Clean layouts with white-dominant surfaces
- Clear visual hierarchy
- No decorative color
- Focus on essential information

### 2. Calm Visual Language
- Appropriate for stressed clinical and patient users
- Gentle color usage for meaningful cues only
- Professional and trustworthy aesthetic
- Reduces cognitive load

### 3. Color System

#### Base Neutrals
- **White** (#FFFFFF) - Primary background
- **Gray Scale** - Borders, secondary text, disabled states
  - 50: #F9FAFB
  - 100: #F3F4F6
  - 200: #E5E7EB (borders)
  - 600: #4B5563 (secondary text)
  - 900: #111827 (primary text)

#### Accent Color
- **Blue** (#3B82F6) - Primary CTA, selected elements
  - Used for: Buttons, active states, links
  - Never used decoratively

#### Risk Colors (Information Only)
- **Green** (#22C55E) - Low risk, positive trends
- **Amber** (#F59E0B) - Medium risk, caution
- **Red** (#EF4444) - High risk, alerts

**Important:** Risk colors only appear in pills, icons, and data visualizations. Never used for decoration or large surfaces.

---

## Clinician Dashboard Screens

### 1. Login Screen
**Purpose:** Authenticate clinicians and patients with role selection

**Layout:**
- Centered card on white background
- Logo at top
- Role selector (Clinician/Patient dropdown)
- Email and password fields
- Primary button for sign in
- Forgot password link

**UX Rationale:**
- Role selector prevents wrong interface access
- Simple, distraction-free authentication
- Clear error messaging for failed attempts

---

### 2. Dashboard (Hero Screen)
**Purpose:** Triage view for monitoring all patients

**Layout:**
```
┌─────────────┬─────────────────────────────────────────────┬──────────────┐
│             │  Header: Patient Triage                    │              │
│  Sidebar    │  Subheader: Monitor and prioritize...      │              │
│  Navigation │                                             │  Context     │
│             ├─────────────────────────────────────────────┤  Panel       │
│  - Dashboard│  Filters: Search | Risk | Program | More   │              │
│  - Patients │                                             │  Why flagged │
│  - Alerts   ├─────────────────────────────────────────────┤              │
│  - Settings │  Table:                                     │  Metrics     │
│             │  Risk | Patient | Program | Sync | Alerts  │              │
│             │  ────────────────────────────────────────── │  Actions     │
│             │  [High] Sarah J. | Cardiac | 2h | 2 active │              │
│             │  [Med]  Michael C| Cardiac | 4h | 1 active │              │
│             │  [Low]  Emily R. | Surgery | 1h | None     │              │
│             │                                             │              │
└─────────────┴─────────────────────────────────────────────┴──────────────┘
```

**Components:**
- **Sidebar Navigation:** Persistent left sidebar with icon + label buttons
- **Search Bar:** Full-text search for patient name/ID
- **Filter Controls:** Dropdowns for risk tier, program, data freshness
- **Triage Table:** Sortable columns with hover states
- **Risk Pills:** Color-coded pills with risk score
- **Context Panel:** Right sidebar showing selected patient details

**Interaction States:**
- **Loading:** Spinner with "Loading patients..." message
- **Empty:** Icon + message "No patients found"
- **Error:** Error icon + message with retry button
- **Selected Row:** Blue background highlight

**UX Rationale:**
- Table layout enables quick scanning of multiple patients
- Risk-first column ordering prioritizes high-risk patients
- Context panel provides just-in-time information without navigation
- Filters reduce cognitive load by allowing focus on specific cohorts
- Time-since-sync helps identify stale data

---

### 3. Patient Detail Screen
**Purpose:** Deep dive into individual patient recovery data

**Layout:**
```
┌───────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                          │
│                                                                │
│  Sarah Johnson  [High (78)] [Cardiac Recovery]                │
│  ID: PT-2024-001                                [Create Task] │
├───────────────────────────────────────────────────────────────┤
│  [Overview] [Trends] [Alerts (2)] [Notes (0)] [Raw Data]     │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Recovery Status                                              │
│  ⚠ Declining activity and sleep metrics                       │
│     Multiple metrics trending below baseline...               │
│                                                                │
│  Current vs Baseline Metrics                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Activity    │ │ Sleep       │ │ Heart Rate  │            │
│  │ 115 min     │ │ 5.2 hrs     │ │ 88 bpm      │            │
│  │ Baseline:   │ │ Baseline:   │ │ Baseline:   │            │
│  │ 180 min     │ │ 7.5 hrs     │ │ 72 bpm      │            │
│  │ -36% ↓      │ │ -31% ↓      │ │ +22% ↑      │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└───────────────────────────────────────────────────────────────┘
```

**Tabs:**
1. **Overview** - Status summary, key metrics, recommendations
2. **Trends** - Historical charts with baseline bands
3. **Alerts** - Chronological list of alerts with severity
4. **Notes** - Clinical notes with timestamps
5. **Raw Data** - Table view of all metric readings

**Components:**
- **Breadcrumb Navigation:** Back button with clear label
- **Patient Header:** Name, ID, risk pill, program tag
- **Tab Navigation:** Horizontal tabs with active state indicator
- **Metric Cards:** Baseline vs current with trend indicators
- **Alert Banners:** Colored backgrounds for status messages
- **Data Table:** Clean table for raw data view

**UX Rationale:**
- Breadcrumb provides clear escape route
- Tabs organize complex data without overwhelming
- Overview tab surfaces most critical information first
- Metric cards show trend direction at a glance
- Notes tab enables care team coordination
- Raw data tab available for detailed investigation

---

### 4. Alerts Screen
**Purpose:** Centralized alert management across all patients

**Layout:**
```
┌───────────────────────────────────────────────────────────────┐
│  Alert Management                                             │
│  Review and respond to patient alerts                         │
├───────────────────────────────────────────────────────────────┤
│  [Active (3)] [All Alerts (5)]                                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [High] ✓ Acknowledged  |  Dec 20, 2024                 │  │
│  │ Sarah Johnson                            [Acknowledge]  │  │
│  │ Activity level dropped 36% below baseline              │  │
│  │ PT-2024-001 • activity_minutes            [View Patient]│  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [High]  |  Dec 20, 2024                                 │  │
│  │ Sarah Johnson                            [Acknowledge]  │  │
│  │ Sleep duration significantly reduced                   │  │
│  │ PT-2024-001 • sleep_hours                [View Patient]│  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

**Features:**
- Filter between active and all alerts
- Risk pill indicating severity
- Patient name and ID
- Alert message in plain language
- Acknowledge button for active alerts
- Link to patient detail

**UX Rationale:**
- Centralized view enables efficient alert triage
- Active filter focuses attention on unaddressed items
- Plain language messages reduce interpretation time
- One-click acknowledgment streamlines workflow
- Direct link to patient reduces navigation friction

---

## Patient Mobile App Screens

### 1. Onboarding Screen
**Purpose:** Welcome patients and obtain consent

**Layout:**
```
┌─────────────────────────┐
│                         │
│      [RecoverIQ]        │
│                         │
│  Welcome to RecoverIQ   │
│                         │
│  RecoverIQ helps your   │
│  care team monitor...   │
│                         │
│  ┌───────────────────┐  │
│  │ How it works      │  │
│  │ ✓ Connect device  │  │
│  │ ✓ Team reviews    │  │
│  │ ✓ Get support     │  │
│  └───────────────────┘  │
│                         │
│  ☐ I consent to share   │
│     my health data...   │
│                         │
│  [  Get Started  ]      │
│                         │
│  Your data is private   │
└─────────────────────────┘
```

**UX Rationale:**
- Calm, reassuring introduction
- Clear value proposition
- Simple consent mechanism
- Privacy message builds trust
- Can't proceed without consent

---

### 2. Home Screen
**Purpose:** At-a-glance recovery status

**Layout:**
```
┌─────────────────────────┐
│  Hello, Sarah           │
│  Recovery status        │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │ 📈 On track       │  │
│  │ Metrics stable    │  │
│  └───────────────────┘  │
│                         │
│  Your Metrics           │
│  ┌───────────────────┐  │
│  │ Activity          │  │
│  │ 115 min      📉   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Sleep             │  │
│  │ 5.2 hrs      📉   │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ Need help?        │  │
│  │ Contact care team │  │
│  └───────────────────┘  │
│                         │
├─────────────────────────┤
│  [Home] [Trends] [You] │
└─────────────────────────┘
```

**UX Rationale:**
- Personalized greeting creates connection
- Status card uses calming colors (green/amber only, never red)
- Simplified metric view prevents overwhelm
- Help section always accessible
- Bottom tab navigation familiar pattern

---

### 3. Trends Screen
**Purpose:** Historical metric tracking

**Layout:**
```
┌─────────────────────────┐
│  Your Trends            │
│  Track your progress    │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │ ACTIVITY          │  │
│  │ 115 min    -36%   │  │
│  │ Baseline: 180 min │  │
│  │                   │  │
│  │ Recent readings   │  │
│  │ Dec 20  115 min   │  │
│  │ Dec 19  118 min   │  │
│  │ Dec 18  122 min   │  │
│  │                   │  │
│  │ Your care team is │  │
│  │ monitoring these  │  │
│  │ changes           │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

**UX Rationale:**
- Card-based layout easy to scan
- Shows trajectory without alarming
- Recent readings provide context
- Reassuring message about monitoring
- Plain language explanations

---

### 4. Profile Screen
**Purpose:** Account management and settings

**Layout:**
```
┌─────────────────────────┐
│  Profile                │
│  Manage your account    │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │  👤  Sarah Johnson │  │
│  │  PT-2024-001       │  │
│  │  Cardiac Recovery  │  │
│  └───────────────────┘  │
│                         │
│  Data Management        │
│  [Connect Wearable]     │
│  [Upload Health Data]   │
│                         │
│  Preferences            │
│  [Notifications]        │
│                         │
│  Support                │
│  [Help & Support]       │
│  [Privacy Policy]       │
│                         │
│  [Sign Out]             │
│                         │
└─────────────────────────┘
```

**UX Rationale:**
- Profile card provides identity confirmation
- Grouped sections reduce cognitive load
- Data management prominent for engagement
- Help always accessible
- Sign out clearly visible

---

## Component Inventory

### 1. Button
**Variants:** Primary, Secondary, Tertiary
**Sizes:** Small, Medium, Large
**States:** Default, Hover, Active, Disabled, Loading

**Props:**
```typescript
{
  variant: 'primary' | 'secondary' | 'tertiary'
  size: 'sm' | 'md' | 'lg'
  disabled: boolean
  onClick: () => void
}
```

---

### 2. RiskPill
**Purpose:** Display risk tier with optional score

**Variants:** Low (green), Medium (amber), High (red)
**Sizes:** Small, Medium

**Props:**
```typescript
{
  tier: 'low' | 'medium' | 'high'
  score?: number
  size: 'sm' | 'md'
}
```

**UX Note:** Only component that uses risk colors for background

---

### 3. MetricCard
**Purpose:** Display metric with baseline comparison

**Variants:** Default (full card), Compact (inline)

**Props:**
```typescript
{
  label: string
  baseline: number
  current: number
  unit: string
  variant: 'default' | 'compact'
}
```

**Features:**
- Shows absolute values
- Displays percentage change
- Trend indicator (up/down/neutral)
- Color-coded by trend direction

---

### 4. LoadingState
**Purpose:** Full-page loading indicator

**Props:**
```typescript
{
  message: string
}
```

**Display:**
- Animated spinner (blue)
- Optional message below spinner
- Centered on white background

---

### 5. EmptyState
**Purpose:** Indicates no data available

**Props:**
```typescript
{
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string, onClick: () => void }
}
```

**Layout:**
- Icon in gray circle
- Title and description
- Optional action button

---

### 6. ErrorState
**Purpose:** Display errors with retry option

**Props:**
```typescript
{
  title: string
  message: string
  onRetry?: () => void
}
```

**Layout:**
- Red alert icon
- Error title and message
- Optional retry button

---

### 7. Navigation Components

#### ClinicianNav (Sidebar)
- Logo and app title at top
- Icon + label navigation items
- Active state indicator (blue background)
- User info and sign out at bottom

#### PatientNav (Bottom Tab Bar)
- 3-4 primary navigation items
- Icon + label
- Active state indicator (blue color)
- Fixed to bottom of screen

---

## Sample Data Contracts

### Triage Table Row
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "full_name": "Sarah Johnson",
  "patient_id": "PT-2024-001",
  "program_id": "550e8400-e29b-41d4-a716-446655440001",
  "risk_score": 78,
  "risk_tier": "high",
  "last_data_sync": "2024-12-20T10:00:00Z",
  "status": "active",
  "program": {
    "name": "Cardiac Recovery",
    "color": "#3B82F6"
  },
  "alerts": [
    {
      "id": "alert-1",
      "severity": "high",
      "message": "Activity level dropped 36%",
      "acknowledged": false
    }
  ]
}
```

### Patient Detail Metrics
```json
{
  "patient": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "full_name": "Sarah Johnson",
    "risk_tier": "high",
    "risk_score": 78
  },
  "metrics": [
    {
      "id": "metric-1",
      "metric_name": "activity_minutes",
      "baseline_value": 180,
      "current_value": 115,
      "unit": "min",
      "recorded_at": "2024-12-20T08:00:00Z"
    }
  ]
}
```

### Alert Detail
```json
{
  "id": "alert-1",
  "patient_id": "650e8400-e29b-41d4-a716-446655440001",
  "severity": "high",
  "message": "Activity level has dropped 36% below baseline",
  "metric_name": "activity_minutes",
  "acknowledged": false,
  "created_at": "2024-12-20T09:00:00Z",
  "patient": {
    "full_name": "Sarah Johnson",
    "patient_id": "PT-2024-001"
  }
}
```

---

## Typography System

**Font Family:** System font stack
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

**Font Sizes:**
- xs: 12px (labels, captions)
- sm: 14px (body text, table text)
- base: 16px (default body)
- lg: 18px (subheadings)
- xl: 20px (section headers)
- 2xl: 24px (page headers)

**Font Weights:**
- Normal: 400 (body text)
- Medium: 500 (labels)
- Semibold: 600 (headings, emphasis)

**Line Height:**
- Body: 150% (improves readability)
- Headings: 120% (tighter for impact)

---

## Spacing System

**8px Grid System**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Application:**
- Padding: Multiple of 8px
- Margins: Multiple of 8px
- Gap between elements: 8px minimum

---

## UX Best Practices Summary

### Reducing Cognitive Load
1. **Progressive Disclosure:** Show essential info first, details on demand
2. **Consistent Patterns:** Same interactions work the same way everywhere
3. **Clear Hierarchy:** Important information visually prominent
4. **White Space:** Generous spacing prevents visual crowding

### Simplifying Clinician Choices
1. **Default Views:** Most common use case is default
2. **Contextual Actions:** Actions appear where needed
3. **Smart Filtering:** Reduce options to relevant subset
4. **Bulk Operations:** Common actions available at scale

### Calming Visual Language
1. **Muted Colors:** No bright, alarming colors
2. **Plain Language:** Avoid medical jargon in patient app
3. **Gentle Transitions:** Smooth animations, no jarring changes
4. **Reassuring Messaging:** Frame information positively when appropriate

### Consistency Across Screens
1. **Navigation:** Always in same location
2. **Action Buttons:** Primary actions same color/position
3. **Data Display:** Metrics always show baseline vs current
4. **Error Handling:** Errors always offer recovery path

---

## Navigation Maps

### Clinician Flow
```
Login → Dashboard → Patient Detail → Back to Dashboard
   ↓        ↓              ↓
   →    Alerts →      Notes/Tasks
   →    Settings
```

### Patient Flow
```
Login → Onboarding → Home ←→ Trends ←→ Profile
                      ↑
                      └── Always returns to Home
```

---

## Accessibility Considerations

1. **Color Contrast:** All text meets WCAG AA standards
2. **Focus States:** Visible focus indicators on all interactive elements
3. **Touch Targets:** Minimum 44x44px on mobile
4. **Screen Readers:** Semantic HTML throughout
5. **Keyboard Navigation:** Full keyboard support in clinician dashboard

---

## Mobile Responsiveness

**Clinician Dashboard:**
- Desktop-first: Optimized for 1280px+ width
- Sidebar collapses to hamburger menu on tablet
- Table becomes cards on mobile

**Patient App:**
- Mobile-first: Optimized for 375px width
- Scales up to tablet (768px)
- Bottom navigation fixed on all screen sizes

---

## Performance Considerations

1. **Lazy Loading:** Tab content loads on demand
2. **Pagination:** Large patient lists paginated
3. **Debounced Search:** Search executes 300ms after typing stops
4. **Optimistic Updates:** Acknowledge actions update UI immediately
5. **Error Boundaries:** Graceful degradation if components fail

---

## Future Enhancements

1. **Trend Charts:** Interactive charts showing metric history
2. **Real-time Updates:** WebSocket connection for live data
3. **Notifications:** Push notifications for critical alerts
4. **Export:** CSV/PDF export of patient data
5. **Multi-language:** Internationalization support
6. **Dark Mode:** Optional dark theme for clinicians

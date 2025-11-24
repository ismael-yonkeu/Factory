# Architecture des Applications React

Ce document détaille l'architecture des deux applications React :
1. **Application Admin** - Interface d'administration
2. **Application Web** - Interface de collecte de données terrain

## Structure Commune

Les deux applications partagent une structure similaire mais ont des fonctionnalités différentes.

---

## 1. APPLICATION ADMIN (React.js)

### Structure du Projet

```
admin-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── index.tsx                        # Point d'entrée
│   ├── App.tsx                          # Composant racine
│   ├── setupTests.ts                    # Configuration des tests
│   │
│   ├── assets/                          # Ressources statiques
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/                      # Composants réutilisables
│   │   ├── common/                      # Composants génériques
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Pagination/
│   │   │   ├── Card/
│   │   │   ├── Drawer/
│   │   │   ├── Tabs/
│   │   │   ├── Badge/
│   │   │   ├── Tooltip/
│   │   │   └── Spinner/
│   │   │
│   │   ├── layout/                      # Composants de layout
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── UserMenu.tsx
│   │   │   │   └── Notifications.tsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── NavItem.tsx
│   │   │   │   └── NavGroup.tsx
│   │   │   ├── Footer/
│   │   │   ├── Breadcrumb/
│   │   │   └── PageHeader/
│   │   │
│   │   ├── charts/                      # Composants de graphiques
│   │   │   ├── LineChart/
│   │   │   ├── BarChart/
│   │   │   ├── PieChart/
│   │   │   ├── AreaChart/
│   │   │   └── GaugeChart/
│   │   │
│   │   ├── forms/                       # Composants de formulaire
│   │   │   ├── FormField/
│   │   │   ├── FormSection/
│   │   │   ├── DynamicForm/
│   │   │   └── FieldBuilder/
│   │   │
│   │   └── widgets/                     # Widgets dashboard
│   │       ├── KpiCard/
│   │       ├── StatCard/
│   │       ├── TrendCard/
│   │       └── ActivityFeed/
│   │
│   ├── features/                        # Fonctionnalités par domaine
│   │   │
│   │   ├── auth/                        # Authentification
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── ADLoginForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── UnauthorizedPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── store/
│   │   │       └── authSlice.ts
│   │   │
│   │   ├── dashboard/                   # Dashboard
│   │   │   ├── components/
│   │   │   │   ├── DashboardGrid.tsx
│   │   │   │   ├── WidgetContainer.tsx
│   │   │   │   └── DashboardFilters.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   └── DashboardEditPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboard.ts
│   │   │   │   └── useWidgets.ts
│   │   │   └── store/
│   │   │       └── dashboardSlice.ts
│   │   │
│   │   ├── kpi/                         # KPI
│   │   │   ├── components/
│   │   │   │   ├── KpiList.tsx
│   │   │   │   ├── KpiForm.tsx
│   │   │   │   ├── KpiChart.tsx
│   │   │   │   └── KpiComparison.tsx
│   │   │   ├── pages/
│   │   │   │   ├── KpiListPage.tsx
│   │   │   │   ├── KpiDetailPage.tsx
│   │   │   │   └── KpiCreatePage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useKpi.ts
│   │   │   └── store/
│   │   │       └── kpiSlice.ts
│   │   │
│   │   ├── checklists/                  # Gestion des checklists
│   │   │   ├── components/
│   │   │   │   ├── ChecklistTemplateList.tsx
│   │   │   │   ├── ChecklistBuilder/
│   │   │   │   │   ├── ChecklistBuilder.tsx
│   │   │   │   │   ├── SectionEditor.tsx
│   │   │   │   │   ├── FieldEditor.tsx
│   │   │   │   │   └── FieldTypeSelector.tsx
│   │   │   │   ├── ChecklistPreview.tsx
│   │   │   │   └── ChecklistVersionHistory.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ChecklistListPage.tsx
│   │   │   │   ├── ChecklistCreatePage.tsx
│   │   │   │   ├── ChecklistEditPage.tsx
│   │   │   │   └── ChecklistDetailPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChecklist.ts
│   │   │   │   └── useChecklistBuilder.ts
│   │   │   └── store/
│   │   │       └── checklistSlice.ts
│   │   │
│   │   ├── assignments/                 # Attribution
│   │   │   ├── components/
│   │   │   │   ├── AssignmentList.tsx
│   │   │   │   ├── AssignmentForm.tsx
│   │   │   │   ├── AssignmentCalendar.tsx
│   │   │   │   ├── UserSelector.tsx
│   │   │   │   └── BatchAssignment.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AssignmentListPage.tsx
│   │   │   │   ├── AssignmentCreatePage.tsx
│   │   │   │   └── AssignmentCalendarPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAssignment.ts
│   │   │   └── store/
│   │   │       └── assignmentSlice.ts
│   │   │
│   │   ├── approvals/                   # Approbations
│   │   │   ├── components/
│   │   │   │   ├── ApprovalQueue.tsx
│   │   │   │   ├── ApprovalCard.tsx
│   │   │   │   ├── ApprovalDetails.tsx
│   │   │   │   ├── ApprovalHistory.tsx
│   │   │   │   └── WorkflowBuilder.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ApprovalQueuePage.tsx
│   │   │   │   ├── ApprovalDetailPage.tsx
│   │   │   │   └── WorkflowManagementPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useApproval.ts
│   │   │   └── store/
│   │   │       └── approvalSlice.ts
│   │   │
│   │   ├── users/                       # Gestion des utilisateurs
│   │   │   ├── components/
│   │   │   │   ├── UserList.tsx
│   │   │   │   ├── UserForm.tsx
│   │   │   │   ├── RoleAssignment.tsx
│   │   │   │   └── UserProfile.tsx
│   │   │   ├── pages/
│   │   │   │   ├── UserListPage.tsx
│   │   │   │   ├── UserCreatePage.tsx
│   │   │   │   ├── UserEditPage.tsx
│   │   │   │   └── UserDetailPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useUser.ts
│   │   │   └── store/
│   │   │       └── userSlice.ts
│   │   │
│   │   ├── roles/                       # Gestion des rôles
│   │   │   ├── components/
│   │   │   │   ├── RoleList.tsx
│   │   │   │   ├── RoleForm.tsx
│   │   │   │   └── PermissionMatrix.tsx
│   │   │   ├── pages/
│   │   │   │   ├── RoleListPage.tsx
│   │   │   │   └── RoleEditPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useRole.ts
│   │   │   └── store/
│   │   │       └── roleSlice.ts
│   │   │
│   │   ├── reports/                     # Rapports
│   │   │   ├── components/
│   │   │   │   ├── ReportBuilder.tsx
│   │   │   │   ├── ReportViewer.tsx
│   │   │   │   ├── ReportFilters.tsx
│   │   │   │   └── ExportButton.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ReportListPage.tsx
│   │   │   │   ├── ReportBuilderPage.tsx
│   │   │   │   └── ReportViewPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useReport.ts
│   │   │   └── store/
│   │   │       └── reportSlice.ts
│   │   │
│   │   └── settings/                    # Paramètres
│   │       ├── components/
│   │       │   ├── GeneralSettings.tsx
│   │       │   ├── SecuritySettings.tsx
│   │       │   ├── NotificationSettings.tsx
│   │       │   └── IntegrationSettings.tsx
│   │       ├── pages/
│   │       │   └── SettingsPage.tsx
│   │       └── store/
│   │           └── settingsSlice.ts
│   │
│   ├── hooks/                           # Hooks personnalisés globaux
│   │   ├── useApi.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePermissions.ts
│   │   ├── useTheme.ts
│   │   ├── useMediaQuery.ts
│   │   └── useNotification.ts
│   │
│   ├── store/                           # State management (Redux)
│   │   ├── index.ts                     # Configuration du store
│   │   ├── rootReducer.ts
│   │   ├── hooks.ts                     # Typed hooks
│   │   └── middleware/
│   │       └── apiMiddleware.ts
│   │
│   ├── services/                        # Services API
│   │   ├── api.ts                       # Configuration axios
│   │   ├── authService.ts
│   │   ├── checklistService.ts
│   │   ├── assignmentService.ts
│   │   ├── approvalService.ts
│   │   ├── userService.ts
│   │   ├── kpiService.ts
│   │   ├── dashboardService.ts
│   │   └── reportService.ts
│   │
│   ├── utils/                           # Utilitaires
│   │   ├── formatters.ts                # Formatage dates, nombres, etc.
│   │   ├── validators.ts                # Validations
│   │   ├── constants.ts                 # Constantes
│   │   ├── helpers.ts                   # Fonctions helper
│   │   └── storage.ts                   # LocalStorage helpers
│   │
│   ├── types/                           # Types TypeScript
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Checklist.ts
│   │   │   ├── Assignment.ts
│   │   │   ├── Approval.ts
│   │   │   ├── Kpi.ts
│   │   │   └── Dashboard.ts
│   │   ├── api/
│   │   │   ├── requests.ts
│   │   │   └── responses.ts
│   │   └── common.ts
│   │
│   ├── routes/                          # Configuration des routes
│   │   ├── index.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── PermissionRoute.tsx
│   │
│   ├── styles/                          # Styles globaux
│   │   ├── globals.css
│   │   ├── theme.ts                     # Configuration du thème
│   │   ├── variables.css
│   │   └── mixins.ts
│   │
│   └── config/                          # Configuration
│       ├── env.ts
│       └── app.config.ts
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
```

### Composants Clés

#### 1. App.tsx

```typescript
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { theme } from './styles/theme';
import { Routes } from './routes';
import { useAuth } from './features/auth/hooks/useAuth';
import { Notifications } from './components/common/Notifications';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

function AppContent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Routes />
      <Notifications />
    </>
  );
}

export default App;
```

#### 2. Routes Configuration

```typescript
// src/routes/index.tsx
import React from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PermissionRoute } from './PermissionRoute';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';

// Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ChecklistListPage } from '@/features/checklists/pages/ChecklistListPage';
import { ChecklistCreatePage } from '@/features/checklists/pages/ChecklistCreatePage';
// ... autres imports

export function Routes() {
  return (
    <ReactRoutes>
      {/* Routes publiques */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Routes privées */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Checklists */}
        <Route path="/checklists">
          <Route index element={<PermissionRoute permission="checklist:read"><ChecklistListPage /></PermissionRoute>} />
          <Route path="create" element={<PermissionRoute permission="checklist:create"><ChecklistCreatePage /></PermissionRoute>} />
          <Route path=":id" element={<PermissionRoute permission="checklist:read"><ChecklistDetailPage /></PermissionRoute>} />
          <Route path=":id/edit" element={<PermissionRoute permission="checklist:update"><ChecklistEditPage /></PermissionRoute>} />
        </Route>

        {/* Assignments */}
        <Route path="/assignments">
          <Route index element={<AssignmentListPage />} />
          <Route path="create" element={<AssignmentCreatePage />} />
          <Route path="calendar" element={<AssignmentCalendarPage />} />
        </Route>

        {/* Approvals */}
        <Route path="/approvals">
          <Route index element={<ApprovalQueuePage />} />
          <Route path=":id" element={<ApprovalDetailPage />} />
        </Route>

        {/* KPI */}
        <Route path="/kpi">
          <Route index element={<KpiListPage />} />
          <Route path="create" element={<KpiCreatePage />} />
          <Route path=":id" element={<KpiDetailPage />} />
        </Route>

        {/* Users */}
        <Route path="/users">
          <Route index element={<PermissionRoute permission="user:read"><UserListPage /></PermissionRoute>} />
          <Route path="create" element={<PermissionRoute permission="user:create"><UserCreatePage /></PermissionRoute>} />
          <Route path=":id" element={<UserDetailPage />} />
        </Route>

        {/* Reports */}
        <Route path="/reports">
          <Route index element={<ReportListPage />} />
          <Route path="builder" element={<ReportBuilderPage />} />
          <Route path=":id" element={<ReportViewPage />} />
        </Route>

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </ReactRoutes>
  );
}
```

#### 3. Store Configuration

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import dashboardReducer from '@/features/dashboard/store/dashboardSlice';
import checklistReducer from '@/features/checklists/store/checklistSlice';
import assignmentReducer from '@/features/assignments/store/assignmentSlice';
import approvalReducer from '@/features/approvals/store/approvalSlice';
import kpiReducer from '@/features/kpi/store/kpiSlice';
import userReducer from '@/features/users/store/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    checklist: checklistReducer,
    assignment: assignmentReducer,
    approval: approvalReducer,
    kpi: kpiReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 4. API Service

```typescript
// src/services/api.ts
import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/features/auth/store/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401 et pas déjà retenté
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### 5. Checklist Builder (Fonctionnalité clé)

```typescript
// src/features/checklists/components/ChecklistBuilder/ChecklistBuilder.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, Paper, Typography } from '@mui/material';
import { SectionEditor } from './SectionEditor';
import { FieldEditor } from './FieldEditor';

interface ChecklistBuilderProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export function ChecklistBuilder({ initialData, onSave }: ChecklistBuilderProps) {
  const [checklist, setChecklist] = useState(initialData || {
    title: '',
    description: '',
    sections: []
  });

  const handleAddSection = () => {
    setChecklist({
      ...checklist,
      sections: [
        ...checklist.sections,
        {
          id: `section-${Date.now()}`,
          title: 'Nouvelle section',
          fields: []
        }
      ]
    });
  };

  const handleDragEnd = (result: any) => {
    // Logique de réorganisation par drag & drop
  };

  const handleSectionChange = (sectionId: string, updates: any) => {
    setChecklist({
      ...checklist,
      sections: checklist.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      )
    });
  };

  const handleAddField = (sectionId: string) => {
    setChecklist({
      ...checklist,
      sections: checklist.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              fields: [
                ...s.fields,
                {
                  id: `field-${Date.now()}`,
                  type: 'text',
                  label: 'Nouveau champ',
                  required: false
                }
              ]
            }
          : s
      )
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Constructeur de Checklist
        </Typography>
        {/* Formulaire de base checklist */}
      </Paper>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {checklist.sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SectionEditor
                        section={section}
                        onChange={(updates) => handleSectionChange(section.id, updates)}
                        onAddField={() => handleAddField(section.id)}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="outlined" onClick={handleAddSection} sx={{ mt: 2 }}>
        + Ajouter une section
      </Button>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => onSave(checklist)}>
          Enregistrer
        </Button>
        <Button variant="outlined">
          Annuler
        </Button>
      </Box>
    </Box>
  );
}
```

---

## 2. APPLICATION WEB (React.js - Collecte Terrain)

### Structure du Projet

```
web-app/
├── public/
│   ├── index.html
│   ├── manifest.json                    # PWA manifest
│   ├── service-worker.js                # Service Worker pour offline
│   └── favicon.ico
│
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   │
│   ├── components/                      # Composants réutilisables
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── LoadingSpinner/
│   │   │   └── OfflineIndicator/
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── BottomNav/
│   │   │   └── Container/
│   │   │
│   │   └── forms/                       # Composants de formulaire terrain
│   │       ├── DynamicField/
│   │       ├── PhotoCapture/
│   │       ├── SignatureCapture/
│   │       ├── LocationCapture/
│   │       └── FormProgress/
│   │
│   ├── features/
│   │   │
│   │   ├── auth/                        # Authentification JWT
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── store/
│   │   │       └── authSlice.ts
│   │   │
│   │   ├── assignments/                 # Mes tâches
│   │   │   ├── components/
│   │   │   │   ├── AssignmentCard.tsx
│   │   │   │   ├── AssignmentList.tsx
│   │   │   │   └── AssignmentFilters.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AssignmentListPage.tsx
│   │   │   │   └── AssignmentDetailPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAssignments.ts
│   │   │   └── store/
│   │   │       └── assignmentSlice.ts
│   │   │
│   │   ├── collection/                  # Collecte de données
│   │   │   ├── components/
│   │   │   │   ├── ChecklistForm/
│   │   │   │   │   ├── ChecklistForm.tsx
│   │   │   │   │   ├── SectionView.tsx
│   │   │   │   │   ├── FieldRenderer.tsx
│   │   │   │   │   └── FormNavigation.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── SaveDraftButton.tsx
│   │   │   │   └── SubmitButton.tsx
│   │   │   ├── pages/
│   │   │   │   ├── CollectionPage.tsx
│   │   │   │   └── CollectionReviewPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCollection.ts
│   │   │   │   ├── useFormState.ts
│   │   │   │   └── useAutoSave.ts
│   │   │   └── store/
│   │   │       └── collectionSlice.ts
│   │   │
│   │   ├── sync/                        # Synchronisation
│   │   │   ├── components/
│   │   │   │   ├── SyncStatus.tsx
│   │   │   │   ├── SyncButton.tsx
│   │   │   │   └── ConflictResolver.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSync.ts
│   │   │   │   └── useOnlineStatus.ts
│   │   │   └── store/
│   │   │       └── syncSlice.ts
│   │   │
│   │   └── profile/                     # Profil utilisateur
│   │       ├── components/
│   │       │   ├── ProfileInfo.tsx
│   │       │   └── SettingsForm.tsx
│   │       └── pages/
│   │           └── ProfilePage.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── assignmentService.ts
│   │   ├── collectionService.ts
│   │   ├── syncService.ts
│   │   ├── storage/                     # Stockage local
│   │   │   ├── indexedDB.ts
│   │   │   └── localStorage.ts
│   │   └── offline/                     # Gestion offline
│   │       ├── queueManager.ts
│   │       └── cacheManager.ts
│   │
│   ├── hooks/
│   │   ├── useApi.ts
│   │   ├── useOfflineStorage.ts
│   │   ├── useGeolocation.ts
│   │   ├── useCamera.ts
│   │   └── useNetworkStatus.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   └── persistConfig.ts             # Redux Persist config
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   ├── imageCompression.ts
│   │   └── geolocation.ts
│   │
│   ├── types/
│   │   ├── models/
│   │   └── api/
│   │
│   ├── routes/
│   │   └── index.tsx
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.ts
│   │
│   └── workers/                         # Web Workers
│       ├── sync.worker.ts
│       └── image-processor.worker.ts
│
├── .env.example
├── package.json
└── README.md
```

### Fonctionnalités Clés

#### 1. Gestion du Mode Offline

```typescript
// src/services/offline/queueManager.ts
import { openDB } from 'idb';

const DB_NAME = 'factory-offline';
const QUEUE_STORE = 'sync-queue';

class QueueManager {
  private db: any;

  async init() {
    this.db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
        }
      }
    });
  }

  async addToQueue(action: any) {
    await this.init();
    const tx = this.db.transaction(QUEUE_STORE, 'readwrite');
    await tx.store.add({
      ...action,
      timestamp: Date.now(),
      status: 'pending'
    });
  }

  async getQueue() {
    await this.init();
    return await this.db.getAll(QUEUE_STORE);
  }

  async removeFromQueue(id: number) {
    await this.init();
    await this.db.delete(QUEUE_STORE, id);
  }

  async processQueue() {
    const queue = await this.getQueue();
    for (const item of queue) {
      try {
        await this.processQueueItem(item);
        await this.removeFromQueue(item.id);
      } catch (error) {
        console.error('Error processing queue item:', error);
      }
    }
  }

  private async processQueueItem(item: any) {
    // Traitement de l'item en fonction de son type
    switch (item.type) {
      case 'CREATE_COLLECTION':
        await api.post('/data-collection', item.payload);
        break;
      case 'UPDATE_COLLECTION':
        await api.put(`/data-collection/${item.payload.id}`, item.payload);
        break;
      case 'SUBMIT_COLLECTION':
        await api.post(`/data-collection/${item.payload.id}/submit`, item.payload);
        break;
    }
  }
}

export const queueManager = new QueueManager();
```

#### 2. Hook useSync

```typescript
// src/features/sync/hooks/useSync.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { queueManager } from '@/services/offline/queueManager';
import { useOnlineStatus } from './useOnlineStatus';

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const isOnline = useOnlineStatus();
  const dispatch = useDispatch();

  const updatePendingCount = useCallback(async () => {
    const queue = await queueManager.getQueue();
    setPendingCount(queue.length);
  }, []);

  const sync = useCallback(async () => {
    if (!isOnline) {
      console.log('Offline - sync will happen when online');
      return;
    }

    setIsSyncing(true);
    try {
      await queueManager.processQueue();
      await updatePendingCount();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, updatePendingCount]);

  // Auto-sync quand on revient online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      sync();
    }
  }, [isOnline, pendingCount]);

  useEffect(() => {
    updatePendingCount();
  }, []);

  return {
    sync,
    isSyncing,
    pendingCount,
    isOnline
  };
}
```

#### 3. Formulaire Dynamique de Collecte

```typescript
// src/features/collection/components/ChecklistForm/FieldRenderer.tsx
import React from 'react';
import {
  TextField,
  Select,
  Checkbox,
  Radio,
  FormControlLabel
} from '@mui/material';
import { PhotoCapture } from '@/components/forms/PhotoCapture';
import { SignatureCapture } from '@/components/forms/SignatureCapture';
import { LocationCapture } from '@/components/forms/LocationCapture';

interface FieldRendererProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  switch (field.field_type) {
    case 'text':
    case 'number':
    case 'email':
      return (
        <TextField
          fullWidth
          type={field.field_type}
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.is_required}
          error={!!error}
          helperText={error || field.help_text}
        />
      );

    case 'textarea':
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.is_required}
          error={!!error}
          helperText={error || field.help_text}
        />
      );

    case 'select':
      return (
        <Select
          fullWidth
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.is_required}
          error={!!error}
        >
          {field.options?.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={field.label}
        />
      );

    case 'radio':
      return (
        <div>
          <label>{field.label}</label>
          {field.options?.map((opt: any) => (
            <FormControlLabel
              key={opt.value}
              control={
                <Radio
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                />
              }
              label={opt.label}
            />
          ))}
        </div>
      );

    case 'photo':
      return (
        <PhotoCapture
          label={field.label}
          value={value}
          onChange={onChange}
          required={field.is_required}
          multiple={field.validation_rules?.multiple}
        />
      );

    case 'signature':
      return (
        <SignatureCapture
          label={field.label}
          value={value}
          onChange={onChange}
          required={field.is_required}
        />
      );

    case 'location':
      return (
        <LocationCapture
          label={field.label}
          value={value}
          onChange={onChange}
          required={field.is_required}
        />
      );

    case 'date':
      return (
        <TextField
          fullWidth
          type="date"
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.is_required}
          InputLabelProps={{ shrink: true }}
        />
      );

    case 'time':
      return (
        <TextField
          fullWidth
          type="time"
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.is_required}
          InputLabelProps={{ shrink: true }}
        />
      );

    default:
      return <div>Type de champ non supporté: {field.field_type}</div>;
  }
}
```

#### 4. Service Worker pour PWA

```javascript
// public/service-worker.js
const CACHE_NAME = 'factory-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Synchronisation des données en arrière-plan
  const db = await openIndexedDB();
  const pendingData = await db.getAll('pending-sync');
  
  for (const item of pendingData) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: { 'Content-Type': 'application/json' }
      });
      await db.delete('pending-sync', item.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

## Stack Technologique Détaillée

### Frontend Framework & Libraries

#### Admin App
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "@mui/material": "^5.15.0",
    "@mui/x-data-grid": "^6.18.0",
    "@mui/x-date-pickers": "^6.18.0",
    "recharts": "^2.10.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-beautiful-dnd": "^13.1.1",
    "date-fns": "^3.0.0",
    "react-query": "^3.39.0"
  }
}
```

#### Web App (Terrain)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "redux-persist": "^6.0.0",
    "@mui/material": "^5.15.0",
    "axios": "^1.6.0",
    "idb": "^7.1.0",
    "workbox-webpack-plugin": "^7.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "signature_pad": "^4.1.0",
    "react-webcam": "^7.1.0"
  }
}
```

## Performance et Optimisation

### 1. Code Splitting
```typescript
// Lazy loading des routes
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const ChecklistPage = lazy(() => import('@/features/checklists/pages/ChecklistListPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/checklists" element={<ChecklistPage />} />
  </Routes>
</Suspense>
```

### 2. Memoization
```typescript
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### 3. Virtual Scrolling
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
```

## Tests

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx'
  ]
};
```

### Exemple de Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { LoginForm } from '@/features/auth/components/LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
  
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    
    render(
      <Provider store={store}>
        <LoginForm onSubmit={onSubmit} />
      </Provider>
    );
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

## Déploiement

### Build Configuration
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "build:staging": "env-cmd -f .env.staging react-scripts build",
    "build:production": "env-cmd -f .env.production react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Variables d'Environnement
```env
# .env.production
REACT_APP_API_URL=https://api.factory.com/api/v1
REACT_APP_ENV=production
REACT_APP_ENABLE_ANALYTICS=true
```

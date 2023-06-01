import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('src/Infraestructure/pages/Login/Login.vue'),
  },
  {
    path: '/',
    component: () => import('src/Infraestructure/layouts/MainLayout.vue'),
    children: [
      {
        path: 'index',
        component: () => import('src/Infraestructure/pages/IndexPage.vue'),
      },
      {
        path: 'clinichistory',
        component: () =>
          import(
            'src/Infraestructure/pages/ClinicHistory/ClinicHistoryPage.vue'
          ),
      },
      {
        path: 'appointment',
        component: () =>
          import('src/Infraestructure/pages/Appointment/AppointmentPage.vue'),
      },
      {
        path: 'schedule',
        component: () =>
          import('src/Infraestructure/pages/Schedule/SchedulePage.vue'),
      },
      {
        path: 'patient',
        name: 'patients',
        component: () =>
          import('src/Infraestructure/pages/Patients/PatientsPage.vue'),
      },
      {
        path: 'settings',
        component: () =>
          import('src/Infraestructure/pages/Settings/SettingsPage.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/Infraestructure/pages/ErrorNotFound.vue'),
  },
];

export default routes;

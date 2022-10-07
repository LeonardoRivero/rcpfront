import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') },
      {
        path: 'appointment',
        component: () => import('src/pages/AppointmentPage.vue'),
      },
      {
        path: 'schedule',
        component: () => import('src/pages/SchedulePage.vue'),
      },
      {
        path: 'patient',
        name: 'patients',
        component: () => import('src/pages/PatientsPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('src/pages/SettingsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

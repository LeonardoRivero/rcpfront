import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('src/Infraestructure/pages/Login/LoginUser.vue'),
  },
  {
    path: '/',
    component: () => import('src/Infraestructure/layouts/MainLayout.vue'),
    children: [
      {
        path: 'index',
        component: () => import('src/Infraestructure/pages/IndexMaybe.vue')
      },
      // {
      //   path: 'clinichistory',
      //   component: () =>
      //     import(
      //       'src/Infraestructure/pages/ClinicHistory/ClinicHistoryPage.vue'
      //     ),
      // },
      {
        path: 'appointment',
        component: () =>
          import('src/Infraestructure/pages/Admissions/AdmissionsPage.vue'),
      },
      // {
      //   path: 'appointment/list',
      //   component: () =>
      //     import('src/Infraestructure/pages/Appointment/AppointmentList.vue'),
      // },
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
      // {
      //   path: 'settings',
      //   component: () =>
      //     import('src/Infraestructure/pages/Settings/DashBoard.vue'),
      // },
      {
        path: 'medicaloffice',
        component: () =>
          import('src/Infraestructure/pages/Settings/MedicalOffice.vue'),
      },
      {
        path: 'users',
        component: () =>
          import('src/Infraestructure/pages/Settings/RegisterUsersForm.vue'),
      }
    ],
  },
  {
    path: '/confirmemail',
    component: () => import('src/Infraestructure/pages/Login/ConfirmEmail.vue'),
  },
  {
    path: '/changepassword',
    component: () =>
      import('src/Infraestructure/pages/Login/ChangePassword.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/Infraestructure/pages/ErrorNotFound.vue'),
  },
];

export default routes;

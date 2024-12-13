import ListMedicalOffice from 'src/Infraestructure/pages/Settings/ListMedicalOffice.vue';
import MedicalOffice from 'src/Infraestructure/pages/Settings/MedicalOffice.vue';
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
        path: 'admission',
        component: () =>
          import('src/Infraestructure/pages/Admissions/AdmissionsPage.vue'),
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
      // {
      //   path: 'settings',
      //   component: () =>
      //     import('src/Infraestructure/pages/Settings/DashBoard.vue'),
      // },
      {
        path: '/medicaloffice',
        children: [
          { path: '', component: ListMedicalOffice },
          { path: 'edit', component: MedicalOffice },
          { path: 'add', component: MedicalOffice }
        ]
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
  {
    path: '/forgetpassword',
    component: () =>
      import('src/Infraestructure/pages/Login/ForgetPassword.vue'),
  },
  {
    path: '/resetpassword',
    component: () =>
      import('src/Infraestructure/pages/Login/ResetPassword.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/Infraestructure/pages/ErrorNotFound.vue'),
  },
];

export default routes;

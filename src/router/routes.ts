import ChangePassword from 'src/Infraestructure/pages/Account/ChangePassword.vue';
import ConfirmEmail from 'src/Infraestructure/pages/Account/ConfirmEmail.vue';
import ForgetPassword from 'src/Infraestructure/pages/Account/ForgetPassword.vue';
import LoginUser from 'src/Infraestructure/pages/Account/LoginUser.vue';
import ResetPassword from 'src/Infraestructure/pages/Account/ResetPassword.vue';
import ListMedicalOffice from 'src/Infraestructure/pages/Settings/ListMedicalOffice.vue';
import MedicalOffice from 'src/Infraestructure/pages/Settings/MedicalOffice.vue';
import RegisterUsersForm from 'src/Infraestructure/pages/Settings/RegisterUsersForm.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: LoginUser
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
        component: RegisterUsersForm,
      }
    ],
  },
  {
    path: '/confirmemail',
    component: ConfirmEmail,
  },
  {
    path: '/changepassword',
    component: ChangePassword,
  },
  {
    path: '/forgetpassword',
    component: ForgetPassword,
  },
  {
    path: '/resetpassword',
    component: ResetPassword,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/Infraestructure/pages/ErrorNotFound.vue'),
  },
];

export default routes;

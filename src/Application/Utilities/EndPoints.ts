export const API_BASE_URL = process.env.NODE_ENV === 'development' ? `${process.env.RCPDEV}/rcp` : `${process.env.RCP}/rcp`;

export const ENDPOINTS = {
  CUP: {
    filter: `${API_BASE_URL}/cup/filter`,
  },
  CIE10: {
    filter: `${API_BASE_URL}/cie10/filter`,
  },
  ADMISSION: `${API_BASE_URL}/admission`,
  ALLERGE: `${API_BASE_URL}/settings/allergie/`,
  BIOLOGICAL_SEX: `${API_BASE_URL}/settings/sex`,
  CITY: `${API_BASE_URL}/settings/city`,
  COUNTRIES: `${API_BASE_URL}/country/`,
  DOCTOR: {
    root: `${API_BASE_URL}/doctor/`,
    belongMedicalOffice: `${API_BASE_URL}/doctor/medicaloffice/`
  },
  ETHNICITY: {
    root: `${API_BASE_URL}/settings/ethnicity`,
  },
  INSURANCE: {
    root: `${API_BASE_URL}/healthentity`
  },
  KINDDISABILITY: {
    root: `${API_BASE_URL}/settings/kinddisability`
  },
  KINSHIP: {
    root: `${API_BASE_URL}/settings/kinship/`
  },
  MEDICAL_ENTRY: {
    root: `${API_BASE_URL}/settings/medicalentry/`
  },
  MEDICAL_OFFICE: {
    root: `${API_BASE_URL}/medicaloffice/`,
    belong: `${API_BASE_URL}/medicaloffice/belong`,
    attentionschedule: `${API_BASE_URL}/medicaloffice/attentionschedule/`
  },
  OCUPATION: {
    root: `${API_BASE_URL}/settings/ocupation`
  },
  PATIENT: {
    root: `${API_BASE_URL}/patient/`,
    filter: `${API_BASE_URL}/patient/filter/`
  },
  PAYMENT_OPTIONS: {
    root: `${API_BASE_URL}/settings/paymentoption/`
  },
  PHONECODE: {
    root: `${API_BASE_URL}/settings/phonecode`
  },
  SCHEDULE: {
    root: `${API_BASE_URL}/schedule`,
    patient: `${API_BASE_URL}/schedule/patient/`,
    medicalOffice: `${API_BASE_URL}/schedule/medicaloffice/`
  },
  SECRETARY: {
    root: `${API_BASE_URL}/secretary/`,
    byUser: `${API_BASE_URL}/secretary/byUser`
  },
  SPECIALITY: {
    root: `${API_BASE_URL}/settings/speciality/`
  },
  ACCOUNT: {
    registration: `${API_BASE_URL}/account/register/`,
    login: `${API_BASE_URL}/account/login/`,
    changePassword: `${API_BASE_URL}/account/changepassword/`,
    role: `${API_BASE_URL}/account/role/`,
    confirmEmailRegistration: `${API_BASE_URL}/account/confirmemail/`,
    forgetPassword: `${API_BASE_URL}/account/forgetpassword/`,
    resetPassword: `${API_BASE_URL}/account/resetpassword/`
  },
  ZONE_STAY: {
    root: `${API_BASE_URL}/settings/zonestay`
  },
};

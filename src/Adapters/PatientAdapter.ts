import { Notification } from 'src/Infraestructure/Utilities/Notifications';
import { IStorePatient } from 'src/Infraestructure/stores/PatientsPage/PatientStore';
import { Modal } from '../Infraestructure/Utilities/Modal';
import { routerInstance } from 'src/boot/globalRouter';
import { Validators } from 'src/Application/Utilities/Helpers';
import { Messages } from 'src/Application/Utilities/Messages';
import { PatientService } from 'src/Application/Services/PatientService';
import { IPatient } from 'src/Domine/ModelsDB';
import { PatientResponse } from 'src/Domine/Responses';

export class PatientAdapter {
  private store: IStorePatient;
  private serviceModal = new Modal();
  private messages = Messages.getInstance();
  private notification = new Notification();
  private validator = Validators.getInstance();
  private service = new PatientService();

  private static instance: PatientAdapter;

  private constructor(store: IStorePatient) {
    this.store = store;
  }

  public static getInstance(store: IStorePatient): PatientAdapter {
    if (!PatientAdapter.instance) {
      PatientAdapter.instance = new PatientAdapter(store);
    }
    return PatientAdapter.instance;
  }

  public clear(): void {
    this.store.currentPatient = {} as IPatient;
    this.store.gender = null;
    this.store.idType = null;
    this.store.insurance = null;
  }

  public async searchByIdentificacion(
    identification: string
  ): Promise<PatientResponse | null> {
    const response = await this.service.findByIdentification(identification);
    if (response === null) {
      this.clear();
      this.store.form?.reset();
      this.notification.setMessage(this.messages.notInfoFound);
      this.notification.showWarning();
      this.store.disable = false;
      return null;
    }
    return response;
  }

  public setData(response: PatientResponse) {
    this.store.idType = response.IDType;
    this.store.insurance = response.insurance;
    this.store.gender = response.gender;
    this.store.currentPatient = this.responseToEntity(response);
    this.store.disable = true;
  }

  public enableEdition(): void {
    this.store.disable = false;
  }

  // public idTypeChanged(val: IIDType): void {
  //   // this.store.currentIDType = val;
  //   //this.store.currentPatient.IDType = val;
  // }

  // public genderChanged(val: IGender): void {
  //   // this.store.currentGender = val;
  //   //this.store.currentPatient.gender = val;
  // }

  private responseToEntity(response: PatientResponse): IPatient {
    return {
      id: response.id,
      name: response.name,
      lastName: response.lastName,
      IDType: response.IDType?.id,
      identification: response.identification,
      dateBirth: response.dateBirth,
      phoneNumber: response.phoneNumber,
      insurance: response.insurance.id,
      gender: response.gender.id,
      email: response.email,
    };
  }

  public async saveOrUpdate(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }

    if (!this.store.currentPatient) return;
    let payload: IPatient;
    let response: PatientResponse | null = null;
    if (this.store.currentPatient.id == undefined) {
      payload = {
        name: this.store.currentPatient.name,
        lastName: this.store.currentPatient.lastName,
        IDType: this.store.currentPatient.IDType,
        identification: this.store.currentPatient.identification,
        dateBirth: this.store.currentPatient.dateBirth,
        phoneNumber: this.store.currentPatient.phoneNumber,
        insurance: this.store.currentPatient.insurance,
        gender: this.store.currentPatient.gender,
        email: this.store.currentPatient.email,
      };
      response = await this.save(payload);
      if (response == null) {
        this.notification.setMessage(this.messages.patientNotSaved);
        this.notification.showError();
        return;
      }

      this.clear();
      this.store.form?.reset();
    }
    if (this.store.currentPatient.id != undefined) {
      payload = {
        id: this.store.currentPatient.id,
        name: this.store.currentPatient.name,
        lastName: this.store.currentPatient.lastName,
        IDType: this.store.currentPatient.IDType,
        identification: this.store.currentPatient.identification,
        dateBirth: this.store.currentPatient.dateBirth,
        phoneNumber: this.store.currentPatient.phoneNumber,
        insurance: this.store.currentPatient.insurance,
        gender: this.store.currentPatient.gender,
        email: this.store.currentPatient.email,
      };
      response = await this.update(payload);
    }
    if (response !== null) {
      this.clear();
      this.store.form?.reset();
    }
  }

  private async save(payload: IPatient): Promise<PatientResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.newRegister
    );
    if (confirm === false) {
      return null;
    }

    // if (
    //   this.store.currentIDType?.id == null ||
    //   this.store.currentInsurance?.id == null ||
    //   this.store.currentGender?.id == null
    // ) {
    //   return null;
    // }

    const response = await this.service.save(payload);
    return response;
  }

  private async update(payload: IPatient): Promise<PatientResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );
    if (confirm == false) return null;

    // if (
    //   this.store.idType.id == null ||
    //   this.store.insurance.id == null ||
    //   this.store.gender.id == null
    // ) {
    //   this.notification.setMessage('existen parametros o datos invalidos');
    //   this.notification.showWarning();
    //   return null;
    // }

    const response = await this.service.update(payload);
    return response;
  }

  public isValidEmail(val: string): void {
    const validEmail = this.validator.email(val);
    if (validEmail == false) {
      this.store.error = true;
      this.notification.setMessage('Email invalido');
      this.notification.showError();
      return;
    }

    this.store.currentPatient.email = val;
    this.store.error = false;
  }

  // public async getAllIDTypes(): Promise<Array<IDTypeResponse>> {
  //   const response = await this.repositoryIDTypes.getAll();
  //   if (response === null || response.length === 0) {
  //     return (this.store.allIDTypes = []);
  //   }

  //   this.store.allIDTypes = response;
  //   return response;
  // }

  // public async getAllGenders() {
  //   const response = await this.repositoryGender.getAll();
  //   if (response === null || response.length === 0) {
  //     return (this.store.allGenders = []);
  //   }

  //   this.store.allGenders = response;
  //   return response;
  // }

  // public async getAllPatientStatus(): Promise<Array<PatientStatusResponse>> {
  //   const response = await this.repositoryPatientStatus.getAll();
  //   if (response === null || response.length === 0) {
  //     return (this.store.allPatientStatus = []);
  //   }

  //   this.store.allPatientStatus = response;
  //   return response;
  // }

  // public async getAllReasonConsult() {
  //   const response = await this.repositoryReasonConsult.getAll();
  //   if (response === null || response.length === 0) {
  //     return (this.store.allReasonConsult = []);
  //   }

  //   this.store.allReasonConsult = response;
  //   return response;
  // }

  public async patientNotFound(): Promise<void> {
    const confirm = await this.serviceModal.showModal(
      'Error',
      this.messages.notFoundInfoPatient,
      'error'
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/patient');
    return;
  }
}

// export function patientService() {
//   const {
//     allIDTypes,
//     allReasonConsult,
//     allPatientStatus,
//     currentIDType,
//     currentGender,
//     allGenders,
//     currentPatient,
//     formPatient,
//   } = storeToRefs(store);
//   const { currentInsurance } = storeToRefs(storeInsurance);
//   // const { title, urlToRedirect, visible, redirect } = storeToRefs(storeCommon);
//   const patient = ref<IPatientRequest>();
//   const idType = ref<IIDType>();
//   const gender = ref<IGender>();
//   const insurance = ref<IHealthInsurance>();
//   const identificationPatient = ref<string>('');
//   const formPatient = ref<QForm | null>(null);
//   const error = ref(false);
//   const disable = ref(false);
//   let payload = {} as IPatientRequest;
//   let response = {} as HttpResponse<unknown>;

//   function clearPatient(val: IPatientRequest) {
//     currentPatient.value = {} as IPatientResponse;
//   }
//   async function searchPatient(): Promise<void> {
//     const response = await store.getPatientByIdentification(
//       identificationPatient.value
//     );
//     if (response.status == HttpStatusCodes.NO_CONTENT) {
//       clearPatient({} as IPatientRequest);
//       formPatient.value?.reset();
//       notification.setMessage(messages.notInfoFound);
//       notification.showWarning();
//       return;
//     }
//     const data = response.parsedBody as IPatientResponse;
//     idType.value = data.IDType;
//     insurance.value = data.insurance;
//     gender.value = data.gender;
//     disable.value = true;
//     currentPatient.value = data;
//   }
//   function enableEdition(): void {
//     disable.value = false;
//   }
//   function idTypeChanged(val: IIDType): void {
//     currentIDType.value = val;
//     currentPatient.value.IDType = val;
//   }
//   function genderChanged(val: IGender): void {
//     currentGender.value = val;
//     currentPatient.value.gender = val;
//   }
//   async function confirmChanges(): Promise<void> {
//     const isValid = await formPatient.value?.validate();
//     if (isValid == false) {
//       return;
//     }
//     if (!currentPatient.value) return;
//     let confirmCreate = false;
//     if (currentPatient.value.id == undefined) {
//       confirmCreate = await serviceModal.showModal(
//         'Atención',
//         messages.newRegister
//       );
//       if (confirmCreate === false) {
//         return;
//       }
//     }
//     if (confirmCreate == true) {
//       if (
//         currentIDType.value?.id == null ||
//         currentInsurance.value?.id == null ||
//         currentGender.value?.id == null
//       ) {
//         return;
//       }

//       payload = {
//         name: currentPatient.value.name,
//         lastName: currentPatient.value.lastName,
//         IDType: currentIDType.value?.id,
//         identification: currentPatient.value.identification,
//         dateBirth: currentPatient.value.dateBirth,
//         phoneNumber: currentPatient.value.phoneNumber,
//         insurance: currentInsurance.value?.id,
//         gender: currentGender.value?.id,
//         email: currentPatient.value.email,
//       } as IPatientRequest;
//       const responseCreate = await store.createPatient(payload);
//       if (responseCreate == null) {
//         return;
//       }
//       response = responseCreate;
//       clearPatient({} as IPatientRequest);
//       formPatient.value?.reset();
//       //currentPatient.value = response.parsedBody as IPatientResponse;
//     }
//     let confirmUpdate = false;
//     if (currentPatient.value.id != undefined) {
//       confirmUpdate = await serviceModal.showModal(
//         'Atención',
//         messages.updateRegister
//       );
//       if (confirmUpdate == false) {
//         return;
//       }
//     }
//     if (confirmUpdate == true) {
//       if (
//         currentPatient.value.IDType.id == null ||
//         currentPatient.value.insurance.id == null ||
//         currentPatient.value.gender.id == null
//       ) {
//         notification.setMessage('existen parametros o datos invalidos');
//         notification.showWarning();
//         return;
//       }
//       payload = {
//         id: currentPatient.value.id,
//         name: currentPatient.value.name,
//         lastName: currentPatient.value.lastName,
//         IDType: currentPatient.value.IDType.id,
//         identification: currentPatient.value.identification,
//         dateBirth: currentPatient.value.dateBirth,
//         phoneNumber: currentPatient.value.phoneNumber,
//         insurance: currentPatient.value.insurance.id,
//         gender: currentPatient.value.gender.id,
//         email: currentPatient.value.email,
//       } as IPatientRequest;
//       const responseUpdate = await store.updatePatient(payload);
//       if (responseUpdate == null) {
//         return;
//       }
//       response = responseUpdate;
//     }
//     //currentPatient.value = response.parsedBody as IPatientResponse;
//   }
//   async function getAllIDTypes() {
//     if (store.allIDTypes == undefined) {
//       const response = await store.retrieveAllIDTypes();
//       if (response.status == HttpStatusCodes.NOT_FOUND) {
//         routerInstance.push('/:catchAll');
//       }
//     }
//   }
//   async function getAllGenders() {
//     let response = {} as HttpResponse<unknown>;
//     if (store.allGenders == null) {
//       response = await store.retrieveAllGenders();
//     }
//     if (response.status == HttpStatusCodes.NOT_FOUND) {
//       routerInstance.push('/:catchAll');
//     }
//   }
//   async function getAllReasonConsult() {
//     let response = {} as HttpResponse<unknown>;
//     if (store.allReasonConsult.length == 0) {
//       response = await store.retrieveAllReasonConsult();
//     }
//     if (response.status == HttpStatusCodes.NOT_FOUND) {
//       routerInstance.push('/:catchAll');
//     }
//   }
//   async function getAllPatientStatus() {
//     let response = {} as HttpResponse<unknown>;
//     if (store.allPatientStatus.length == 0) {
//       response = await store.retrieveAllPatientStatus();
//     }
//     if (response.status == HttpStatusCodes.NOT_FOUND) {
//       routerInstance.push('/:catchAll');
//     }
//   }
//   function isValidEmail(val: string): void {
//     const validEmail = validator.email(val);
//     if (validEmail == false) {
//       error.value = true;
//       notification.setMessage('Email invalido');
//       notification.showError();
//       return;
//     }
//     currentPatient.value.email = val;
//     error.value = false;
//   }

//   return {
//     //! Properties
//     allGenders,
//     formPatient,
//     patient,
//     gender,
//     allIDTypes,
//     currentPatient,
//     currentIDType,
//     currentGender,
//     idType,
//     insurance,
//     identificationPatient,
//     disable,
//     allReasonConsult,
//     allPatientStatus,
//     error,
//     //! Computed

//     //! Metodos
//     searchPatient,
//     idTypeChanged,
//     genderChanged,
//     confirmChanges,
//     isValidEmail,
//     getAllIDTypes,
//     getAllGenders,
//     getAllReasonConsult,
//     getAllPatientStatus,
//     enableEdition,
//   };
// }

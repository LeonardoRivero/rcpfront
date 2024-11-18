import { date } from 'quasar';
import { Messages } from 'src/Application/Utilities';
import * as Constants from 'src/Application/Utilities/Constants';
import { AddAdmissionRequest, AddEventToScheduleRequest, FilterScheduleRequest } from 'src/Domine/Request';
import {
  DoctorResponse,
  DoctorSpecialityResponse,
  ScheduleResponse,
  HealthInsuranceResponse,
  PatientResponse,
  SpecialityResponse,
  Patient,
} from 'src/Domine/Responses';
import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IToRead,
  IUseCase,
  Notificator,
} from 'src/Domine/IPatterns';

import { ScheduleState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import { routerInstance } from 'src/boot/globalRouter';

export class ScheduleFormBloc extends Bloc<ScheduleState> {
  private static instance: ScheduleFormBloc
  private notifySweetAlert: Notificator;
  private notifyQuasar: Notificator;

  private constructor(
    private factoryNotify: IFactoryMethodNotifications,
    private doctorSpecialityService: IToRead<DoctorSpecialityResponse>,
    private findPatientByIdentificationUseCase: IUseCase<string, PatientResponse | null>,
    private getDoctorBelongToMedicalOffice: IUseCase<number, DoctorResponse[]>,
    private addEventScheduleUseCase: IUseCase<AddEventToScheduleRequest, ScheduleResponse | null>,
    private getByIdScheduleUseCase: IUseCase<string, ScheduleResponse | null>,
    private updateScheduleUseCase: IUseCase<AddEventToScheduleRequest, ScheduleResponse | null>,
    private getSpecialityBelongToMedicalOfficeUseCase: IUseCase<number, SpecialityResponse[]>,
    private scheduleByIdentificationPatientUseCase: IUseCase<FilterScheduleRequest, ScheduleResponse | null>
  ) {
    const state: ScheduleState = {
      lastConsult: {} as AddAdmissionRequest,
      isReadonly: false,
      currentAppointment: {} as AddAdmissionRequest,
      currentPatient: {
      } as Patient,
      currentSchedule: {
        id: undefined,
        start: '',
        observations: '',
      } as AddEventToScheduleRequest,
      currentDoctor: null,
      allDoctors: [] as DoctorResponse[],
      speciality: null,
      allSpecialities: [],
      identificationPatient: '',
      allowToUpdate: true,
      allowToDelete: false,
      error: false,
      card: false,
      allMedicalOffice: [],
      medicalOfficeSelected: null,
    };
    super(state);
    this.notifyQuasar = factoryNotify.createNotificator(ModalType.NotifyQuasar);
    this.notifySweetAlert = factoryNotify.createNotificator(
      ModalType.SweetAlert
    );
  }

  // receiveData(handle: IControllersMediator): void {
  //   console.log('onReceive');
  //   if (handle instanceof ScheduleMediator) {
  //     const store = handle.getStore();
  //     this.showInfoSchedule(store.scheduleId);
  //   }
  // }

  async clear(): Promise<void> {
    this.changeState({
      ...this.state,
      speciality: null,
      currentDoctor: null,
      currentAppointment: {} as AddAdmissionRequest,
      currentPatient: {
      } as Patient,
      identificationPatient: '',
      currentSchedule: { observations: '' } as AddEventToScheduleRequest,
    });
  }

  public static getInstance(factoryNotify: IFactoryMethodNotifications,
    doctorSpecialityService: IToRead<DoctorSpecialityResponse>,
    findPatientByIdentificationUseCase: IUseCase<string, PatientResponse | null>,
    getDoctorBelongToMedicalOffice: IUseCase<number, DoctorResponse[]>,
    addEventScheduleUseCase: IUseCase<AddEventToScheduleRequest, ScheduleResponse | null>,
    getByIdScheduleUseCase: IUseCase<string, ScheduleResponse | null>,
    updateScheduleUseCase: IUseCase<AddEventToScheduleRequest, ScheduleResponse | null>,
    getSpecialityBelongToMedicalOfficeUseCase: IUseCase<number, SpecialityResponse[]>,
    scheduleByIdentificationPatientUseCase: IUseCase<FilterScheduleRequest, ScheduleResponse | null>): ScheduleFormBloc {

    if (!ScheduleFormBloc.instance) {
      ScheduleFormBloc.instance = new ScheduleFormBloc(factoryNotify, doctorSpecialityService, findPatientByIdentificationUseCase,
        getDoctorBelongToMedicalOffice, addEventScheduleUseCase, getByIdScheduleUseCase, updateScheduleUseCase, getSpecialityBelongToMedicalOfficeUseCase,
        scheduleByIdentificationPatientUseCase);
    }
    return ScheduleFormBloc.instance
  }

  public async confirmDeleteSchedule(): Promise<void> {
    // if (
    //   this.state.currentSchedule.observations.length === 0 ||
    //   this.state.currentSchedule.id == undefined
    // ) {
    //   this.state.error = true;
    //   return;
    // }

    // // this.showThisForm(false);
    // const deleteCommand = new DeleteElementNotify(
    //   Messages.deleteRegister,
    //   this.factoryNotify
    // );
    // const confirm = await deleteCommand.execute();
    // if (confirm == false) {
    //   return;
    // }

    // const response = await this.deleteScheduleUseCase.execute(
    //   this.state.currentSchedule.id
    // );
    // if (response === false) {
    //   this.notifyQuasar.setType('warning');
    //   this.notifyQuasar.show(undefined, Messages.notInfoFound);
    //   return;
    // }

    // const apiCalendar = this.state.calendar.getApi();
    // apiCalendar.refetchEvents();
  }

  public async searchPatient(): Promise<void> {
    const response = await this.findPatientByIdentificationUseCase.execute(this.state.identificationPatient);
    if (response !== null) {
      this.changeState({ ...this.state, currentPatient: response });
      return;
    }

    this.changeState({ ...this.state, card: false })
    this.notifySweetAlert.setType('error')
    const confirm = await this.notifySweetAlert.show('Error', Messages.notFoundInfoPatient)
    if (confirm) {
      routerInstance.push('/patient')
    }
  }

  public async saveOrUpdate(userId: string): Promise<void> {
    if (!this.state.currentDoctor?.id || this.state.speciality === null || this.state.medicalOfficeSelected == null) {
      return;
    }


    let response: ScheduleResponse | null = null;
    // const endAppointment = date.addToDate(this.state.currentSchedule.start, {
    //   minutes: Constants.MINUTES_APPOINTMENT,
    // });

    // this.state.currentSchedule.end = date.formatDate(
    //   endAppointment,
    //   Constants.FORMAT_DATETIME
    // );

    const name = this.state.currentPatient.name;
    const lastName = this.state.currentPatient.lastName;
    const payload: AddEventToScheduleRequest = {
      title: `${name} ${lastName}`,
      start: this.state.currentSchedule.start,
      patientId: this.state.currentPatient.id,
      specialityId: this.state.speciality.id,
      doctorId: this.state.currentDoctor.id,
      observations: this.state.currentSchedule.observations,
      userId: userId,
      medicalOfficeId: this.state.medicalOfficeSelected.id
    };

    try {
      if (this.state.currentSchedule.id == undefined) {
        delete payload['id'];
        response = await this.addEventScheduleUseCase.execute(payload);
        if (response === null) {
          this.notifyQuasar.setType('error');
          this.notifyQuasar.show(undefined, Messages.scheduleExisting);
          return;
        }
      }

      if (this.state.currentSchedule.id != undefined) {
        payload.id = this.state.currentSchedule.id
        response = await this.updateScheduleUseCase.execute(payload);
        if (response === null) {
          this.notifyQuasar.setType('error');
          this.notifyQuasar.show(undefined, Messages.scheduleExisting);
          return;
        }
      }


      // this.showThisForm(false);
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, Messages.successMessage);
      this.changeState({ ...this.state, card: false })
      // notification.setMessage(Messages.scheduleExisting);
      // notification.showError();
      // this.notifyQuasar.setType('error');
      // this.notifyQuasar.show(undefined, Messages.errorMessage);
      // return;


      // this.notifyQuasar.setType('success');
      // this.notifyQuasar.show(undefined, Messages.successMessage);
      // const apiCalendar = this.state.calendar.getApi();
      // apiCalendar.refetchEvents();
      // this.mediator.notify({}, this);
    } catch (error: any) {
      const messageError = (error as Error).message;
      const notifyQuasar = this.factoryNotify.createNotificator(
        ModalType.NotifyQuasar
      );
      notifyQuasar.setType('error');
      notifyQuasar.show(undefined, messageError);
    }
  }

  // private async save(
  //   payload: EventSchedule
  // ): Promise<ScheduleResponse| null> {
  //   const response = await this.service.create(payload);
  //   // const apiCalendar = this.state.calendar.getApi();
  //   // apiCalendar.refetchEvents();
  //   return response;
  // }

  // private async update(
  //   payload: EventSchedule
  // ): Promise<ScheduleResponse| null> {
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.updateRegister
  //   );
  //   if (confirm == false) return null;
  //   if (payload.id == null) return null;
  //   const response = await this.service.update(payload, payload.id);
  //   return response;
  // }

  public async handleDateSelect(selectInfo: Date): Promise<void> {
    const selectInfoFormatted = date.formatDate(
      selectInfo,
      Constants.FORMAT_DATETIME
    );
    // this.state.card = true;
    // this.state.allowToDelete = false;
    // this.state.allowToUpdate = true;
    // this.state.isReadonly = false;
    this.changeState({
      ...this.state,
      card: true,
      currentSchedule: {
        ...this.state.currentSchedule,
        // end: new Date().toLocaleString(),
        start: selectInfoFormatted, id: undefined
      },
      medicalOfficeSelected: null
    })
  }

  public async showInfoSchedule(scheduleId: string): Promise<void> {
    const response = await this.getByIdScheduleUseCase.execute(scheduleId)
    if (response === null) {
      const notifyQuasar = this.factoryNotify.createNotificator(
        ModalType.NotifyQuasar
      );
      notifyQuasar.setType('error');
      notifyQuasar.show(undefined, Messages.errorMessage);
      return
    }

    this.changeState({
      ...this.state, card: true, currentPatient: response.patient,
      currentDoctor: response.doctor,
      identificationPatient: response.patient.identification,
      currentSchedule: {
        ...this.state.currentSchedule,
        start: new Date(response.start).toLocaleString('en-US', Constants.OPTIONS_TIMEZONE),
        observations: response.observations,
        id: response.id
      },
      speciality: response.speciality,
      medicalOfficeSelected: response.medicalOffice,
      allowToUpdate: new Date() <= new Date(response.start)
    })
  }

  public async findByIdentificationPatient(
    identification: string
  ): Promise<ScheduleResponse | null> {
    const payload: FilterScheduleRequest = {
      identificationPatient: identification,
      medicalOfficeId: this.state.medicalOfficeSelected == null ? 0 : this.state.medicalOfficeSelected.id
    }
    const register = await this.scheduleByIdentificationPatientUseCase.execute(
      payload
    );
    return register;
  }

  public async getDoctorsBelongSpeciality(specialityId: number): Promise<void> {
    if (this.doctorSpecialityService == undefined) return;
    const response = await this.doctorSpecialityService.findByParameters({
      speciality: specialityId,
    });
    this.changeState({
      ...this.state,
      // allDoctors: response,
      currentDoctor: null,
    });
  }

  // public showThisForm(visibility: boolean) {
  //   // const store = <IStoreSchedule>this.mediator.getStore();
  //   // store.card = visibility;
  // }

  public setDateWhenScheduleIsNew() {
    // const store = <IStoreSchedule>this.mediator.getStore();
    // this.state.currentSchedule.start = store.dateSchedule;
    // this.changeState({
    //   ...this.state,
    //   currentSchedule: this.state.currentSchedule,
    //   allowToUpdate: true,
    // });
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState): Promise<void> {
    // const actionsScheduleMediator = <ActionsScheduleMediator>(
    //   (<unknown>this.mediator)
    // );
    const medicalofficeId = handleGlobalState.store.currentMedicalOffice[0].id
    const response = await this.getSpecialityBelongToMedicalOfficeUseCase.execute(medicalofficeId);
    const doctors = await this.getDoctorBelongToMedicalOffice.execute(medicalofficeId)

    this.changeState({
      ...this.state,
      allSpecialities: response,
      allDoctors: doctors,
      currentDoctor: doctors.length == 1 ? doctors[0] : null,
      allMedicalOffice: handleGlobalState.store.currentMedicalOffice

      // allowToUpdate: false,
    });
    // const store = <IStoreSchedule>this.mediator.getStore();
    // if (store.scheduleId != null) {
    //   this.showInfoSchedule(store.scheduleId);
    // } else {
    //   this.setDateWhenScheduleIsNew();
    // }
  }
}

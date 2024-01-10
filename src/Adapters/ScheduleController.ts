import { date } from 'quasar';
import { Messages, Validators } from 'src/Application/Utilities';
import * as Constants from 'src/Application/Utilities/Constants';
import { routerInstance } from 'src/boot/globalRouter';
import { EventSchedule } from 'src/Domine/ModelsDB';
import {
  DoctorSpecialityResponse,
  EventScheduleResponse,
} from 'src/Domine/Responses';
import {
  DeleteScheduleUseCase,
  FindScheduleByIdentificationPatientUseCase,
  ScheduleService,
} from 'src/Application/Services/ScheduleService';
import {
  Controller,
  IControllersMediator,
  IFactoryMethodNotifications,
  IToRead,
  Notificator,
} from 'src/Domine/IPatterns';

import { ScheduleState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import {
  AppointmentService,
  FindPatientByIdentificationUseCase,
} from 'src/Application/Services';
import { IStoreSchedule } from 'src/Domine/IStores';
import { ScheduleMediator } from 'src/Infraestructure/Mediators/ScheduleMediator';
import { DeleteElementNotify, NotFoundElementNotify } from './Commands';
import { EditCommand } from 'src/Application/Commands';

const validator = Validators.getInstance();
export class ScheduleController extends Controller {
  public state: ScheduleState;
  private notificator: IFactoryMethodNotifications;
  private notifySweetAlert: Notificator;
  private notifyQuasar: Notificator;
  private appointmentService = new AppointmentService();
  private service = new ScheduleService();
  private scheduleByIdentificationPatientUseCase =
    new FindScheduleByIdentificationPatientUseCase();
  private deleteScheduleUseCase = new DeleteScheduleUseCase();
  public doctorSpecialityService: IToRead<DoctorSpecialityResponse> | undefined;

  public constructor(
    state: ScheduleState,
    factoryNotify: IFactoryMethodNotifications
  ) {
    super();
    this.state = state;
    this.notificator = factoryNotify;
    this.notifyQuasar = this.notificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.notifySweetAlert = this.notificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  receiveData(handle: IControllersMediator): void {
    console.log('onReceive');
    if (handle instanceof ScheduleMediator) {
      const store = handle.getStore();
      this.showInfoSchedule(store.scheduleId);
    }
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  // public static getInstance(store: ScheduleState): ScheduleAdapter {
  //   if (!ScheduleAdapter.instance) {
  //     ScheduleAdapter.instance = new ScheduleAdapter(store);
  //   }
  //   return new ScheduleAdapter(store);
  // }

  public async confirmDeleteSchedule(): Promise<void> {
    if (
      this.state.currentSchedule.observations.length === 0 ||
      this.state.currentSchedule.id == undefined
    ) {
      this.state.error = true;
      return;
    }

    this.showThisForm(false);
    const deleteCommand = new DeleteElementNotify(
      Messages.deleteRegister,
      this.notificator
    );
    const confirm = await deleteCommand.execute();
    if (confirm == false) {
      return;
    }

    const response = await this.deleteScheduleUseCase.execute(
      this.state.currentSchedule.id
    );
    if (response === false) {
      this.notifyQuasar.setType('warning');
      this.notifyQuasar.show(undefined, Messages.notInfoFound);
      return;
    }

    // const apiCalendar = this.state.calendar.getApi();
    // apiCalendar.refetchEvents();
  }

  public async scheduleNotFound(): Promise<void> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.patientNotSchedule
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/schedule');
    return;
  }

  public async searchPatient(): Promise<void> {
    const useCase = FindPatientByIdentificationUseCase.getInstance();
    const response = await useCase.execute(this.state.identificationPatient);
    if (response !== null) {
      this.state.currentPatient = response;
      return;
    }
    const storeSchedule = <IStoreSchedule>this.mediator.getStore();
    storeSchedule.card = false;
    const notFoundPatient = new NotFoundElementNotify(
      Messages.notFoundInfoPatient,
      this.notificator,
      '/patient'
    );
    await notFoundPatient.execute();
  }

  public async saveOrUpdate(): Promise<void> {
    if (!this.state.currentDoctor?.user.id || this.state.speciality === null)
      return;
    this.executeValidations();
    let response: EventScheduleResponse | null = null;
    const endAppointment = date.addToDate(this.state.currentSchedule.start, {
      minutes: Constants.MINUTES_APPOINTMENT,
    });

    this.state.currentSchedule.end = date.formatDate(
      endAppointment,
      Constants.FORMAT_DATETIME
    );

    const name = this.state.currentPatient.name;
    const lastName = this.state.currentPatient.lastName;
    const payload: EventSchedule = {
      title: `${name} ${lastName}`,
      start: this.state.currentSchedule.start,
      end: this.state.currentSchedule.end,
      patient: this.state.currentPatient.id,
      speciality: this.state.speciality,
      doctor: this.state.currentDoctor.id,
      observations: this.state.currentSchedule.observations,
    };

    if (this.state.currentSchedule.id == undefined) {
      delete payload['id'];
      response = await this.service.create(payload);
      if (response === null) {
        this.notifyQuasar.setType('error');
        this.notifyQuasar.show(undefined, Messages.scheduleExisting);
        return;
      }
    }

    if (this.state.currentSchedule.id != undefined) {
      // payload = {
      //   id: this.state.currentSchedule.id,
      //   title: `${name} ${lastName}`,
      //   start: this.state.currentSchedule.start,
      //   end: this.state.currentSchedule.end,
      //   patient: this.state.currentPatient.id,
      //   speciality: this.state.speciality,
      //   doctor: this.state.currentDoctor.user.id,
      //   observations: this.state.currentSchedule.observations,
      // };
      // response = await this.update(payload);
      const editCommand = new EditCommand(
        payload,
        this.state.currentSchedule.id,
        this.service
      );
      response = <EventScheduleResponse | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    if (response !== null) {
      this.showThisForm(false);
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, Messages.successMessage);
      // notification.setMessage(Messages.scheduleExisting);
      // notification.showError();
      // this.notifyQuasar.setType('error');
      // this.notifyQuasar.show(undefined, Messages.errorMessage);
      // return;
    }

    // this.notifyQuasar.setType('success');
    // this.notifyQuasar.show(undefined, Messages.successMessage);
    // const apiCalendar = this.state.calendar.getApi();
    // apiCalendar.refetchEvents();
    this.mediator.notify({}, this);
  }

  // private async save(
  //   payload: EventSchedule
  // ): Promise<EventScheduleResponse | null> {
  //   const response = await this.service.create(payload);
  //   // const apiCalendar = this.state.calendar.getApi();
  //   // apiCalendar.refetchEvents();
  //   return response;
  // }

  // private async update(
  //   payload: EventSchedule
  // ): Promise<EventScheduleResponse | null> {
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.updateRegister
  //   );
  //   if (confirm == false) return null;
  //   if (payload.id == null) return null;
  //   const response = await this.service.update(payload, payload.id);
  //   return response;
  // }

  // public async handleDateSelect(selectInfo: DateSelectArg) {
  //   this.state.currentSchedule.id = undefined;
  //   this.state.currentSchedule.start = date.formatDate(
  //     selectInfo.start,
  //     Constants.FORMAT_DATETIME
  //   );
  //   this.state.card = true;
  //   this.state.allowToDelete = false;
  //   this.state.allowToUpdate = true;
  //   this.state.isReadonly = false;
  // }

  public async showInfoSchedule(id: number): Promise<void> {
    const schedule = await this.service.getById(id);
    if (schedule === null) {
      return;
    }
    this.state.currentPatient = schedule.patient;
    this.state.identificationPatient =
      schedule.patient.identification.toString();
    this.state.currentSchedule.id = schedule.id;
    this.state.currentSchedule.start = date.formatDate(
      schedule.start,
      Constants.FORMAT_DATETIME
    );
    this.state.currentSchedule.end = date.formatDate(
      schedule.end,
      Constants.FORMAT_DATETIME
    );
    this.state.currentSchedule.observations = schedule.observations;
    if (schedule.speciality == null || schedule.id == undefined) return;
    this.state.speciality = schedule.speciality.id;
    this.state.currentDoctor = schedule.doctor;
    const dateIsValid = validator.dateAndHour(schedule.start);
    this.state.allowToUpdate = true;
    if (dateIsValid == false) {
      this.state.allowToUpdate = false;
      this.state.allowToDelete = false;
      // this.showThisForm(true);
      return;
    }
    const response = await this.appointmentService.getById(schedule.id);
    // this.state.allowToDelete = false;
    if (response === null) {
      this.state.allowToDelete = true;
      this.state.isReadonly = true;
      // this.showThisForm(true);
      return;
    }
  }

  public async findByIdentificationPatient(
    identification: string
  ): Promise<EventScheduleResponse | null> {
    const register = await this.scheduleByIdentificationPatientUseCase.execute(
      identification
    );
    return register;
  }

  public async getDoctorsBelongSpeciality(specialityId: number): Promise<void> {
    if (this.doctorSpecialityService == undefined) return;
    const response = await this.doctorSpecialityService.findByParameters({
      speciality: specialityId,
    });
    this.state.currentDoctor = null;
    this.state.allDoctors = response;
  }

  public showThisForm(visibility: boolean) {
    const store = <IStoreSchedule>this.mediator.getStore();
    store.card = visibility;
  }

  public executeValidations(): boolean {
    const dateIsValid = validator.dateAndHour(this.state.currentSchedule.start);
    if (dateIsValid === false) {
      throw new Error(Messages.dateOrHourNotValid);
    }
    return true;
  }

  public setDateWhenScheduleIsNew() {
    const store = <IStoreSchedule>this.mediator.getStore();
    this.state.currentSchedule.start = store.dateSchedule;
  }
}

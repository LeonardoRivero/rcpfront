import { date } from 'quasar';
import { Messages, Validators } from 'src/Application/Utilities';
import * as Constants from 'src/Application/Utilities/Constants';
import { routerInstance } from 'src/boot/globalRouter';
import { EventSchedule } from 'src/Domine/ModelsDB';
import { EventScheduleResponse } from 'src/Domine/Responses';
import { ScheduleService } from 'src/Application/Services/ScheduleService';
import {
  Controller,
  HTTPClient,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
import { FactoryNotifactors } from './Creators/Factories';
import { ScheduleState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import {
  AppointmentService,
  DoctorSpecialityService,
} from 'src/Application/Services';
import { IStoreSchedule } from 'src/Domine/IStores';
import { ScheduleMediator } from 'src/Infraestructure/Mediators/ScheduleMediator';
import container from 'src/inversify.config';

const validator = Validators.getInstance();
export class ScheduleAdapter extends Controller {
  public state: ScheduleState;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);
  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.NotifyQuasar);
  private appointmentService = new AppointmentService();
  private service = new ScheduleService();

  // private static instance: ScheduleAdapter;

  public constructor(state: ScheduleState) {
    super();
    this.state = state;
  }

  receiveData(handle: IControllersMediator): void {
    console.log('onReceive');
    if (handle instanceof ScheduleMediator) {
      const store = handle.getStore();
      this.eventClick(store.scheduleId);
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

  public async confirmDeleteSchedule(scheduleId: number): Promise<void> {
    this.showThisForm(false);
    this.notifySweetAlert.setType('warning');
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.deleteRegister
    );
    if (confirm == false) {
      return;
    }

    const response = await this.service.delete(scheduleId);
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

  public async searchPatient(identification: string): Promise<void> {
    return;
    // const queriesParameters = {
    //   identification: identification,
    // };
    // const response = await this.repositoryPatients.findByParameters(
    //   queriesParameters
    // );
    // if (response !== null) {
    //   this.store.currentPatient = response[0];
    //   return;
    // }
    // notification.setMessage(messages.notInfoFound);
    // notification.showWarning();
    // this.store.card = false;
    // this.store.currentPatient = {
    //   identification: parseInt(this.store.identificationPatient),
    // } as PatientResponse;
    // await this.servicePatient.patientNotFound();
    // return;
  }

  public async saveOrUpdate(): Promise<void> {
    if (!this.state.currentDoctor?.user.id || this.state.speciality === null)
      return;
    let response: EventScheduleResponse | null = null;
    let payload: EventSchedule;

    const endAppointment = date.addToDate(this.state.currentSchedule.start, {
      minutes: Constants.MINUTES_APPOINTMENT,
    });
    this.state.currentSchedule.end = date.formatDate(
      endAppointment,
      Constants.FORMAT_DATETIME
    );
    const name = this.state.currentPatient.name;
    const lastName = this.state.currentPatient.lastName;
    if (this.state.currentSchedule.id == undefined) {
      delete this.state.currentSchedule['id'];
      payload = {
        title: `${name} ${lastName}`,
        start: this.state.currentSchedule.start,
        end: this.state.currentSchedule.end,
        patient: this.state.currentPatient.id,
        speciality: this.state.speciality,
        doctor: this.state.currentDoctor.user.id,
        observations: this.state.currentSchedule.observations,
      };
      response = await this.save(payload);
      if (response === null) {
        this.notifyQuasar.setType('error');
        this.notifyQuasar.show(undefined, Messages.scheduleExisting);
        return;
      }

      // this.mediator.notify({}, this);
      this.showThisForm(false);
      return;
    }

    if (this.state.currentSchedule.id != undefined) {
      this.showThisForm(false);
      payload = {
        id: this.state.currentSchedule.id,
        title: `${this.state.currentPatient.name} ${this.state.currentPatient.lastName}`,
        start: this.state.currentSchedule.start,
        end: this.state.currentSchedule.end,
        patient: this.state.currentPatient.id,
        speciality: this.state.speciality,
        doctor: this.state.currentDoctor.user.id,
        observations: this.state.currentSchedule.observations,
      };
      response = await this.update(payload);
    }

    if (response === null) {
      // notification.setMessage(Messages.scheduleExisting);
      // notification.showError();
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.errorMessage);
      return;
    }
    this.showThisForm(false);
    this.notifyQuasar.setType('success');
    this.notifyQuasar.show(undefined, Messages.successMessage);
    // const apiCalendar = this.state.calendar.getApi();
    // apiCalendar.refetchEvents();
  }

  private async save(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    const response = await this.service.create(payload);
    // const apiCalendar = this.state.calendar.getApi();
    // apiCalendar.refetchEvents();
    return response;
  }

  private async update(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.updateRegister
    );
    if (confirm == false) return null;
    if (payload.id == null) return null;
    const response = await this.service.update(payload, payload.id);
    return response;
  }

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

  public async eventClick(id: number): Promise<void> {
    const schedule = await this.service.getById(id);
    if (schedule === null) {
      return;
    }
    console.log(schedule);
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
      this.showThisForm(true);
      return;
    }
    const response = await this.appointmentService.getById(schedule.id);
    this.state.allowToDelete = false;
    this.showThisForm(true);
    if (response === null) {
      this.state.allowToDelete = true;
      this.state.isReadonly = true;
      return;
    }
  }

  public async findByIdentificationPatient(
    identification: string
  ): Promise<EventScheduleResponse | null> {
    const register = await this.service.findByIdentificationPatient(
      identification
    );
    return register;
  }

  public async getDoctorsBelongSpeciality(specialityId: number): Promise<void> {
    const queriesParameters = {
      speciality: specialityId,
    };
    const service = new DoctorSpecialityService(
      container.get<HTTPClient>('HTTPClient')
    );
    const response = await service.findByParameters(queriesParameters);
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
}

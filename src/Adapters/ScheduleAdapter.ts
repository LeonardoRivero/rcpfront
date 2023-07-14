import '@fullcalendar/core/vdom';
import { EventAddArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { QForm, date } from 'quasar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/vue3';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/vue3';
import { Notification } from 'src/Infraestructure/Utilities/Notifications';
import { Convert, Messages, Validators } from 'src/Application/Utilities';
import * as Constants from 'src/Application/Utilities/Constants';
import { routerInstance } from 'src/boot/globalRouter';
import { EventSchedule } from 'src/Domine/ModelsDB';
import { AppointmentRepository } from 'src/Application/Repositories/AppointmentRepository';
import { EventScheduleResponse } from 'src/Domine/Responses';
import { ScheduleService } from 'src/Application/Services/ScheduleService';
import {
  Controller,
  IControllersMediator,
  ModalType,
  Notificator,
} from 'src/Domine/IPatterns';
import { FactoryNotifactors } from './Creators/Factories';
import { ScheduleState } from 'src/Domine/IStates';

const validator = Validators.getInstance();
export class ScheduleAdapter extends Controller {
  public state: ScheduleState;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);
  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.NotifyQuasar);
  // private repository: IRepository<EventSchedule, EventScheduleResponse>;
  private repositoryAppointment = new AppointmentRepository();
  private service = new ScheduleService();
  private convert = new Convert();

  private static instance: ScheduleAdapter;

  private constructor(state: ScheduleState) {
    super();
    this.state = state;
    // this.repository = new ScheduleRepository();
    return;
  }
  sendData(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  public static getInstance(store: ScheduleState): ScheduleAdapter {
    if (!ScheduleAdapter.instance) {
      ScheduleAdapter.instance = new ScheduleAdapter(store);
    }
    return ScheduleAdapter.instance;
  }

  public async confirmDeleteSchedule(scheduleId: number): Promise<void> {
    this.state.card = false;
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

    const apiCalendar = this.state.calendar.getApi();
    apiCalendar.refetchEvents();
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

  public async saveOrUpdate(schedule: EventSchedule): Promise<void> {
    // // const queriesParameters = {
    // //   identification: this.store.identificationPatient,
    // // };
    // const responsePatient = await this.repositoryPatients.findByParameters(
    //   queriesParameters
    // );
    // if (responsePatient === null || responsePatient.id == null) {
    //   notification.setMessage(messages.notInfoFound);
    //   notification.showWarning();
    //   this.store.card = false;
    //   await serviceModal.showModal('Atención', messages.notFoundInfoPatient);
    //   return;
    // }
    const dateIsValid = validator.dateAndHour(this.state.currentSchedule.start);
    if (dateIsValid === false) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.dateOrHourNotValid);
      return;
    }
    if (
      !this.state.currentSchedule ||
      !this.state.currentDoctor?.id ||
      this.state.speciality === null
    )
      return;
    let response: EventScheduleResponse | null = null;
    let payload: EventSchedule;

    const endAppointment = date.addToDate(this.state.currentSchedule.start, {
      minutes: Constants.MINUTES_APPOINTMENT,
    });
    schedule.end = date.formatDate(endAppointment, Constants.FORMAT_DATETIME);
    const name = this.convert.toTitle(this.state.currentPatient.name);
    const lastName = this.convert.toTitle(this.state.currentPatient.lastName);
    if (schedule.id == undefined) {
      payload = {
        title: `${name} ${lastName}`,
        start: schedule.start,
        end: schedule.end,
        patient: this.state.currentPatient.id,
        speciality: this.state.speciality.id,
        doctor: this.state.currentDoctor.id,
        observations: this.state.currentSchedule.observations,
      };
      response = await this.save(payload);
      if (response === null) {
        this.notifyQuasar.setType('error');
        this.notifyQuasar.show(undefined, Messages.scheduleExisting);
        return;
      }
      this.state.card = false;
      return;
    }

    if (this.state.currentSchedule.id != undefined) {
      this.state.card = false;
      payload = {
        id: this.state.currentSchedule.id,
        title: `${this.state.currentPatient.name} ${this.state.currentPatient.lastName}`,
        start: this.state.currentSchedule.start,
        end: this.state.currentSchedule.end,
        patient: this.state.currentPatient.id,
        speciality: this.state.speciality.id,
        doctor: this.state.currentDoctor.id,
        observations: this.state.currentSchedule.observations,
      };
      response = await this.update(payload);
    }

    if (response === null) {
      // notification.setMessage(Messages.scheduleExisting);
      // notification.showError();
      return;
    }
    this.state.card = false;
    const apiCalendar = this.state.calendar.getApi();
    apiCalendar.refetchEvents();
  }

  private async save(
    payload: EventSchedule
  ): Promise<EventScheduleResponse | null> {
    const response = await this.service.save(payload);
    const apiCalendar = this.state.calendar.getApi();
    apiCalendar.refetchEvents();
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
    const response = await this.service.update(payload);
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

  public async eventClick(arg: EventClickArg): Promise<void> {
    const schedule = await this.service.getById(parseInt(arg.event.id));
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
    this.state.speciality = schedule.speciality;
    this.state.currentDoctor = schedule.doctor;
    const dateIsValid = validator.dateAndHour(schedule.start);
    this.state.allowToUpdate = true;
    if (dateIsValid == false) {
      this.state.allowToUpdate = false;
      this.state.allowToDelete = false;
      this.state.card = true;
      return;
    }
    const response = await this.repositoryAppointment.getById(schedule.id);
    this.state.allowToDelete = false;
    this.state.card = true;
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
}

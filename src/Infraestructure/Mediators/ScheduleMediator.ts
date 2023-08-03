// import { reactive } from 'vue';
// import { QForm, date } from 'quasar';
import { defineStore } from 'pinia';
import '@fullcalendar/core/vdom';
// import { EventClickArg } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import { CalendarOptions, DateSelectArg } from '@fullcalendar/vue3';
// import listPlugin from '@fullcalendar/list';
// import esLocale from '@fullcalendar/core/locales/es';
// import FullCalendar from '@fullcalendar/vue3';
import { Messages } from 'src/Application/Utilities/Messages';
import { Notification } from 'src/Infraestructure/Utilities/Notifications';
// import { EndPoints } from 'src/Application/Utilities';
// import { EventSchedule, IAppointment, IDoctor } from 'src/Domine/ModelsDB';
import {
  DoctorResponse,
  EventScheduleResponse,
  HealthInsuranceResponse,
  PatientResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';
// import { ScheduleAdapter } from 'src/Adapters';
import {
  Controller,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
import { routerInstance } from 'src/boot/globalRouter';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';
import { IStoreSchedule } from 'src/Domine/IStores';
import { ScheduleService } from 'src/Application/Services/ScheduleService';
import { ModalType } from 'src/Domine/Types';

const START_TIME = '07:00';
const END_TIME = '23:00';
const DURATION_APPOINTMENT = '00:20';
const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

const notification = new Notification();
// const endpoint = EndPoints.getInstance();

// export const useStoreSchedule = defineStore({
//   id: 'storeSchedule',
//   state: (): IStoreSchedule => ({
//     lastConsult: {} as IAppointment,
//     isReadonly: false,
//     card: false,
//     currentAppointment: {} as IAppointment,
//     currentPatient: {
//       insurance: {} as HealthInsuranceResponse,
//     } as PatientResponse,
//     currentSchedule: { observations: '' } as EventSchedule,
//     currentDoctor: null,
//     allDoctors: [],
//     speciality: null,
//     allSpecialities: [],
//     identificationPatient: '',
//     allowToUpdate: true,
//     allowToDelete: false,
//     calendar: {} as InstanceType<typeof FullCalendar>,
//     form: null,
//     calOptions: reactive({
//       plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
//       timeZone: 'local',
//       nowIndicator: true,
//       dayMaxEvents: true,
//       businessHours: {
//         daysOfWeek: [1, 2, 3, 4, 5, 6],
//         startTime: START_TIME,
//         endTime: END_TIME,
//       },
//       slotMinTime: START_TIME,
//       slotMaxTime: END_TIME,
//       slotDuration: DURATION_APPOINTMENT,
//       initialView: 'dayGridMonth',
//       headerToolbar: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'dayGridMonth,timeGridWeek,listWeek,timeGridForYear',
//       },
//       events: {
//         url: process.env.SCHEDULE,
//         method: 'GET',
//         failure: async function () {
//           const notifyQuasar: Notificator =
//             FactoryNotifactors.getInstance().createNotificator('notifyQuasar');
//           notifyQuasar.setType('error');
//           await notifyQuasar.show(undefined, messages.connectionFailure);
//         },
//         success: function (content: Array<unknown>) {
//           const timeStamp = Date.now();
//           content.forEach((element: any) => {
//             const diff = date.getDateDiff(element.start, timeStamp, 'days');
//             element.textColor = 'white';
//             if (diff < 0) {
//               element.color = 'red';
//             }
//             if (diff == 0) {
//               element.color = 'purple';
//             }
//             if (diff > 0) {
//               element.color = 'green';
//             }
//           });
//         },
//         color: '#378006',
//         textColor: 'black',
//       },
//       locale: esLocale,
//       editable: false,
//       selectable: true,
//       weekends: true,
//       select: async (arg: DateSelectArg) => {
//         const service = ScheduleAdapter.getInstance(useStoreSchedule());
//         service.handleDateSelect(arg);
//       },
//       eventClick: async (arg: EventClickArg) => {
//         // const service = new ScheduleService();
//         const service = ScheduleAdapter.getInstance(useStoreSchedule());
//         await service.eventClick(arg);
//         // const adapter = AppointmentAdapter.getInstance(
//         //   useStoreAppointments()
//         // );
//         // const response = await service.getById(parseInt(arg.event.id));
//         // if (response === null) return;
//         // adapter.responseToEntity(response);
//         // routerInstance.push('/appointment');
//       },
//       views: {
//         timeGridForYear: {
//           type: 'dayGridMonth',
//           duration: { years: 1 },
//           buttonText: 'Año',
//         },
//       },
//     }),
//   }),
// });

export class ScheduleMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStoreSchedule;
  private service = new ScheduleService();
  private static instance: ScheduleMediator;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

  private constructor() {
    this.store = this.createStore();
  }
  public static getInstance(): ScheduleMediator {
    if (!ScheduleMediator.instance) {
      ScheduleMediator.instance = new ScheduleMediator();
    }
    return ScheduleMediator.instance;
  }
  public add(controller: Controller): void {
    const isExist = this.controllers.includes(controller);
    if (isExist) {
      return;
    }
    this.controllers.push(controller);
  }
  public getStore(): IStoreSchedule {
    return this.store;
  }

  public notify(data: object, sender: Controller): void {
    for (const controller of this.controllers) {
      if (controller !== sender) {
        controller.receiveData(this);
      }
    }
  }
  public createStore() {
    const store = defineStore({
      id: 'useStoreSchedule',
      state: (): IStoreSchedule => ({
        dateSchedule: '',
        card: false,
      }),
    });
    return store();
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
  public async findByIdentificationPatient(
    identification: string
  ): Promise<EventScheduleResponse | null> {
    const register = await this.service.findByIdentificationPatient(
      identification
    );
    return register;
  }
}

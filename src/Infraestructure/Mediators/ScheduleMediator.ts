import { reactive } from 'vue';
import { date } from 'quasar';
import { StoreGeneric, defineStore } from 'pinia';
import '@fullcalendar/core/vdom';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { DateSelectArg } from '@fullcalendar/vue3';
import FullCalendar from '@fullcalendar/vue3/dist/FullCalendar';
import { Messages } from 'src/Application/Utilities/Messages';

import {
  EventScheduleResponse,
  PathologicalHistoryResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';
import {
  Bloc,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
import { routerInstance } from 'src/boot/globalRouter';
import { IStoreSchedule } from 'src/Domine/IStores';
import {
  FindScheduleByIdentificationPatientUseCase,
  ScheduleService,
} from 'src/Application/Services/ScheduleService';
import { ModalType } from 'src/Domine/Types';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import container from 'src/inversify.config';
import { FORMAT_DATETIME } from 'src/Application/Utilities/Constants';
import { PathologicalHistoryService } from 'src/Application/Services';
import { ScheduleFormBloc } from 'src/Adapters';

const START_TIME = '07:00';
const END_TIME = '23:00';
const DURATION_APPOINTMENT = '00:20';
const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

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

export interface ActionsScheduleMediator {
  getAllSpecialities(): Promise<Array<SpecialityResponse>>;
}
export class ScheduleMediator
  implements IControllersMediator, ActionsScheduleMediator
{
  private controllers: Bloc<unknown>[] = [];
  public store: StoreGeneric;
  private service = new ScheduleService();
  private static instance: ScheduleMediator;
  private factoryNotificator =
    container.get<IFactoryMethodNotifications>('FactoryNotifactors');
  private notifySweetAlert: Notificator;

  private constructor() {
    this.store = this.createStore();
    this.notifySweetAlert = this.factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  public static getInstance(): ScheduleMediator {
    if (!ScheduleMediator.instance) {
      ScheduleMediator.instance = new ScheduleMediator();
    }
    return ScheduleMediator.instance;
  }

  public add(controller: Bloc<any>): void {
    const isExist = this.controllers.includes(controller);
    if (isExist) {
      return;
    }
    this.controllers.push(controller);
    controller.setMediator(this);
  }

  public getStore(): StoreGeneric {
    return this.store;
  }

  public notify(data: object, sender: Bloc<any>): void {
    // for (const controller of this.controllers) {
    //   if (controller !== sender) {
    //     controller.receiveData(this);
    //   }
    // }

    if (sender instanceof ScheduleFormBloc) {
      this.reactToScheduleAdapter(data);
    }
  }

  private reactToScheduleAdapter(data: object) {
    const apiCalendar = this.store.calendar.getApi();
    apiCalendar.refetchEvents();
  }

  public createStore() {
    const store = defineStore({
      id: 'useStoreSchedule',
      state: (): IStoreSchedule => ({
        dateSchedule: '',
        card: false,
        allSpecialities: [],
        calendar: {} as InstanceType<typeof FullCalendar>,
        scheduleId: null,
        calOptions: reactive({
          plugins: [
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ],
          timeZone: 'local',
          nowIndicator: true,
          dayMaxEvents: true,
          businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: START_TIME,
            endTime: END_TIME,
          },
          slotMinTime: START_TIME,
          slotMaxTime: END_TIME,
          slotDuration: DURATION_APPOINTMENT,
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right:
              'timeGridDay,dayGridMonth,listMonth,timeGridWeek,listWeek,timeGridForYear',
          },
          events: {
            url: `${process.env.RCP}${process.env.SCHEDULE}filter/`,
            method: 'GET',
            failure: async () => {
              const statusButton: HTMLInputElement | null =
                document.querySelector('.fc-today-button');
              if (statusButton != null) {
                statusButton.style.background = 'red';
                // statusButton.style.borderRadius = '90%';
                // statusButton.style.height = '20px';
                // statusButton.style.width = '20px';
              }
            },
            success: function (content: Array<unknown>) {
              const timeStamp = Date.now();
              const statusButton: HTMLInputElement | null =
                document.querySelector('.fc-today-button');
              if (statusButton) {
                statusButton.style.background = 'green';
                // statusButton.style.borderRadius = '50%';
                // statusButton.style.height = '20px';
                // statusButton.style.width = '20px';
              }
              content.forEach((element: any) => {
                const diff = date.getDateDiff(element.start, timeStamp, 'days');
                element.textColor = 'white';
                if (diff < 0) {
                  element.color = 'red';
                }
                if (diff == 0) {
                  element.color = 'purple';
                }
                if (diff > 0) {
                  element.color = 'green';
                }
              });
            },
            // color: '#378006',
            // textColor: 'black',
          },
          locale: esLocale,
          editable: false,
          selectable: true,
          weekends: true,
          select: async (arg: DateSelectArg) => {
            // const currentlyStore: IStoreSchedule = mediator.getStore();
            this.store.scheduleId = null;
            this.store.card = true;
            this.store.dateSchedule = date.formatDate(
              arg.start,
              FORMAT_DATETIME
            );
            // const service = ScheduleAdapter.getInstance(useStoreSchedule());
            // service.handleDateSelect(arg);
          },
          eventClick: async (arg: EventClickArg) => {
            this.store.card = true;
            this.store.scheduleId = parseInt(arg.event.id);
            // this.controllers.forEach((element) => {
            //   if (element instanceof ScheduleAdapter) {
            //     element.receiveData(this);
            //   }
            // });
          },
          views: {
            listMonth: { buttonText: 'Full Mes' },
            timeGridForYear: {
              type: 'dayGridMonth',
              duration: { years: 1 },
              buttonText: 'Año',
            },
          },
        }),
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
    const scheduleByIdentificationPatientUseCase =
      new FindScheduleByIdentificationPatientUseCase();
    const register = await scheduleByIdentificationPatientUseCase.execute(
      identification
    );
    return register;
  }

  public async getAllSpecialities() {
    if (this.store.allSpecialities.length == 0) {
      const specialityService =
        container.get<SpecialityService>('SpecialityService');
      this.store.allSpecialities = await specialityService.getAll();
    }
    return this.store.allSpecialities;
  }

  public async getAllPathologies(): Promise<
    Array<PathologicalHistoryResponse>
  > {
    if (this.store.allPathologies.length != 0) {
      return this.store.allPathologies;
    }
    const service = new PathologicalHistoryService();
    const response = await service.getAll();
    this.store.allPathologies = response;
    return response;
  }
}

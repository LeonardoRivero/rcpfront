import { reactive } from 'vue';
import { QForm, date } from 'quasar';
import { defineStore } from 'pinia';
import '@fullcalendar/core/vdom';
import { EventClickArg } from '@fullcalendar/core';
import { routerInstance } from 'src/boot/globalRouter';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/vue3';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/vue3';
import { Messages } from 'src/Application/Utilities/Messages';
import { Notification } from 'src/Infraestructure/Utilities/Notifications';
import { EndPoints } from 'src/Application/Utilities';
import { EventSchedule, IAppointment, IDoctor } from 'src/Domine/ModelsDB';
import {
  DoctorResponse,
  HealthInsuranceResponse,
  PatientResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';
import { AppointmentAdapter, ScheduleAdapter } from 'src/Adapters';
import { useStoreAppointments } from '../Appointment/AppointmentStore';
import { ScheduleService } from 'src/Application/Services/ScheduleService';

export interface IStoreSchedule {
  lastConsult: IAppointment;
  card: boolean;
  currentAppointment: IAppointment;
  currentPatient: PatientResponse;
  currentSchedule: EventSchedule;
  currentDoctor: IDoctor | null;
  allDoctors: Array<DoctorResponse>;
  speciality: SpecialityResponse | null;
  allSpecialities: Array<SpecialityResponse>;
  identificationPatient: string;
  allowToUpdate: boolean;
  allowToDelete: boolean;
  calendar: InstanceType<typeof FullCalendar>;
  form: QForm | null;
  calOptions: CalendarOptions;
  isReadonly: boolean;
}

const START_TIME = '07:00';
const END_TIME = '23:00';
const DURATION_APPOINTMENT = '00:20';
const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

const notification = new Notification();
const messages = Messages.getInstance();
const endpoint = EndPoints.getInstance();

export const useStoreSchedule = defineStore({
  id: 'storeSchedule',
  state: () =>
    ({
      lastConsult: {} as IAppointment,
      isReadonly: false,
      card: false,
      currentAppointment: {} as IAppointment,
      currentPatient: {
        insurance: {} as HealthInsuranceResponse,
      } as PatientResponse,
      currentSchedule: { observations: '' } as EventSchedule,
      currentDoctor: null,
      allDoctors: [],
      speciality: null,
      allSpecialities: [],
      identificationPatient: '',
      allowToUpdate: true,
      allowToDelete: false,
      calendar: {} as InstanceType<typeof FullCalendar>,
      form: null,
      calOptions: reactive({
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
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
          right: 'dayGridMonth,timeGridWeek,listWeek,timeGridForYear',
        },
        events: {
          url: endpoint.getORcreateSchedule,
          method: 'GET',
          failure: function () {
            notification.setMessage(messages.connectionFailure);
            notification.showError();
          },
          success: function (content: Array<unknown>) {
            const timeStamp = Date.now();
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
          color: '#378006',
          textColor: 'black',
        },
        locale: esLocale,
        editable: false,
        selectable: true,
        weekends: true,
        select: async (arg: DateSelectArg) => {
          const service = ScheduleAdapter.getInstance(useStoreSchedule());
          service.handleDateSelect(arg);
        },
        eventClick: async (arg: EventClickArg) => {
          // const service = new ScheduleService();
          const service = ScheduleAdapter.getInstance(useStoreSchedule());
          await service.eventClick(arg);
          // const adapter = AppointmentAdapter.getInstance(
          //   useStoreAppointments()
          // );
          // const response = await service.getById(parseInt(arg.event.id));
          // if (response === null) return;
          // adapter.responseToEntity(response);
          // routerInstance.push('/appointment');
        },
        views: {
          timeGridForYear: {
            type: 'dayGridMonth',
            duration: { years: 1 },
            buttonText: 'Año',
          },
        },
      }),
    } as IStoreSchedule),
});

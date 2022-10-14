import { computed, ref, reactive } from 'vue';
import { QForm, date } from 'quasar';
import { useQuasar, QSpinnerGears } from 'quasar';
import { storeToRefs } from 'pinia';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  CalendarOptions,
  EventApi,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/vue3';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useStoreSchedule } from 'src/stores/storeSchedule';
import { Modal, Notification } from 'src/scripts/Notifications';
import { EndPoints, Messages } from 'src/scripts/Constants';
import { Validators } from 'src/scripts/Helpers';
import { useStorePatients } from 'src/stores/storePatients';
import { IPatientResponse } from 'src/interfaces/IPatients';
import * as Constants from 'src/scripts/Constants';
import {
  EventScheduleRequest,
  EventScheduleResponse,
} from 'src/interfaces/ICommons';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { routerInstance } from 'src/boot/globalRouter';
import modalService from './ModalService';
import { EventChangeArg, EventAddArg, CalendarApi } from '@fullcalendar/core';

const notification = new Notification();
const messages = new Messages();
const endpoint = new EndPoints();
const store = useStoreSchedule();
const storePatients = useStorePatients();
const validator = new Validators();
const serviceModal = modalService();
const storeSchedule = useStoreSchedule();
const message = new Constants.Messages();

export function scheduleService() {
  const {
    lastConsult,
    card,
    currentAppointment,
    currentPatient,
    currentSchedule,
    identificationPatient,
    availableButton,
  } = storeToRefs(store);
  const $q = useQuasar();
  // const id = ref(lastConsult.value.id);
  const id = ref<number>();
  const formSchedule = ref<QForm | null>(null);
  const calendar = ref<CalendarApi>();

  // const identificationPatient = ref<string>('');
  // const timeStamp = Date.now();
  // const formattedDate = ref(
  //   date.formatDate(timeStamp, Constants.FORMAT_DATETIME)
  // );
  //currentAppointment.value.date = formattedDate.value;

  const START_TIME = '07:00';
  const END_TIME = '18:00';
  const DURATION_APPOINTMENT = '00:20';
  const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

  async function getLastIdConsult(): Promise<number | undefined> {
    const response = await store.getLastConsult();
    if (response == undefined) {
      return 0;
    }
    return response.id;
  }
  async function searchPatient(): Promise<void> {
    const response = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );

    if (response.status == HttpStatusCodes.NO_CONTENT) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      storeSchedule.card = false;
      const confirm = await serviceModal.showModal(
        'Atención',
        message.notFoundInfoPatient
      );
      if (confirm == false) {
        return;
      }
      storePatients.currentPatient = {
        identification: parseInt(identificationPatient.value),
      } as IPatientResponse;
      routerInstance.push('/patient');
      return;
    }

    const data = (await response.parsedBody) as IPatientResponse;
    store.currentPatient = data;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formSchedule.value?.validate();
    if (isValid == false) {
      return;
    }

    const responsePatient = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    const patient = (await responsePatient.parsedBody) as IPatientResponse;

    if (patient == null) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      storeSchedule.card = false;
      const confirm = await serviceModal.showModal(
        'Atención',
        message.notFoundInfoPatient
      );

      if (confirm == false) {
        return;
      }
    }

    const dateIsValid = validator.dateGreater(currentSchedule.value.start);
    if (dateIsValid === false) {
      notification.setMessage(messages.dateOrHourNotValid);
      notification.showError();
      return;
    }

    if (patient.id == null || !currentSchedule.value) return;

    let payload = {} as EventScheduleRequest;

    if (currentSchedule.value.id == undefined) {
      const endAppointment = date.addToDate(currentSchedule.value.start, {
        minutes: MINUTES_APPOINTMENT,
      });
      currentSchedule.value.end = date.formatDate(
        endAppointment,
        Constants.FORMAT_DATETIME
      );
      payload = {
        title: `${patient.name} ${patient.lastName}`,
        start: currentSchedule.value.start,
        end: currentSchedule.value.end,
        patient: patient.id,
      };

      const response = await store.createSchedule(payload);

      if (response.status == HttpStatusCodes.BAD_REQUEST) {
        notification.setMessage(messages.scheduleExisting);
        notification.showError();
        return;
      }
      card.value = false;
      routerInstance.push('/appointment');
    }

    let confirmUpdate = false;

    if (currentSchedule.value.id != undefined) {
      card.value = false;
      confirmUpdate = await serviceModal.showModal(
        'Atención',
        messages.updateRegister
      );

      if (confirmUpdate === false) {
        return;
      }
    }
    if (confirmUpdate == true) {
      payload = {
        id: currentSchedule.value.id,
        title: `${patient.name} ${patient.lastName}`,
        start: currentSchedule.value.start,
        end: currentSchedule.value.end,
        patient: patient.id,
      };
    }
    const response = await store.updateSchedule(payload);
    if (response == null) {
      return;
    }
    if (response.status == HttpStatusCodes.BAD_REQUEST) {
      notification.setMessage(messages.scheduleExisting);
      notification.showError();
      return;
    }
    card.value = false;
    routerInstance.push('/appointment');
  }
  async function getScheduleById(scheduleId: number): Promise<void> {
    const response = await store.retrieveScheduleById(scheduleId);
    const data = (await response.parsedBody) as EventScheduleResponse;
    const formattedString = date.formatDate(
      data.start,
      Constants.FORMAT_DATETIME
    );
    currentAppointment.value.date = formattedString;
    currentPatient.value.name = data.patient.name;
    currentPatient.value.lastName = data.patient.lastName;
    identificationPatient.value = data.patient.identification.toString();
  }
  async function handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendar.value = selectInfo.view.calendar;
    calendarApi.unselect();
    currentSchedule.value.id = undefined;
    currentSchedule.value.start = date.formatDate(
      selectInfo.start,
      Constants.FORMAT_DATETIME
    );
    card.value = true;
    calendarApi.refetchEvents();
  }
  async function testChange(selectInfo: EventAddArg) {
    console.log('object', selectInfo);
    const calendarApi = selectInfo.event;
    //calendarApi.refetchEvents();
  }
  const options = reactive({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    timeZone: 'local',
    nowIndicator: true,
    dayMaxEvents: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      startTime: START_TIME,
      endTime: END_TIME,
    },
    slotDuration: DURATION_APPOINTMENT,
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek,timeGridForYear',
    },
    events: {
      //visitar esta url para mas info:https://fullcalendar.io/docs/events-json-feed
      url: endpoint.getORcreateSchedule,
      method: 'GET',
      // extraParams: {
      //   month: 'june',
      //   day: '28',
      // },
      failure: function () {
        notification.setMessage('error al obtener los datos!');
        notification.showError();
      },
      color: 'yellow', // a non-ajax option
      textColor: 'black', // a non-ajax option
    },
    // loading: function (bool: boolean) {
    //   let dialog = Object();
    //   if (bool) {
    //     // notification.setMessage('other bool');
    //     // notification.showError();
    //     visible.value = bool;
    //     const dialog = $q.dialog({
    //       title: 'Cargando. Por favor espere...',
    //       dark: true,
    //       message: '0%',
    //       progress: {
    //         spinner: QSpinnerGears,
    //         color: 'amber',
    //       },
    //       persistent: bool, // we want the user to not be able to close it
    //       ok: true, // we want the user to not be able to close it
    //     });
    //   } else {
    //     // notification.setMessage('bool');
    //     // notification.showError();
    //     visible.value = bool;
    //     dialog.update;
    //   }
    // },
    // events: [
    //   {
    //     title: 'Reunion',
    //     start: '2022-08-12T14:30:00',
    //     extendedProps: {
    //       status: 'done',
    //     },
    //   },
    //   {
    //     title: 'Birthday Party',
    //     start: '2022-08-13T08:10:00',
    //     backgroundColor: 'green',
    //     borderColor: 'green',
    //   },
    //   {
    //     title: 'Birthday Party',
    //     start: '2022-08-13T07:10:00',
    //     backgroundColor: 'green',
    //     borderColor: 'green',
    //   },

    //   {
    //     title: 'Cumpleaños Mamasita Milena',
    //     start: '2022-09-08T07:10:00',
    //     backgroundColor: 'green',
    //     borderColor: 'green',
    //   },
    // ],
    locale: esLocale,
    editable: true,
    selectable: true,
    weekends: true,
    select: handleDateSelect,
    // select: async (arg: any) => {
    //   id.value = await getLastIdConsult();
    //   if (id.value == undefined) {
    //     notification.setMessage('Ocurrio un error al obtener los datos!');
    //     notification.showError();
    //     return;
    //   }
    //   id.value = id.value + 1;
    //   const cal = arg.view.calendar;
    //   cal.unselect();
    //   cal.addEvent({
    //     id: `${id.value}`,
    //     title: 'Nueva Cita',
    //     start: arg.start,
    //     end: arg.end,
    //     allDay: false,
    //   });
    // },
    eventAdd: testChange,
    eventClick: async (arg: any) => {
      console.log(arg);
      console.log(arg.event.startStr);
      console.log(arg.event.id);
      console.log(currentAppointment.value);
      // if (!currentAppointment.value) {
      //   getScheduleById(arg.event.id);
      // }
      // currentAppointment.value.date = date.formatDate(
      //   arg.event.startStr,
      //   Constants.FORMAT_DATETIME
      // );
      //getScheduleById(arg.event.id);

      const response = await store.retrieveScheduleById(arg.event.id);
      const schedule = response.parsedBody as EventScheduleResponse;
      const dateIsValid = validator.dateGreater(schedule.start);
      availableButton.value = true;
      if (dateIsValid == false) {
        availableButton.value = dateIsValid;
      }
      currentPatient.value.name = schedule.patient.name;
      currentPatient.value.lastName = schedule.patient.lastName;
      identificationPatient.value = schedule.patient.identification.toString();
      currentSchedule.value.id = schedule.id;
      currentSchedule.value.start = date.formatDate(
        schedule.start,
        Constants.FORMAT_DATETIME
      );
      currentSchedule.value.end = date.formatDate(
        schedule.end,
        Constants.FORMAT_DATETIME
      );
      card.value = true;
      // const cal = arg.view.calendar;
      // const eventcurrent = cal.getEventById(arg.event.id);
      // console.log(eventcurrent);
      // eventcurrent.remove();
    },
    views: {
      // timelineCustom: {
      //   type: 'timeline',
      //   buttonText: 'Year',
      //   dateIncrement: { years: 1 },
      //   slotDuration: { months: 1 },
      //   visibleRange: function (currentDate: any) {
      //     return {
      //       start: currentDate.clone().startOf('year'),
      //       end: currentDate.clone().endOf('year'),
      //     };
      //   },
      // },
      timeGridForYear: {
        type: 'dayGridMonth',
        duration: { years: 1 },
        buttonText: 'Año',
      },
    },
  }) as CalendarOptions;

  return {
    //! Properties
    lastConsult,
    options,
    card,
    formSchedule,
    calendar,
    currentAppointment,
    currentPatient,
    identificationPatient,
    currentSchedule,
    availableButton,
    //!Metodos
    getLastIdConsult,
    confirmChanges,
    searchPatient,
  };
}

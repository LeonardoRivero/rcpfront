import { ref, reactive } from 'vue';
import '@fullcalendar/core/vdom';
import { EventAddArg, EventApi } from '@fullcalendar/core';
import { QForm, date } from 'quasar';
import { storeToRefs } from 'pinia';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/vue3';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { useStoreSchedule } from 'src/stores/storeSchedule';
import { Modal, Notification } from 'src/scripts/Notifications';
import { EndPoints, Messages } from 'src/scripts/Constants';
import { Validators } from 'src/scripts/Helpers';
import { useStorePatients } from 'src/stores/storePatients';
import { useStoreSettings } from 'src/stores/storeSettings';
import { useStoreAppointment } from 'src/stores/storeAppointment';
import { IPatientResponse } from 'src/interfaces/IPatients';
import * as Constants from 'src/scripts/Constants';
import {
  EventScheduleRequest,
  EventScheduleResponse,
} from 'src/interfaces/ICommons';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { routerInstance } from 'src/boot/globalRouter';
import modalService from './ModalService';

import { HttpResponse } from 'src/scripts/Request';
import { IDoctorResponse, ISpeciality } from 'src/interfaces/IConsults';

const notification = new Notification();
const messages = new Messages();
const endpoint = EndPoints.getInstance();
const store = useStoreSchedule();
const storeAppointment = useStoreAppointment();
const storePatients = useStorePatients();
const storeSettings = useStoreSettings();
const validator = Validators.getInstance();
const serviceModal = modalService();

export function scheduleService() {
  const {
    lastConsult,
    card,
    currentAppointment,
    currentPatient,
    currentSchedule,
    identificationPatient,
    speciality,
    allowToUpdate,
    allowToDelete,
    calendar,
    currentDoctor,
    allDoctors,
  } = storeToRefs(store);

  const formSchedule = ref<QForm | null>(null);
  //const speciality = ref<ISpeciality>();
  const START_TIME = '07:00';
  const END_TIME = '18:00';
  const DURATION_APPOINTMENT = '00:20';
  const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

  async function specialityChanged(val: ISpeciality): Promise<void> {
    speciality.value = val;
  }

  async function getLastIdConsult(): Promise<number | undefined> {
    const response = await store.getLastConsult();
    if (response == undefined) {
      return 0;
    }
    return response.id;
  }
  async function confirmDeleteSchedule(scheduleId: number): Promise<void> {
    store.card = false;
    const confirm = await serviceModal.showModal(
      'Atención',
      messages.deleteRegister,
      'warning'
    );
    if (confirm == false) {
      return;
    }
    const response = await store.deleteSchedule(scheduleId);
    if (response.status == HttpStatusCodes.BAD_REQUEST) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      return;
    }
    const apiCalendar = calendar.value.getApi();
    apiCalendar.refetchEvents();
  }
  async function getAllDoctors() {
    const response = await storeSettings.retrieveAllDoctors();
    allDoctors.value = response.parsedBody as Array<IDoctorResponse>;
  }
  async function searchPatient(): Promise<void> {
    const response = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );

    if (response.status == HttpStatusCodes.NO_CONTENT) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      store.card = false;
      const confirm = await serviceModal.showModal(
        'Atención',
        messages.notFoundInfoPatient
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
  async function confirmChanges(): Promise<boolean> {
    const isValid = await formSchedule.value?.validate();
    if (isValid == false) return false;

    const responsePatient = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    const patient = (await responsePatient.parsedBody) as IPatientResponse;

    if (patient == null) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      store.card = false;
      const confirm = await serviceModal.showModal(
        'Atención',
        messages.notFoundInfoPatient
      );

      if (confirm == false) return false;
    }

    const dateIsValid = validator.dateGreater(currentSchedule.value.start);
    if (dateIsValid === false) {
      notification.setMessage(messages.dateOrHourNotValid);
      notification.showError();
      return false;
    }

    if (
      patient.id == null ||
      !currentSchedule.value ||
      !currentDoctor.value?.id ||
      !speciality.value?.id
    )
      return false;

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
        speciality: speciality.value.id,
        doctor: currentDoctor.value.id,
      };

      const response = await store.createSchedule(payload);
      const apiCalendar = calendar.value.getApi();
      apiCalendar.refetchEvents();

      if (response.status == HttpStatusCodes.BAD_REQUEST) {
        notification.setMessage(messages.scheduleExisting);
        notification.showError();
        return false;
      }
      card.value = false;
      return true;
    }

    let confirmUpdate = false;

    if (currentSchedule.value.id != undefined) {
      card.value = false;
      confirmUpdate = await serviceModal.showModal(
        'Atención',
        messages.updateRegister
      );

      if (confirmUpdate === false) return false;
    }
    if (confirmUpdate == true) {
      payload = {
        id: currentSchedule.value.id,
        title: `${patient.name} ${patient.lastName}`,
        start: currentSchedule.value.start,
        end: currentSchedule.value.end,
        patient: patient.id,
        speciality: speciality.value.id,
        doctor: currentDoctor.value.id,
      };
    }
    const response = await store.updateSchedule(payload);
    if (response == null) return false;

    if (response.status == HttpStatusCodes.BAD_REQUEST) {
      notification.setMessage(messages.scheduleExisting);
      notification.showError();
      return false;
    }
    card.value = false;
    const apiCalendar = calendar.value.getApi();
    apiCalendar.refetchEvents();
    //routerInstance.push('/appointment');
    return true;
  }
  // async function getScheduleById(scheduleId: number): Promise<void> {
  //   const response = await store.retrieveScheduleById(scheduleId);
  //   const data = (await response.parsedBody) as EventScheduleResponse;
  //   const formattedString = date.formatDate(
  //     data.start,
  //     Constants.FORMAT_DATETIME
  //   );
  //   currentAppointment.value.date = formattedString;
  //   currentPatient.value.name = data.patient.name;
  //   currentPatient.value.lastName = data.patient.lastName;
  //   identificationPatient.value = data.patient.identification.toString();
  // }
  async function handleDateSelect(selectInfo: DateSelectArg) {
    //const cal = selectInfo.view.calendar;
    // calendarApi.unselect();
    currentSchedule.value.id = undefined;
    currentSchedule.value.start = date.formatDate(
      selectInfo.start,
      Constants.FORMAT_DATETIME
    );
    card.value = true;
    allowToDelete.value = false;
    allowToUpdate.value = true;
    //cal.refetchEvents();
  }
  async function handleEventSet(evs: EventApi[]) {
    // console.log(evs);
    // evs.forEach((element) => {
    //   element.setProp('color', 'red');
    // });
  }
  async function testChange(selectInfo: EventAddArg) {
    // calendarApi.addEvent({
    //   title: currentPatient.value.name,
    //   start: currentSchedule.value.start,
    //   end: currentSchedule.value.end,
    //   allDay: false,
    // });
    //calendarApi.refetchEvents();
  }
  const calOptions = reactive({
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
        notification.setMessage('error al obtener los datos!');
        notification.showError();
      },
      success: function (content) {
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
      color: '#378006', // a non-ajax option
      textColor: 'black', // a non-ajax option
    },
    eventsSet: handleEventSet,
    dateClick(arg) {
      // card.value = true;
      // currentSchedule.value.id = undefined;
      // currentSchedule.value.start = date.formatDate(
      //   arg.date,
      //   Constants.FORMAT_DATETIME
      // );
      console.log(arg.dayEl.style);
      // arg.dayEl.style.backgroundColor = 'red';
    },
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
      const cal = arg.view.calendar;
      console.log(arg.event.startStr);
      console.log(arg.event.id);
      console.log(currentAppointment.value);
      // cal.addEvent({
      //   id: 0,
      //   title: 'Nueva Cita Editadad',
      //   start: arg.start,
      //   end: arg.end,
      //   allDay: false,
      // });
      let response = {} as HttpResponse<unknown>;
      response = await store.retrieveScheduleById(arg.event.id);
      const schedule = (await response.parsedBody) as EventScheduleResponse;
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        return;
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
      if (schedule.speciality == null) return;
      if (schedule.id == undefined) {
        return;
      }
      speciality.value = schedule.speciality;
      currentDoctor.value = schedule.doctor;
      const dateIsValid = validator.dateGreater(schedule.start);
      allowToUpdate.value = true;
      if (dateIsValid == false) {
        allowToUpdate.value = false;
        allowToDelete.value = false;
        card.value = true;
        return;
      }
      response = await storeAppointment.getAppointmentByScheduleId(schedule.id);
      allowToDelete.value = false;
      card.value = true;
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        allowToDelete.value = true;
        return;
      }
    },
    views: {
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
    calOptions,
    card,
    formSchedule,
    calendar,
    currentAppointment,
    currentPatient,
    currentDoctor,
    allDoctors,
    speciality,
    identificationPatient,
    currentSchedule,
    allowToUpdate,
    allowToDelete,
    //!Metodos
    getLastIdConsult,
    getAllDoctors,
    confirmChanges,
    searchPatient,
    confirmDeleteSchedule,
    handleDateSelect,
    specialityChanged,
  };
}

import { ref, reactive } from 'vue';
import '@fullcalendar/core/vdom';
import { EventAddArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { QForm, date } from 'quasar';
import { defineStore, storeToRefs } from 'pinia';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/vue3';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/vue3';
// import { useStoreSchedule } from 'src/stores/storeSchedule';
import { Modal, Notification } from 'src/scripts/Notifications';
import { EndPoints, Messages } from 'src/scripts/Constants';
import { Validators } from 'src/scripts/Helpers';
// import { useStorePatients } from 'src/stores/storePatients';
// import { useStoreSettings } from 'src/stores/storeSettings';
// import { useStoreAppointment } from 'src/stores/storeAppointment';
import { IPatientResponse } from 'src/models/IPatients';
import * as Constants from 'src/scripts/Constants';
import {
  EventScheduleRequest,
  EventScheduleResponse,
} from 'src/models/ICommons';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { routerInstance } from 'src/boot/globalRouter';
import modalService from './ModalService';

import { HttpResponse } from 'src/scripts/Request';
import {
  IAppointmentRequest,
  IAppointmentResponse,
  IDoctorResponse,
  ISpeciality,
} from 'src/models/IConsults';
import { DoctorRepository } from 'src/patterns/Repository/SettingsRepository';
import { PatientRepository } from 'src/patterns/Repository/PatientRepository';
import { ScheduleRepository } from 'src/patterns/Repository/ScheduleRepository';
import { patientService, useStorePatient } from './PatientService';
import { AppointmentRepository } from 'src/patterns/Repository/AppointmentRepository';

const notification = new Notification();
const messages = Messages.getInstance();
const endpoint = EndPoints.getInstance();
// const store = useStoreSchedule();
// const storeAppointment = useStoreAppointment();

// const storeSettings = useStoreSettings();
const validator = Validators.getInstance();
const serviceModal = modalService();
const doctorRepository = DoctorRepository.getInstance();

interface IStoreSchedule {
  lastConsult: IAppointmentResponse;
  card: boolean;
  currentAppointment: IAppointmentRequest;
  currentPatient: IPatientResponse;
  currentSchedule: EventScheduleResponse;
  currentDoctor: IDoctorResponse | null;
  allDoctors: Array<IDoctorResponse>;
  speciality: ISpeciality | null;
  identificationPatient: string;
  allowToUpdate: boolean;
  allowToDelete: boolean;
  calendar: InstanceType<typeof FullCalendar>;
  form: QForm | null;
  calOptions: CalendarOptions;
}

const START_TIME = '07:00';
const END_TIME = '18:00';
const DURATION_APPOINTMENT = '00:20';
const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

export const useStoreSchedule = defineStore({
  id: 'storeSchedule',
  state: () =>
    ({
      lastConsult: {} as IAppointmentResponse,
      card: false,
      currentAppointment: {} as IAppointmentRequest,
      currentPatient: {} as IPatientResponse,
      currentSchedule: {} as EventScheduleResponse,
      currentDoctor: null,
      allDoctors: [],
      speciality: null,
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
            notification.setMessage('Error al obtener los datos!');
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
        locale: esLocale,
        editable: false,
        selectable: true,
        weekends: true,
        select: async (arg: DateSelectArg) => {
          const service = new ScheduleService();
          service.handleDateSelect(arg);
        },
        eventClick: async (arg: EventClickArg) => {
          const service = new ScheduleService();
          service.eventClick(arg);
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

export class ScheduleService {
  private store = useStoreSchedule();
  private repository = new ScheduleRepository();
  private repositoryPatients = new PatientRepository();
  private repositoryAppointment = new AppointmentRepository();
  private storePatient = useStorePatient();
  private servicePatient = patientService.getInstance();

  public async confirmDeleteSchedule(scheduleId: number): Promise<void> {
    this.store.card = false;
    const confirm = await serviceModal.showModal(
      'Atención',
      messages.deleteRegister,
      'warning'
    );
    if (confirm == false) {
      return;
    }

    const response = await this.repository.delete(scheduleId);
    if (response === false) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      return;
    }

    const apiCalendar = this.store.calendar.getApi();
    apiCalendar.refetchEvents();
  }

  public async getAllDoctors() {
    const response = await doctorRepository.getAll();
    if (response == null) {
      this.store.allDoctors = [];
      return;
    }
    this.store.allDoctors = response;
  }

  public async searchPatient(): Promise<void> {
    const queriesParameters = {
      identification: this.store.identificationPatient,
    };
    const response = await this.repositoryPatients.findByParameters(
      queriesParameters
    );

    if (response !== null) {
      this.store.currentPatient = response;
      return;
    }

    notification.setMessage(messages.notInfoFound);
    notification.showWarning();
    this.store.card = false;

    this.storePatient.currentPatient = {
      identification: parseInt(this.store.identificationPatient),
    } as IPatientResponse;
    await this.servicePatient.patientNotFound();
    return;
  }

  public async confirmChanges(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) return;

    const queriesParameters = {
      identification: this.store.identificationPatient,
    };
    const responsePatient = await this.repositoryPatients.findByParameters(
      queriesParameters
    );

    if (responsePatient === null || responsePatient.id == null) {
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      this.store.card = false;
      await serviceModal.showModal('Atención', messages.notFoundInfoPatient);
      return;
    }

    const dateIsValid = validator.dateGreater(this.store.currentSchedule.start);
    if (dateIsValid === false) {
      notification.setMessage(messages.dateOrHourNotValid);
      notification.showError();
      return;
    }

    if (
      !this.store.currentSchedule ||
      !this.store.currentDoctor?.id ||
      !this.store.speciality?.id
    )
      return;

    let payload = {} as EventScheduleRequest;
    let response = null;
    if (this.store.currentSchedule.id == undefined) {
      const endAppointment = date.addToDate(this.store.currentSchedule.start, {
        minutes: MINUTES_APPOINTMENT,
      });
      this.store.currentSchedule.end = date.formatDate(
        endAppointment,
        Constants.FORMAT_DATETIME
      );
      payload = {
        title: `${responsePatient.name} ${responsePatient.lastName}`,
        start: this.store.currentSchedule.start,
        end: this.store.currentSchedule.end,
        patient: responsePatient.id,
        speciality: this.store.speciality.id,
        doctor: this.store.currentDoctor.id,
      };
      response = await this.save(payload);
      if (response === null) {
        notification.setMessage(messages.scheduleExisting);
        notification.showError();
        return;
      }
      this.store.card = false;
      return;
    }

    if (this.store.currentSchedule.id != undefined) {
      this.store.card = false;
      payload = {
        id: this.store.currentSchedule.id,
        title: `${responsePatient.name} ${responsePatient.lastName}`,
        start: this.store.currentSchedule.start,
        end: this.store.currentSchedule.end,
        patient: responsePatient.id,
        speciality: this.store.speciality.id,
        doctor: this.store.currentDoctor.id,
      };
      response = this.update(payload);
    }

    if (response === null) {
      notification.setMessage(messages.scheduleExisting);
      notification.showError();
      return;
    }

    this.store.card = false;
    const apiCalendar = this.store.calendar.getApi();
    apiCalendar.refetchEvents();
  }

  private async save(
    payload: EventScheduleRequest
  ): Promise<EventScheduleResponse | null> {
    const response = await this.repository.create(payload);
    const apiCalendar = this.store.calendar.getApi();
    apiCalendar.refetchEvents();

    return response;
  }

  private async update(
    payload: EventScheduleRequest
  ): Promise<EventScheduleResponse | null> {
    const confirm = await serviceModal.showModal(
      'Atención',
      messages.updateRegister
    );
    if (confirm == false) return null;
    const response = await this.update(payload);
    return response;
  }

  public async handleDateSelect(selectInfo: DateSelectArg) {
    this.store.currentSchedule.id = undefined;
    this.store.currentSchedule.start = date.formatDate(
      selectInfo.start,
      Constants.FORMAT_DATETIME
    );
    this.store.card = true;
    this.store.allowToDelete = false;
    this.store.allowToUpdate = true;
  }

  public async eventClick(arg: EventClickArg): Promise<void> {
    let schedule = null;
    schedule = await this.repository.getById(parseInt(arg.event.id));
    // const schedule = (await response.parsedBody) as EventScheduleResponse;
    if (schedule === null) {
      return;
    }
    this.store.currentPatient.name = schedule.patient.name;
    this.store.currentPatient.lastName = schedule.patient.lastName;
    this.store.identificationPatient =
      schedule.patient.identification.toString();
    this.store.currentSchedule.id = schedule.id;
    this.store.currentSchedule.start = date.formatDate(
      schedule.start,
      Constants.FORMAT_DATETIME
    );
    this.store.currentSchedule.end = date.formatDate(
      schedule.end,
      Constants.FORMAT_DATETIME
    );
    if (schedule.speciality == null || schedule.id == undefined) return;
    this.store.speciality = schedule.speciality;
    this.store.currentDoctor = schedule.doctor;
    const dateIsValid = validator.dateGreater(schedule.start);
    this.store.allowToUpdate = true;
    if (dateIsValid == false) {
      this.store.allowToUpdate = false;
      this.store.allowToDelete = false;
      this.store.card = true;
      return;
    }
    const response = await this.repositoryAppointment.getById(schedule.id);
    this.store.allowToDelete = false;
    this.store.card = true;
    if (response === null) {
      this.store.allowToDelete = true;
      return;
    }
  }
}

// export function scheduleService() {
//   const {
//     lastConsult,
//     card,
//     currentAppointment,
//     currentPatient,
//     currentSchedule,
//     identificationPatient,
//     speciality,
//     allowToUpdate,
//     allowToDelete,
//     calendar,
//     currentDoctor,
//     allDoctors,
//   } = storeToRefs(store);

//   const formSchedule = ref<QForm | null>(null);
//   const START_TIME = '07:00';
//   const END_TIME = '18:00';
//   const DURATION_APPOINTMENT = '00:20';
//   const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);

//   async function specialityChanged(val: ISpeciality): Promise<void> {
//     speciality.value = val;
//   }

//   async function getLastIdConsult(): Promise<number | undefined> {
//     const response = await store.getLastConsult();
//     if (response == undefined) {
//       return 0;
//     }
//     return response.id;
//   }
//   async function confirmDeleteSchedule(scheduleId: number): Promise<void> {
//     store.card = false;
//     const confirm = await serviceModal.showModal(
//       'Atención',
//       messages.deleteRegister,
//       'warning'
//     );
//     if (confirm == false) {
//       return;
//     }
//     const response = await store.deleteSchedule(scheduleId);
//     if (response.status == HttpStatusCodes.BAD_REQUEST) {
//       notification.setMessage(messages.notInfoFound);
//       notification.showWarning();
//       return;
//     }
//     const apiCalendar = calendar.value.getApi();
//     apiCalendar.refetchEvents();
//   }
//   async function getAllDoctors() {
//     const response = await doctorRepository.getAll();
//     if (response == null) {
//       allDoctors.value = [];
//       return;
//     }
//     allDoctors.value = response;
//   }
//   async function searchPatient(): Promise<void> {
//     const queriesParameters = { identification: identificationPatient.value };
//     const response = await storePatients.findByParameters(queriesParameters);

//     if (response.status == HttpStatusCodes.NO_CONTENT) {
//       notification.setMessage(messages.notInfoFound);
//       notification.showWarning();
//       store.card = false;
//       const confirm = await serviceModal.showModal(
//         'Atención',
//         messages.notFoundInfoPatient
//       );
//       if (confirm == false) {
//         return;
//       }
//       storePatients.currentPatient = {
//         identification: parseInt(identificationPatient.value),
//       } as IPatientResponse;
//       routerInstance.push('/patient');
//       return;
//     }

//     const data = (await response.parsedBody) as IPatientResponse;
//     store.currentPatient = data;
//   }
//   async function confirmChanges(): Promise<boolean> {
//     const isValid = await formSchedule.value?.validate();
//     if (isValid == false) return false;

//     const queriesParameters = { identification: identificationPatient.value };
//     const responsePatient = await storePatients.findByParameters(
//       queriesParameters
//     );
//     const patient = (await responsePatient.parsedBody) as IPatientResponse;

//     if (patient == null) {
//       notification.setMessage(messages.notInfoFound);
//       notification.showWarning();
//       store.card = false;
//       const confirm = await serviceModal.showModal(
//         'Atención',
//         messages.notFoundInfoPatient
//       );

//       if (confirm == false) return false;
//     }

//     const dateIsValid = validator.dateGreater(currentSchedule.value.start);
//     if (dateIsValid === false) {
//       notification.setMessage(messages.dateOrHourNotValid);
//       notification.showError();
//       return false;
//     }

//     if (
//       patient.id == null ||
//       !currentSchedule.value ||
//       !currentDoctor.value?.id ||
//       !speciality.value?.id
//     )
//       return false;

//     let payload = {} as EventScheduleRequest;

//     if (currentSchedule.value.id == undefined) {
//       const endAppointment = date.addToDate(currentSchedule.value.start, {
//         minutes: MINUTES_APPOINTMENT,
//       });
//       currentSchedule.value.end = date.formatDate(
//         endAppointment,
//         Constants.FORMAT_DATETIME
//       );
//       payload = {
//         title: `${patient.name} ${patient.lastName}`,
//         start: currentSchedule.value.start,
//         end: currentSchedule.value.end,
//         patient: patient.id,
//         speciality: speciality.value.id,
//         doctor: currentDoctor.value.id,
//       };

//       const response = await store.createSchedule(payload);
//       const apiCalendar = calendar.value.getApi();
//       apiCalendar.refetchEvents();

//       if (response.status == HttpStatusCodes.BAD_REQUEST) {
//         notification.setMessage(messages.scheduleExisting);
//         notification.showError();
//         return false;
//       }
//       card.value = false;
//       return true;
//     }

//     let confirmUpdate = false;

//     if (currentSchedule.value.id != undefined) {
//       card.value = false;
//       confirmUpdate = await serviceModal.showModal(
//         'Atención',
//         messages.updateRegister
//       );

//       if (confirmUpdate === false) return false;
//     }
//     if (confirmUpdate == true) {
//       payload = {
//         id: currentSchedule.value.id,
//         title: `${patient.name} ${patient.lastName}`,
//         start: currentSchedule.value.start,
//         end: currentSchedule.value.end,
//         patient: patient.id,
//         speciality: speciality.value.id,
//         doctor: currentDoctor.value.id,
//       };
//     }
//     const response = await store.updateSchedule(payload);
//     if (response == null) return false;

//     if (response.status == HttpStatusCodes.BAD_REQUEST) {
//       notification.setMessage(messages.scheduleExisting);
//       notification.showError();
//       return false;
//     }
//     card.value = false;
//     const apiCalendar = calendar.value.getApi();
//     apiCalendar.refetchEvents();
//     //routerInstance.push('/appointment');
//     return true;
//   }
//   // async function getScheduleById(scheduleId: number): Promise<void> {
//   //   const response = await store.retrieveScheduleById(scheduleId);
//   //   const data = (await response.parsedBody) as EventScheduleResponse;
//   //   const formattedString = date.formatDate(
//   //     data.start,
//   //     Constants.FORMAT_DATETIME
//   //   );
//   //   currentAppointment.value.date = formattedString;
//   //   currentPatient.value.name = data.patient.name;
//   //   currentPatient.value.lastName = data.patient.lastName;
//   //   identificationPatient.value = data.patient.identification.toString();
//   // }
//   async function handleDateSelect(selectInfo: DateSelectArg) {
//     //const cal = selectInfo.view.calendar;
//     // calendarApi.unselect();
//     currentSchedule.value.id = undefined;
//     currentSchedule.value.start = date.formatDate(
//       selectInfo.start,
//       Constants.FORMAT_DATETIME
//     );
//     card.value = true;
//     allowToDelete.value = false;
//     allowToUpdate.value = true;
//     //cal.refetchEvents();
//   }
//   async function handleEventSet(evs: EventApi[]) {
//     // console.log(evs);
//     // evs.forEach((element) => {
//     //   element.setProp('color', 'red');
//     // });
//   }
//   async function testChange(selectInfo: EventAddArg) {
//     // calendarApi.addEvent({
//     //   title: currentPatient.value.name,
//     //   start: currentSchedule.value.start,
//     //   end: currentSchedule.value.end,
//     //   allDay: false,
//     // });
//     //calendarApi.refetchEvents();
//   }
//   const calOptions = reactive({
//     plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
//     timeZone: 'local',
//     nowIndicator: true,
//     dayMaxEvents: true,
//     businessHours: {
//       daysOfWeek: [1, 2, 3, 4, 5, 6],
//       startTime: START_TIME,
//       endTime: END_TIME,
//     },
//     slotMinTime: START_TIME,
//     slotMaxTime: END_TIME,
//     slotDuration: DURATION_APPOINTMENT,
//     initialView: 'dayGridMonth',
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'dayGridMonth,timeGridWeek,listWeek,timeGridForYear',
//     },
//     events: {
//       url: endpoint.getORcreateSchedule,
//       method: 'GET',
//       failure: function () {
//         notification.setMessage('error al obtener los datos!');
//         notification.showError();
//       },
//       success: function (content) {
//         const timeStamp = Date.now();
//         content.forEach((element: any) => {
//           const diff = date.getDateDiff(element.start, timeStamp, 'days');
//           element.textColor = 'white';
//           if (diff < 0) {
//             element.color = 'red';
//           }
//           if (diff == 0) {
//             element.color = 'purple';
//           }
//           if (diff > 0) {
//             element.color = 'green';
//           }
//         });
//       },
//       color: '#378006', // a non-ajax option
//       textColor: 'black', // a non-ajax option
//     },
//     eventsSet: handleEventSet,
//     dateClick(arg) {
//       // card.value = true;
//       // currentSchedule.value.id = undefined;
//       // currentSchedule.value.start = date.formatDate(
//       //   arg.date,
//       //   Constants.FORMAT_DATETIME
//       // );
//       console.log(arg.dayEl.style);
//       // arg.dayEl.style.backgroundColor = 'red';
//     },
//     locale: esLocale,
//     editable: false,
//     selectable: true,
//     weekends: true,
//     select: handleDateSelect,
//     // select: async (arg: any) => {
//     //   id.value = await getLastIdConsult();
//     //   if (id.value == undefined) {
//     //     notification.setMessage('Ocurrio un error al obtener los datos!');
//     //     notification.showError();
//     //     return;
//     //   }
//     //   id.value = id.value + 1;
//     //   const cal = arg.view.calendar;
//     //   cal.unselect();
//     //   cal.addEvent({
//     //     id: `${id.value}`,
//     //     title: 'Nueva Cita',
//     //     start: arg.start,
//     //     end: arg.end,
//     //     allDay: false,
//     //   });
//     // },
//     eventAdd: testChange,
//     eventClick: async (arg: any) => {
//       console.log(arg);
//       const cal = arg.view.calendar;
//       console.log(arg.event.startStr);
//       console.log(arg.event.id);
//       console.log(currentAppointment.value);
//       // cal.addEvent({
//       //   id: 0,
//       //   title: 'Nueva Cita Editadad',
//       //   start: arg.start,
//       //   end: arg.end,
//       //   allDay: false,
//       // });
//       let response = {} as HttpResponse<unknown>;
//       response = await store.retrieveScheduleById(arg.event.id);
//       const schedule = (await response.parsedBody) as EventScheduleResponse;
//       if (response.status == HttpStatusCodes.NOT_FOUND) {
//         return;
//       }
//       currentPatient.value.name = schedule.patient.name;
//       currentPatient.value.lastName = schedule.patient.lastName;
//       identificationPatient.value = schedule.patient.identification.toString();
//       currentSchedule.value.id = schedule.id;
//       currentSchedule.value.start = date.formatDate(
//         schedule.start,
//         Constants.FORMAT_DATETIME
//       );
//       currentSchedule.value.end = date.formatDate(
//         schedule.end,
//         Constants.FORMAT_DATETIME
//       );
//       if (schedule.speciality == null || schedule.id == undefined) return;
//       speciality.value = schedule.speciality;
//       currentDoctor.value = schedule.doctor;
//       const dateIsValid = validator.dateGreater(schedule.start);
//       allowToUpdate.value = true;
//       if (dateIsValid == false) {
//         allowToUpdate.value = false;
//         allowToDelete.value = false;
//         card.value = true;
//         return;
//       }
//       response = await storeAppointment.getAppointmentByScheduleId(schedule.id);
//       allowToDelete.value = false;
//       card.value = true;
//       if (response.status == HttpStatusCodes.NOT_FOUND) {
//         allowToDelete.value = true;
//         return;
//       }
//     },
//     views: {
//       timeGridForYear: {
//         type: 'dayGridMonth',
//         duration: { years: 1 },
//         buttonText: 'Año',
//       },
//     },
//   }) as CalendarOptions;

//   return {
//     //! Properties
//     lastConsult,
//     calOptions,
//     card,
//     formSchedule,
//     calendar,
//     currentAppointment,
//     currentPatient,
//     currentDoctor,
//     allDoctors,
//     speciality,
//     identificationPatient,
//     currentSchedule,
//     allowToUpdate,
//     allowToDelete,
//     //!Metodos
//     getLastIdConsult,
//     getAllDoctors,
//     confirmChanges,
//     searchPatient,
//     confirmDeleteSchedule,
//     handleDateSelect,
//     specialityChanged,
//   };
// }

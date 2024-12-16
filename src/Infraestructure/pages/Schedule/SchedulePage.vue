<template>
  <FullCalendar :options="calOptions" ref="calendar"> </FullCalendar>
  <div id="tooltip" class="tooltip"></div>
  <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-dialog v-model="state.card" persistent>
        <q-card class="my-card" bordered>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">
              <q-icon :name="icons.calendarCheckMark" size="24px" /> Agenda de
              Citas
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <ScheduleForm />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
  import '@fullcalendar/core/vdom';
  import FullCalendar from '@fullcalendar/vue3';
  import '@fullcalendar/core/vdom';
  import { StoreGeneric, storeToRefs } from 'pinia';
  import ScheduleForm from './ScheduleForm.vue';
  import {
    DURATION_APPOINTMENT,
    END_TIME,
    IconSVG,
    START_TIME,
  } from 'src/Application/Utilities';
  import { reactive, inject } from 'vue';
  import '@fullcalendar/core/vdom';
  import { EventClickArg, EventHoveringArg } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listPlugin from '@fullcalendar/list';
  import esLocale from '@fullcalendar/core/locales/es';
  import { DateSelectArg } from '@fullcalendar/vue3';
  import { date } from 'quasar';
  import { ScheduleFormBloc } from 'src/Adapters';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';
  import { EventScheduleResponse } from 'src/Domine/Responses';
  import { ENDPOINTS } from 'src/Application/Utilities/EndPoints';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <ScheduleFormBloc>(
    dependenciesLocator.provideScheduleBloc()
  );
  const state = usePlocState(controller);
  const icons = IconSVG;
  // const mediator = ScheduleMediator.getInstance();
  // const store: StoreGeneric = mediator.getStore();

  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  // const { calOptions, calendar } = storeToRefs(store);
  const store = handleGlobalState.store as unknown as StoreGeneric;
  const { calendar } = storeToRefs(store);

  // const calendar = ref<InstanceType<typeof FullCalendar>>();
  const calOptions = reactive({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    timeZone: 'local',
    nowIndicator: true,
    dayMaxEvents: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      startTime: START_TIME,
      endTime: END_TIME,
    },
    slotMinTime: START_TIME,
    slotMaxTime: END_TIME,
    slotDuration: DURATION_APPOINTMENT,
    initialView: 'dayGridMonth',
    // customButtons: {
    //   myCustomButton: {
    //     text: 'custom!',
    //     click: function () {
    //       alert('clicked the custom button!');
    //     },
    //   },
    // },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,dayGridMonth,listMonth,timeGridWeek,listWeek',
    },
    events: {
      url: ENDPOINTS.SCHEDULE.filter,
      method: 'POST',
      extraParams: {
        medicaloffice: handleGlobalState.store.currentMedicalOffice.map(
          (m) => m.id
        ),
      },
      failure: async () => {
        console.log('object');
        const statusButton: HTMLInputElement | null =
          document.querySelector('.fc-today-button');
        if (statusButton != null) {
          statusButton.style.background = 'red';
          // statusButton.style.borderRadius = '90%';
          // statusButton.style.height = '20px';
          // statusButton.style.width = '20px';
        }
      },
      success: function (content: Array<EventScheduleResponse>) {
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
            element.color = 'gray';
          }
          if (diff == 0) {
            element.color = 'red';
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
      // const currentlyStore: IStoreSchedule = mediator.getStore();
      // store.scheduleId = null;
      // store.card = true;
      // store.dateSchedule = date.formatDate(arg.start, FORMAT_DATETIME);

      await controller.handleDateSelect(arg.start);
      // if (calendar.value == undefined) return;
      // calendar.value.getApi().addEvent({
      //   title: 'dynamic event',
      //   start: arg.start,
      //   allDay: true,
      // });
    },
    eventClick: async (arg: EventClickArg) => {
      store.card = true;
      store.scheduleId = parseInt(arg.event.id);

      await controller.showInfoSchedule(arg.event.id);
      // this.controllers.forEach((element) => {
      //   if (element instanceof ScheduleAdapter) {
      //     element.receiveData(this);
      //   }
      // });
    },
    eventMouseEnter: async (info: EventHoveringArg) => {
      var tooltip = document.getElementById('tooltip');
      if (tooltip == null) {
        return;
      }
      tooltip.innerHTML =
        'End: ' +
        info.event.end?.toLocaleString() +
        '<br>Consultorio: ' +
        info.event.extendedProps.medicalOffice +
        '<br>Doctor: ' +
        info.event.extendedProps.doctor +
        '<br>Especialidad: ' +
        info.event.extendedProps.speciality;
      tooltip.style.display = 'block';
      tooltip.style.left = info.jsEvent.pageX + 10 + 'px';
      tooltip.style.top = info.jsEvent.pageY + 10 + 'px';
    },
    eventMouseLeave: () => {
      var tooltip = document.getElementById('tooltip');
      if (tooltip == null) {
        console.log('tooltip');
        return;
      }
      tooltip.style.display = 'none';
    },
    views: {
      listMonth: { buttonText: 'Full Mes' },
      // timeGridForYear: {
      //   type: 'dayGridMonth',
      //   duration: { years: 1 },
      //   buttonText: 'Año',
      // },
    },
  });

  // const calendar = ref<InstanceType<typeof FullCalendar>>();
  // const calOptions = ref({
  //   plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  //   timeZone: 'local',
  //   nowIndicator: true,
  //   dayMaxEvents: true,
  //   businessHours: {
  //     daysOfWeek: [1, 2, 3, 4, 5, 6],
  //     startTime: START_TIME,
  //     endTime: END_TIME,
  //   },
  //   slotMinTime: START_TIME,
  //   slotMaxTime: END_TIME,
  //   slotDuration: DURATION_APPOINTMENT,
  //   initialView: 'dayGridMonth',
  //   headerToolbar: {
  //     left: 'prev,next today',
  //     center: 'title',
  //     right: 'dayGridMonth,timeGridDay,timeGridWeek,listWeek,timeGridForYear',
  //   },
  //   events: {
  //     url: `${process.env.RCP}${process.env.SCHEDULE}`,
  //     method: 'GET',
  //     failure: async function () {
  //       const notifyQuasar: Notificator =
  //         FactoryNotifactors.getInstance().createNotificator(
  //           ModalType.NotifyQuasar
  //         );
  //       notifyQuasar.setType('error');
  //       await notifyQuasar.show(undefined, Messages.connectionFailure);
  //     },
  //     success: function (content: Array<unknown>) {
  //       const timeStamp = Date.now();
  //       content.forEach((element: any) => {
  //         const diff = date.getDateDiff(element.start, timeStamp, 'days');
  //         element.textColor = 'white';
  //         if (diff < 0) {
  //           element.color = 'red';
  //         }
  //         if (diff == 0) {
  //           element.color = 'purple';
  //         }
  //         if (diff > 0) {
  //           element.color = 'green';
  //         }
  //       });
  //     },
  //     color: '#378006',
  //     textColor: 'black',
  //   },
  //   locale: esLocale,
  //   editable: false,
  //   selectable: true,
  //   weekends: true,
  //   select: async (arg: DateSelectArg) => {
  //     const currentlyStore = mediator.getStore();
  //     currentlyStore.card = true;
  //     currentlyStore.dateSchedule = date.formatDate(
  //       arg.start,
  //       FORMAT_DATETIME
  //     );
  //     // const service = ScheduleAdapter.getInstance(useStoreSchedule());
  //     // service.handleDateSelect(arg);
  //   },
  //   eventClick: async (arg: EventClickArg) => {
  //     // const service = ScheduleAdapter.getInstance(useStoreSchedule());
  //     // await service.eventClick(arg);
  //   },
  //   views: {
  //     timeGridForYear: {
  //       type: 'dayGridMonth',
  //       duration: { years: 1 },
  //       buttonText: 'Año',
  //     },
  //   },
  // });
</script>
<style>
  .tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 4px;
    display: none;
    z-index: 1000;
    font-size: 12px;
    max-width: 200px;
  }
</style>

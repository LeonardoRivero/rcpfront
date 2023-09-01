<template>
  <FullCalendar :options="calOptions" ref="calendar" />
  <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-dialog v-model="store.card" persistent>
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
<script lang="ts">
import { defineComponent } from 'vue';
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import '@fullcalendar/core/vdom';
import { ScheduleMediator } from '../../Mediators/ScheduleMediator';
import { StoreGeneric, storeToRefs } from 'pinia';
import { IconSVG } from 'src/Application/Utilities/Constants';
import ScheduleForm from './ScheduleForm.vue';

export default defineComponent({
  components: { FullCalendar, ScheduleForm },

  setup() {
    const mediator = ScheduleMediator.getInstance();
    const store: StoreGeneric = mediator.getStore();
    const { calOptions, calendar } = storeToRefs(store);
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
    return {
      calOptions,
      store,
      calendar,
      icons: IconSVG,
    };
  },
});
</script>

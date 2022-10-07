<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-lg-12 col-12 col-md-12">
      <FullCalendar :options="options" />
      <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-dialog v-model="card" persistent>
            <q-card class="my-card" bordered>
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Agendar Cita</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-separator inset></q-separator>
              <q-card-section>
                <!-- <Appointment /> -->
                <ScheduleForm />
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </div>
  <!-- <q-inner-loading
      :showing="visible"
      label="Por favor espere..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    /> -->
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';

import { useQuasar, QSpinnerGears } from 'quasar';
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Notification } from 'src/scripts/Notifications';
import { EndPoints } from 'src/scripts/Constants';
import { scheduleService } from 'src/services/ScheduleService';
import Appointment from 'src/components/Forms/AppointmentForm.vue';
import ScheduleForm from 'src/components/Forms/ScheduleForm.vue';

const endpoint = new EndPoints();
const notification = new Notification();
export default defineComponent({
  components: { FullCalendar, ScheduleForm },

  setup() {
    const { getLastIdConsult, lastConsult, options, card } = scheduleService();

    onMounted(async () => {
      getLastIdConsult();
    });
    // const $q = useQuasar();
    // // const id = ref(lastConsult.value.id);
    // const id = ref(10);
    // let card = ref(false);
    // let visible = ref(false);
    // const options = reactive({
    //   plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    //   timeZone: 'local',
    //   nowIndicator: true,
    //   dayMaxEvents: true,
    //   businessHours: {
    //     daysOfWeek: [1, 2, 3, 4, 5, 6],
    //     startTime: '07:00',
    //     endTime: '18:00',
    //   },
    //   slotDuration: '00:20',
    //   initialView: 'dayGridMonth',
    //   headerToolbar: {
    //     left: 'prev,next today',
    //     center: 'title',
    //     right: 'dayGridMonth,timeGridWeek,listWeek,timeGridForYear',
    //   },
    //   events: {
    //     //visitar esta url para mas info:https://fullcalendar.io/docs/events-json-feed
    //     url: endpoint.getORcreateConsult,
    //     method: 'GET',
    //     // extraParams: {
    //     //   month: 'june',
    //     //   day: '28',
    //     // },
    //     failure: function () {
    //       notification.setMessage('error al obtener los datos!');
    //       notification.showError();
    //     },
    //     color: 'yellow', // a non-ajax option
    //     textColor: 'black', // a non-ajax option
    //   },
    //   // loading: function (bool: boolean) {
    //   //   let dialog = Object();
    //   //   if (bool) {
    //   //     // notification.setMessage('other bool');
    //   //     // notification.showError();
    //   //     visible.value = bool;
    //   //     const dialog = $q.dialog({
    //   //       title: 'Cargando. Por favor espere...',
    //   //       dark: true,
    //   //       message: '0%',
    //   //       progress: {
    //   //         spinner: QSpinnerGears,
    //   //         color: 'amber',
    //   //       },
    //   //       persistent: bool, // we want the user to not be able to close it
    //   //       ok: true, // we want the user to not be able to close it
    //   //     });
    //   //   } else {
    //   //     // notification.setMessage('bool');
    //   //     // notification.showError();
    //   //     visible.value = bool;
    //   //     dialog.update;
    //   //   }
    //   // },
    //   // events: [
    //   //   {
    //   //     title: 'Reunion',
    //   //     start: '2022-08-12T14:30:00',
    //   //     extendedProps: {
    //   //       status: 'done',
    //   //     },
    //   //   },
    //   //   {
    //   //     title: 'Birthday Party',
    //   //     start: '2022-08-13T08:10:00',
    //   //     backgroundColor: 'green',
    //   //     borderColor: 'green',
    //   //   },
    //   //   {
    //   //     title: 'Birthday Party',
    //   //     start: '2022-08-13T07:10:00',
    //   //     backgroundColor: 'green',
    //   //     borderColor: 'green',
    //   //   },

    //   //   {
    //   //     title: 'Cumpleaños Mamasita Milena',
    //   //     start: '2022-09-08T07:10:00',
    //   //     backgroundColor: 'green',
    //   //     borderColor: 'green',
    //   //   },
    //   // ],
    //   locale: esLocale,
    //   editable: true,
    //   selectable: true,
    //   weekends: true,
    //   select: async (arg: any) => {
    //     // let id = await getLastIdConsult();
    //     if (id.value == undefined) {
    //       notification.setMessage('Ocurrio un error al obtener los datos!');
    //       notification.showError();
    //       return;
    //     }
    //     id.value = id.value + 1;
    //     const cal = arg.view.calendar;
    //     cal.unselect();
    //     cal.addEvent({
    //       id: `${id.value}`,
    //       title: 'Nueva Cita',
    //       start: arg.start,
    //       end: arg.end,
    //       allDay: false,
    //     });
    //   },
    //   eventClick: (arg: any) => {
    //     console.log(arg);
    //     console.log(arg.event.startStr);
    //     console.log(arg.event.id);

    //     card.value = true;

    //     // const cal = arg.view.calendar;
    //     // const eventcurrent = cal.getEventById(11);
    //     // console.log(eventcurrent);
    //     // eventcurrent.remove();
    //   },
    //   views: {
    //     // timelineCustom: {
    //     //   type: 'timeline',
    //     //   buttonText: 'Year',
    //     //   dateIncrement: { years: 1 },
    //     //   slotDuration: { months: 1 },
    //     //   visibleRange: function (currentDate: any) {
    //     //     return {
    //     //       start: currentDate.clone().startOf('year'),
    //     //       end: currentDate.clone().endOf('year'),
    //     //     };
    //     //   },
    //     // },
    //     timeGridForYear: {
    //       type: 'dayGridMonth',
    //       duration: { years: 1 },
    //       buttonText: 'Año',
    //     },
    //   },
    // });

    return {
      options,
      card,
      // visible,
    };
  },
});
</script>

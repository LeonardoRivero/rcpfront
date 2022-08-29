<template>
  <div>
    <FullCalendar :options="options" />
    <q-dialog v-model="card">
      <q-card class="my-card">
        <q-img
          src="https://t3.ftcdn.net/jpg/02/44/58/20/360_F_244582094_BTflxzaxlNDHk250JiOaPwAeC4487ns8.jpg"
        />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">FOSCAL</div>
            <div
              class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
            >
              <q-icon name="place" />
              250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">$・Italian, Cafe</div>
          <div class="text-caption text-grey">
            Small plates, salads & sandwiches in an intimate setting.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Reserve" />
          <q-btn v-close-popup flat color="primary" round icon="event" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
export default defineComponent({
  components: { FullCalendar },

  setup() {
    const id = ref(10);
    let card = ref(false);
    let stars = ref(3);
    const options = reactive({
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      timeZone: 'UTC',
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,listDay,resourceTimelineYear',
      },
      events: [
        {
          title: 'Reunion',
          start: '2022-08-12T14:30:00',
          extendedProps: {
            status: 'done',
          },
        },
        {
          title: 'Birthday Party',
          start: '2022-08-13T08:10:00',
          backgroundColor: 'green',
          borderColor: 'green',
        },
        {
          title: 'Birthday Party',
          start: '2022-08-13T07:10:00',
          backgroundColor: 'green',
          borderColor: 'green',
        },

        {
          title: 'Cumpleaños Mamasita Milena',
          start: '2022-09-08T07:10:00',
          backgroundColor: 'green',
          borderColor: 'green',
        },
      ],
      locale: esLocale,
      editable: true,
      selectable: true,
      weekends: true,
      select: (arg: any) => {
        id.value = id.value + 1;
        const cal = arg.view.calendar;
        cal.unselect();
        cal.addEvent({
          id: `${id.value}`,
          title: `New Event ${id.value}`,
          start: arg.start,
          end: arg.end,
          allDay: true,
        });
      },
      eventClick: (arg: any) => {
        console.log(arg.event.title);
        card.value = true;
      },
      views: {
        timelineCustom: {
          type: 'timeline',
          buttonText: 'Year',
          dateIncrement: { years: 1 },
          slotDuration: { months: 1 },
          visibleRange: function (currentDate: any) {
            return {
              start: currentDate.clone().startOf('year'),
              end: currentDate.clone().endOf('year'),
            };
          },
        },
      },
    });

    return {
      options,
      card,
      stars,
    };
  },
});
</script>

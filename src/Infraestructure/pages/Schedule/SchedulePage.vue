<template>
  <FullCalendar :options="calOptions" ref="calendar" />
  <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-dialog v-model="card" persistent>
        <q-card class="my-card" bordered>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Agenda de Citas</div>
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
import { storeToRefs } from 'pinia';
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';

import ScheduleForm from './ScheduleForm.vue';
import { useStoreSchedule } from 'src/Infraestructure/stores/SchedulePage/ScheduleStore';

export default defineComponent({
  components: { FullCalendar, ScheduleForm },

  setup() {
    const storeSchedule = useStoreSchedule();
    const { calOptions, card, calendar } = storeToRefs(storeSchedule);
    return {
      calOptions,
      card,
      calendar,
    };
  },
});
</script>

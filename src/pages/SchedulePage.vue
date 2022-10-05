<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-12 col-md">
      <Schedule />
      <!-- <ConsultForm /> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Schedule from 'src/components/ScheduleAppointment.vue';
import ConsultForm from 'src/components/Forms/ConsultForm.vue';
import { appointmentService } from 'src/services/AppointmentService';
export default defineComponent({
  components: { Schedule },
  setup() {
    const { cardIsExpandible } = appointmentService();
    test: ref(false);
    onMounted(async () => {
      console.log('first');
      await cardIsExpandible(true);
    });
  },
});
</script>

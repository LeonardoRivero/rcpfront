<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-12 col-md">
      <Schedule />
      <ConsultForm />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Schedule from 'src/components/ScheduleAppointment.vue';
import ConsultForm from 'src/components/Forms/ConsultForm.vue';
export default defineComponent({
  components: { Schedule, ConsultForm },
  setup() {
    test: ref(false);
  },
});
</script>

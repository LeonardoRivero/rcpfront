<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-12 col-md">
      <!-- <ConsultForm /> -->
      <Test />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue';
import ConsultForm from 'src/components/Forms/ConsultForm.vue';
import Test from 'src/components/Forms/AppointmentForm.vue';
import { appointmentService } from 'src/services/AppointmentService';

export default defineComponent({
  components: { Test },
  setup() {
    const { cardIsExpandible } = appointmentService();
    test: ref(false);
    onMounted(async () => {
      await cardIsExpandible(false);
    });
  },
});
</script>

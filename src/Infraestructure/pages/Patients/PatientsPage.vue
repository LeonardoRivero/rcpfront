<template>
  <q-page>
    <Patients />
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Patients from './PatientForm.vue';

export default defineComponent({
  components: { Patients },
  setup() {
    const step = ref<number>(1);

    return {
      step,
    };
  },
});
</script>

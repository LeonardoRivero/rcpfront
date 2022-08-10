<template>
  <Patients />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Patients from 'src/components/Forms/PatientForm.vue';

export default defineComponent({
  components: { Patients },
  setup() {
    test: ref(false);
  },
});
</script>

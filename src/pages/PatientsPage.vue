<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-7">
      <Patients />
    </div>
    <div class="col-5">Algo mas</div>
  </div>
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

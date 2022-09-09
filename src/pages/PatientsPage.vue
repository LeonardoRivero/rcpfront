<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-12 col-md">
      <Patients />
    </div>
    <!-- <div class="col-12 col-md">Algo mas</div> -->
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

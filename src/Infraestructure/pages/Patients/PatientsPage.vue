<template>
  <div class="row q-col-gutter-x-md">
    <div>
      <!-- <Login /> -->
      <Patients />
    </div>
    <!-- <div class="col-12 col-md"><DataTable /></div> -->
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Patients from './PatientForm.vue';
// import DataTable from 'src/components/commons/DataTable.vue';
export default defineComponent({
  components: { Patients },
});
</script>

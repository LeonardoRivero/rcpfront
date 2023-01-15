<template>
  <q-page>
    <div class="row q-col-gutter-x-md">
      <div class="col-12 col-md">
        <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
          <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <q-card class="my-card" bordered>
              <q-card-section>
                <div class="text-h6">Registrar o Actualizar Cita</div>
              </q-card-section>
              <q-separator inset></q-separator>
              <q-card-section>
                <AppointmentForm />
              </q-card-section>
            </q-card>
          </div>
          <!-- <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
            <q-card class="my-card" bordered>
              <DataTable />
            </q-card>
          </div> -->
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import AppointmentForm from './AppointmentForm.vue';
// import DataTable from 'src/components/commons/DataTable.vue';
import 'src/css/app.sass';
export default defineComponent({
  components: { AppointmentForm },
});
</script>

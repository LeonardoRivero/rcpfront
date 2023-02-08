<template>
  <q-card class="rounded-borders">
    <q-toolbar class="rounded-borders">
      <h5 class="text-h5 q-ma-md">Datos Paciente:</h5>
      <q-space />
      <q-input
        dense
        outlined
        input-class="text-right"
        class="q-ml-md"
        v-model="identificationPatient"
        @keydown.enter.prevent="searchPatient()"
        label="N° Identificacion"
        type="number"
      >
        <template v-slot:append>
          <q-btn
            flat
            round
            dense
            icon="search"
            class="q-mr-xs"
            @click="searchPatient()"
          />
          <q-tooltip transition-show="scale" transition-hide="scale">
            Verificar Paciente
          </q-tooltip>
        </template>
      </q-input>
    </q-toolbar>
    <q-separator inset></q-separator>
    <q-card-section>
      <!-- <q-avatar :icon="iconAvatar" color="white" size="4rem"></q-avatar> -->
      <div class="row">
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Nombre Completo:</b>
          <div class="text-h6 q-mb-xs">
            {{ currentPatient.name }}
            {{ currentPatient.lastName }}
          </div>
          <q-separator />
          <b>Telefono/Celular:</b>
          <div>
            {{ currentPatient.phoneNumber }}
          </div>
          <q-separator />
          <b>Correo Electronico:</b>
          <div>
            {{ currentPatient.email }}
          </div>
        </q-card-section>
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Fecha Nacimiento:</b>
          <div v-if="age != 0">
            {{ currentPatient.dateBirth }} <cite>({{ age }} años)</cite>
          </div>
          <q-separator />
          <b>Entidad :</b>
          <div v-if="currentPatient.insurance != null">
            {{ currentPatient.insurance.nameInsurance }}
          </div>
          <q-separator />
          <b>Fecha Primera Consulta:</b>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AppointmentAdapter, PatientAdapter } from 'src/Adapters';
import { useStorePatient } from '../../stores/PatientsPage/PatientStore';
import { PatientResponse } from 'src/Domine/Responses';
import { useStoreAppointments } from 'src/Infraestructure/stores/Appointment/AppointmentStore';

export default defineComponent({
  name: 'InfoPatient',
  setup() {
    // const { identificationPatient, currentPatient, iconAvatar, age } =
    //   clinicHistoryService();
    const identificationPatient = ref('');
    const iconAvatar = ref<string>('');
    const age = ref<number>(0);
    const currentPatient = ref<PatientResponse>({} as PatientResponse);

    const patientAdapter = PatientAdapter.getInstance(useStorePatient());
    const appointmentAdapter = AppointmentAdapter.getInstance(
      useStoreAppointments()
    );
    // const infoPatientController=new InfoPatientController()
    // const stateII=infoPatientController.getState()
    return {
      async searchPatient() {
        const patient = await patientAdapter.searchByIdentificacion(
          identificationPatient.value
        );
        if (patient == null || patient.id == undefined) return;
        const response = await appointmentAdapter.searchByPatientId(patient.id);
        // stateII.currentPatient=patient
      },
      identificationPatient,
      currentPatient,
      iconAvatar,
      age,
    };
  },
});
</script>

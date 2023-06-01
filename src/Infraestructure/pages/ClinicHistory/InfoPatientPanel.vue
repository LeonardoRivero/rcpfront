<template>
  <q-card class="rounded-borders">
    <q-toolbar class="rounded-borders">
      <h5 class="text-h6 q-ma-md">
        Datos Paciente:
        <q-avatar :icon="state.iconAvatar" color="white" size="2rem"></q-avatar>
      </h5>
      <q-space />
      <q-input
        dense
        outlined
        input-class="text-right"
        class="q-ml-md"
        v-model="state.identificationPatient"
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
    <q-card-section class="q-pt-xs">
      <div class="row">
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Nombre Completo:</b>
          <div class="text-h6 q-mb-xs">
            {{ state.currentPatient.name }}
            {{ state.currentPatient.lastName }}
          </div>
          <q-separator />
          <b>Telefono/Celular:</b>
          <div>
            {{ state.currentPatient.phoneNumber }}
          </div>
          <q-separator />
          <b>Correo Electronico:</b>
          <div>
            {{ state.currentPatient.email }}
          </div>
        </q-card-section>
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Fecha Nacimiento:</b>
          <div v-if="state.age != 0">
            {{ state.currentPatient.dateBirth }}
            <cite>({{ state.age }} años)</cite>
          </div>
          <q-separator />
          <b>Entidad :</b>
          <div v-if="state.currentPatient.insurance != null">
            {{ state.currentPatient.insurance.nameInsurance }}
          </div>
          <q-separator />
          <b>Fecha Primera Consulta:</b>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { AppointmentAdapter, InfoPatientPanelController } from 'src/Adapters';
import { Validators } from 'src/Application/Utilities';
import { useStoreAppointments } from '../../Mediators/Appointment/AppointmentStore';
import { ClinicHistoryMediator, PatientMediator } from '../../Mediators';
import { PatientResponse } from 'src/Domine/Responses';
import { InfoPatientState } from 'src/Domine/IStates';
import { ScheduleService } from 'src/Application/Services/ScheduleService';
import { ScheduleMediator } from '../../Mediators/ScheduleMediator';

export default defineComponent({
  name: 'InfoPatientPanel',
  setup() {
    const patientMediator = PatientMediator.getInstance();
    const scheduleService = new ScheduleService();
    const scheduleMediator = ScheduleMediator.getInstance();
    const appointmentAdapter = AppointmentAdapter.getInstance(
      useStoreAppointments()
    );
    const state: InfoPatientState = reactive({
      identificationPatient: '',
      age: 0,
      currentPatient: {} as PatientResponse,
      iconAvatar: '',
    });
    const controller = InfoPatientPanelController.getInstance(state);
    const validator = Validators.getInstance();
    const clinicHistoryMediator = ClinicHistoryMediator.getInstance();
    clinicHistoryMediator.add(controller);

    return {
      async searchPatient() {
        const patient = await patientMediator.searchByIdentificacion(
          state.identificationPatient
        );
        if (patient === null) {
          controller.clear();
          await patientMediator.patientNotFound();
          return;
        }

        state.currentPatient = patient;
        // store.currentPatient.value = patient;
        state.age = validator.calculateAge(
          state.currentPatient.dateBirth.toString()
        );
        const dateBirth = new Date(
          state.currentPatient.dateBirth.toLocaleString()
        );
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        } as const;
        state.currentPatient.dateBirth = dateBirth.toLocaleDateString(
          'es-Es',
          options
        );
        controller.getGender(patient);
        const schedule = await scheduleService.findByIdentificationPatient(
          patient.identification.toString()
        );
        let store = clinicHistoryMediator.getStore();
        store.currentSchedule = schedule;
        clinicHistoryMediator.notify(store, controller);
        if (schedule === null) {
          await scheduleMediator.scheduleNotFound();
          return;
        }

        const appointment = await appointmentAdapter.getById(schedule.id);
        if (appointment == null) {
          await appointmentAdapter.appointmentNotFound();
          return;
        }
        // store.currentAppointment.value = appointment;
        // store.speciality.value = schedule.speciality;
        controller.sendData(state);
      },
      state,
    };
  },
});
</script>

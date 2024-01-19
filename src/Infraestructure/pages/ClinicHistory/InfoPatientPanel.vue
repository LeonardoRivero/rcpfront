<template>
  <q-card class="rounded-borders">
    <q-toolbar class="rounded-borders">
      <h5 class="text-h5 q-ma-none" v-if="!$q.screen.xs">Datos Paciente:</h5>
      <q-icon :name="state.iconAvatar" color="white" size="40px"></q-icon>
      <q-space />
      <q-input
        dense
        outlined
        input-class="text-right"
        class="q-ml-md"
        v-model="state.identificationPatient"
        @keydown.enter.prevent="patientHasAppointment()"
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
            @click="patientHasAppointment()"
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
            {{ state.currentPatient?.name }}
            {{ state.currentPatient?.lastName }}
          </div>
          <q-separator />
          <b>Telefono/Celular:</b>
          <div>
            {{ state.currentPatient?.phoneNumber }}
          </div>
          <q-separator />
          <b>Correo Electronico:</b>
          <div>
            {{ state.currentPatient?.email }}
          </div>
        </q-card-section>
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Fecha Nacimiento:</b>
          <div>
            {{ state.currentPatient?.dateBirth }}
            <cite v-if="state.age !== 0"
              >({{ state.age }} {{ state.labelAge }})</cite
            >
          </div>
          <q-separator />
          <b>Entidad :</b>
          <div v-if="state.currentPatient?.insurance != null">
            {{ state.currentPatient.insurance.nameInsurance }}
          </div>
          <q-separator />
          <b>Fecha Primera Consulta:</b>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { InforPatientPanelBloc } from 'src/Adapters';
import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators';
const controller = inject<InforPatientPanelBloc>(
  'infoPatientPanelBloc'
) as InforPatientPanelBloc;

const state = usePlocState(controller);
const mediator = new ClinicHistoryMediator();
mediator.add(controller);
async function patientHasAppointment() {
  await controller.patientHasAppointment();
}
</script>

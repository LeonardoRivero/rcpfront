<template>
  <div class="text-h6 text-grey">
    Social
    <q-separator inset />
  </div>
  <div class="row">
    <q-toggle
      v-model="state.alcohol"
      checked-icon="check"
      color="red"
      label="Alcohol"
      unchecked-icon="clear"
      left-label
      class="col-shrink"
      style="overflow: auto; width: 18dvh"
    />

    <q-input
      dense
      v-model="state.alcoholObservations"
      autogrow
      class="col-grow"
      style="overflow: auto"
    />
  </div>
  <div class="row">
    <q-toggle
      v-model="state.smoke"
      checked-icon="check"
      color="red"
      label="Cigarrillo"
      unchecked-icon="clear"
      left-label
      class="col-shrink"
      style="overflow: auto; width: 18dvh"
    />

    <q-input
      dense
      v-model="state.smokeObservations"
      autogrow
      class="col-grow"
      style="overflow: auto"
    />
  </div>
  <div class="row">
    <q-toggle
      v-model="state.drugs"
      checked-icon="check"
      color="red"
      label="Drogas"
      unchecked-icon="clear"
      left-label
      class="col-shrink"
      style="overflow: auto; width: 18dvh"
    />
    <q-input
      dense
      v-model="state.drugsObservations"
      autogrow
      class="col-grow"
      style="overflow: auto"
    />
  </div>
  <br />
  <div class="text-h6 text-grey">
    Alergias
    <q-separator inset />
  </div>
  <div class="row">
    <q-select
      option-value="id"
      option-label="description"
      map-options
      dense
      v-model="state.allergie"
      :options="state.allAllergies"
      label="Alergias *"
      class="col-shrink"
      style="overflow: auto; width: 25dvh"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> Sin resultados </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      dense
      v-model="state.allergen"
      class="col-grow"
      style="overflow: auto; margin-left: 15px"
      placeholder="Alergeno"
    />
  </div>
  <br />
  <div class="text-h6 text-grey">
    Tratamiento/Medicamentos
    <q-separator inset />
  </div>
  <div class="row">
    <q-checkbox
      v-model="state.patientHasTreatment"
      class="col-shrink"
      style="overflow: auto; width: 18dvh"
    />
    <q-input
      dense
      v-model="state.treatmentMedical"
      class="col-grow"
      style="overflow: auto"
      placeholder="Nombre Medicamento o descripcion tratamiento"
      :disable="!state.patientHasTreatment"
    />
  </div>
</template>

<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { AppointmentBloc } from 'src/Adapters';
  import { isNotNull, required } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import 'src/css/app.sass';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';

  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <AppointmentBloc>(
    dependenciesLocator.provideAppointmentBloc()
  );
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );

  onMounted(async () => {
    console.log('mounted Patients');
    await controller.loadInitialData(handleGlobalState);
  });

  const state = usePlocState(controller);
</script>

<template>
  <!-- <div class="text-h6 text-grey">
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
        <br /> -->
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
      label=" Tipo Alergia *"
      class="col-shrink"
      style="width: 35dvh"
      @update:model-value="(val) => allergieChanged(val)"
      :rules="[isNotNull]"
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
      style="margin-left: 15px"
      placeholder="Alergeno"
      :disable="!state.patientHasAllergie"
      :rules="state.patientHasAllergie ? [required, isNotNull] : []"
    />
  </div>
  <br /><br />
  <div class="text-h6 text-grey">
    Tratamiento / Medicamentos
    <q-separator inset />
  </div>
  <div class="row">
    <q-checkbox
      v-model="state.patientHasTreatment"
      class="col-shrink"
      style="overflow: auto; width: 18dvh"
      @update:model-value="handleCheckboxTreatment"
    />
    <q-input
      dense
      v-model="state.treatmentMedical"
      class="col-grow"
      style="overflow: auto"
      placeholder="Nombre Medicamento o descripcion tratamiento"
      :disable="!state.patientHasTreatment"
      :rules="state.patientHasTreatment ? [required, isNotNull] : []"
    />
  </div>
  <br /><br />
  <div class="text-h6 text-grey">
    Familiar
    <q-separator inset />
  </div>
  <div class="row">
    <q-checkbox
      v-model="state.patientWithFamilyHistory"
      class="col-shrink"
      style="overflow: auto; width: 18dvh"
      @update:model-value="handleCheckboxFamilyHistory"
    />
    <q-select
      option-value="id"
      option-label="description"
      map-options
      dense
      v-model="state.kinship"
      :options="state.allKinship"
      label="Parentesco *"
      class="col-shrink"
      style="width: 35dvh"
      :disable="!state.patientWithFamilyHistory"
      lazy-rules
      :rules="state.patientWithFamilyHistory ? [isNotNull] : []"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> Sin resultados </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      dense
      v-model="state.familiarCondition"
      class="col-grow"
      style="margin-left: 15px"
      placeholder="Condición *"
      :disable="!state.patientWithFamilyHistory"
      :rules="state.patientWithFamilyHistory ? [required, isNotNull] : []"
    />
  </div>
</template>

<script setup lang="ts">
  import { inject, onMounted } from 'vue';
  import 'src/css/app.sass';
  import { AppointmentBloc } from 'src/Adapters';
  import { isNotNull, required } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';
  import { AllergieResponse } from 'src/Domine/Responses';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const props = defineProps<{ bloc: AppointmentBloc }>();
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  const controller = <AppointmentBloc>props.bloc;
  // const disableContinue = store.currentSchedule == null ? false : false;

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
  });

  const state = usePlocState(controller);

  function allergieChanged(val: AllergieResponse) {
    if (val.code === '00') {
      state.value.allergen = null;
    }
    controller.allergieChanged(val);
  }

  function handleCheckboxFamilyHistory(value: boolean) {
    if (!value) {
      state.value.kinship = null;
      state.value.familiarCondition = null;
    }
  }

  function handleCheckboxTreatment(value: boolean) {
    if (!value) {
      state.value.treatmentMedical = null;
    }
  }
</script>

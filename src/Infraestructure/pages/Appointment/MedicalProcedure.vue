<template>
  <q-select
    option-value="id"
    :option-label="(option) => `${option.code} ${option.name}`"
    dense
    v-model="state.cupCode"
    :options="state.allCUP"
    label="Procedimiento (CUP)"
    clearable
    input-debounce="300"
    fill-input
    use-input
    hide-selected
    @filter="onSearchCUP"
    :rules="[isNotNull]"
  />
  <q-input
    v-model="state.procedureObservations"
    filled
    type="textarea"
    label="Observaciones"
    autogrow
    autocapitalize="sentences"
    clearable
  />

  Ayudas Diagnosticas??
</template>

<script setup lang="ts">
  import { isNotNull } from 'src/Application/Utilities';
  import { AppointmentBloc } from 'src/Adapters';
  import { UpdateFunction } from 'src/Domine/Types';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';

  const props = defineProps<{ bloc: AppointmentBloc }>();
  const controller = <AppointmentBloc>props.bloc;
  const state = usePlocState(controller);

  function onSearchCUP(val: string, update: UpdateFunction) {
    if (val === '') {
      return;
    }
    state.value.filterCUP = val;
    update(async () => {
      await controller.filterCUP();
    });
  }
</script>

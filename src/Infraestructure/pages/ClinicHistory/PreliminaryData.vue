<template>
  <q-input
    v-model="state.reasonConsultation"
    outlined
    label="Motivo de Consulta"
    :rules="[required]"
  >
    <template v-slot:prepend>
      <q-icon :name="icons.hurt" size="40px" />
    </template>
  </q-input>
  <q-input
    v-model="state.descriptionConsultation"
    filled
    autogrow
    label="Descripcion Consulta"
    :rules="[required]"
  >
  </q-input>
  <br />
  <div>
    <q-select
      filled
      fill-input
      use-input
      dense
      v-model="state.pathology"
      :options="state.allPathologies"
      label="Antecedentes Patologicos Paciente"
      :option-value="(item) => (item === null ? null : item.id)"
      option-label="description"
      map-options
      multiple
      emit-value
      @filter="filterFn"
      input-debounce="0"
    >
      <template v-slot:prepend>
        <q-icon :name="icons.historyLog" size="32px" />
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> Sin resultados </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
  <br />
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { IconSVG } from 'src/Application/Utilities';
import { PreliminaryDataBloc } from 'src/Adapters';
import { required } from 'src/Application/Utilities/Helpers';
import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
import container from 'src/inversify.config';
import { IControllersMediator } from 'src/Domine/IPatterns';
import 'src/css/app.sass';

const controller = inject<PreliminaryDataBloc>(
  'preliminaryDataBloc'
) as PreliminaryDataBloc;
const state = usePlocState(controller);

onMounted(async () => {
  await controller.loadInitialData();
});

const clinicHistoryMediator = container.get<IControllersMediator>(
  'ClinicHistoryMediator'
);
clinicHistoryMediator.add(controller);
const icons = IconSVG;
function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    state.value.allPathologies = state.value.pathologiesForFilter.filter(
      (v) => v.description.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

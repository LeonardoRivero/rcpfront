<template>
  <q-input
    v-model="state.reasonConsultation"
    outlined
    label="Motivo de Consulta"
    :rules="[(val) => (val && val.length > 0) || FIELD_REQUIRED]"
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
    :rules="[(val) => (val && val.length > 0) || FIELD_REQUIRED]"
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

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { IconSVG, FIELD_REQUIRED } from 'src/Application/Utilities';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { PreliminaryDataState } from 'src/Domine/IStates';
import { PreliminaryDataController } from 'src/Adapters';
import { ClinicHistoryMediator, SettingsMediator } from '../../Mediators';
import { ScheduleMediator } from '../../Mediators/ScheduleMediator';
import { PhysicalExamResultService } from 'src/Application/Services/PhysicalExamResultService';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PreliminaryData',

  setup() {
    let state: PreliminaryDataState = reactive({
      allPathologies: [],
      pathology: null,
      items: [],
      reasonConsultation: '',
      descriptionConsultation: '',
    });

    const controller = PreliminaryDataController.getInstance(state);
    const settingsMediator = SettingsMediator.getInstance();
    const scheduleMediator = ScheduleMediator.getInstance();
    const clinicHistoryMediator = ClinicHistoryMediator.getInstance();
    clinicHistoryMediator.add(controller);
    scheduleMediator.add(controller);
    let pathologies = [] as Array<PathologicalHistoryResponse>;

    onMounted(async () => {
      state.allPathologies = await settingsMediator.getAllPathologies();
      pathologies = state.allPathologies;
    });

    return {
      FIELD_REQUIRED,
      icons: IconSVG,
      state,
      splitterModel: 50,
      filterFn(val: string, update: any) {
        update(() => {
          const needle = val.toLowerCase();
          state.allPathologies = pathologies.filter(
            (v) => v.description.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
});
</script>

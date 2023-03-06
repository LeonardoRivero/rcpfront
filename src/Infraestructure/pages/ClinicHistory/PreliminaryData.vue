<template>
  {{ state }}
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
  <div class="text-h5 q-mt-sm q-mb-xs">
    <q-icon :name="icons.physicalTherapy" size="32px" /> Examen Fisico
  </div>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <div v-for="(item, index) in state.items" :key="item.id">
        <q-item v-if="index % 2 == 0">
          <q-item-section>
            <q-item-label>{{ item.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-input
              dense
              v-model="item.result"
              :rules="[(val) => (val && val.length > 0) || FIELD_REQUIRED]"
            />
          </q-item-section>
        </q-item>
      </div>
    </template>
    <template v-slot:after>
      <div v-for="(item, index) in state.items" :key="item.id">
        <q-item v-if="index % 2 != 0">
          <q-item-section>
            <q-item-label>{{ item.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-input
              dense
              v-model="item.result"
              :rules="[(val) => (val && val.length > 0) || FIELD_REQUIRED]"
            />
          </q-item-section>
        </q-item>
      </div>
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { IconSVG, FIELD_REQUIRED } from 'src/Application/Utilities';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { PreliminaryDataState } from 'src/Domine/IStates';
import { PreliminaryDataController } from 'src/Adapters';
import { ClinicHistoryMediator, SettingsMediator } from '../../Mediators';
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

    const pathologyHistoryMediator = SettingsMediator.getInstance();
    const controller = PreliminaryDataController.getInstance(state);
    const clinicHistoryMediator = ClinicHistoryMediator.getInstance();
    clinicHistoryMediator.add(controller);
    // let state = controller.getState();

    let pathologies = [] as Array<PathologicalHistoryResponse>;

    onMounted(async () => {
      state.allPathologies = await pathologyHistoryMediator.getAllPathologies();
      pathologies = state.allPathologies;
    });

    return {
      FIELD_REQUIRED,
      icons: IconSVG.getInstance(),
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

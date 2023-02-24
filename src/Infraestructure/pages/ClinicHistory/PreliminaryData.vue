<template>
  <q-input
    v-model="state.reasonConsultation"
    filled
    autogrow
    label="Motivo de Consulta"
    :rules="[(val) => (val && val.length > 0) || FIELD_REQUIRED]"
  >
    <template v-slot:prepend>
      <q-icon :name="icons.hurt" size="40px" />
    </template>
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
  <q-splitter v-model="state.splitterModel">
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
import { defineComponent, onMounted } from 'vue';
import { IconSVG, FIELD_REQUIRED } from 'src/Application/Utilities';
import { PathologicalHistoryAdapter } from 'src/Adapters/PathologicalHistoryAdapter';
import { useStorePathological } from 'src/Infraestructure/stores/SettingsPage/PathologicalHistoryStore';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { PreliminaryDataController } from 'src/Adapters';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PreliminaryData',
  setup() {
    const adapter = PathologicalHistoryAdapter.getInstance(
      useStorePathological()
    );

    const icons = IconSVG.getInstance();
    const preliminaryDataController = PreliminaryDataController.getInstance();
    const state = preliminaryDataController.getState();
    let pathologies = [] as Array<PathologicalHistoryResponse>;

    onMounted(async () => {
      state.allPathologies = await adapter.getAll();
      pathologies = state.allPathologies;
    });

    return {
      FIELD_REQUIRED,
      icons,
      state,
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

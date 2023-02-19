<template>
  <div class="q-pa-md">
    Registre las patologias informadas por el paciente.
    <q-select
      filled
      fill-input
      use-input
      dense
      v-model="state.pathology"
      :options="state.allPathologies"
      label="Antecendentes Patologicos Paciente"
      :option-value="(item) => (item === null ? null : item.id)"
      option-label="description"
      map-options
      multiple
      emit-value
      @filter="filterFn"
      input-debounce="0"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> Sin resultados </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div class="q-pa-md">
      <q-list>
        <div v-for="(item, index) in physicalExamParameter" :key="item.id">
          <q-item>
            <q-item-section>
              <q-item-label>{{ item.description }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-input v-model="datos[index]" label="Standard" dense />
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </div>
      </q-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ISpeciality } from 'src/Domine/ModelsDB';
import { PathologicalHistoryAdapter } from 'src/Adapters/PathologicalHistoryAdapter';
import { useStorePathological } from 'src/Infraestructure/stores/SettingsPage/PathologicalHistoryStore';
import {
  PathologicalHistoryResponse,
  PhysicalExamResponse,
} from 'src/Domine/Responses';
import { PhysicalExamService } from 'src/Application/Services';
import { PreliminaryDataController } from 'src/Adapters';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PreliminaryData',
  setup() {
    const adapter = PathologicalHistoryAdapter.getInstance(
      useStorePathological()
    );

    const physicalExamParameter = ref<Array<PhysicalExamResponse>>([]);
    const service = PhysicalExamService.getInstance();

    const preliminaryDataController = new PreliminaryDataController();
    const state = preliminaryDataController.getState();
    let pathologies = [] as Array<PathologicalHistoryResponse>;

    onMounted(async () => {
      state.allPathologies = await adapter.getAll();
      pathologies = state.allPathologies;

      const queryParameters = { speciality: 1 };
      physicalExamParameter.value = await service.findByParameters(
        queryParameters
      );
    });

    return {
      text: '',
      state,
      datos: [],
      physicalExamParameter,
      form: {
        parent_id: [],
      },
      add() {
        // adapter.add();
      },
      edit() {
        // adapter.edit();
      },
      async confirmChanges() {
        // await adapter.saveOrUpdate(currentSpeciality.value);
      },
      async specialityChanged(val: ISpeciality) {
        // await adapter.specialityChanged(val);
        // const queryParameters = { speciality: val.id };
        // const response = await dxMainCodeAdapter.findByParameters(
        //   queryParameters
        // );
        // await dxMainCodeAdapter.clear();
        // dxMainCodeAdapter.listDxMainCodes = response;
        // await relationCodeAdapter.clear();
      },
      clearSpeciality() {
        // adapter.clear();
      },
      filterFn(val: string, update: any, abort: any) {
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

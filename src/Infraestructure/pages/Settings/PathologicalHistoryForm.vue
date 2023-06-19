<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-caption text-grey">
          Patologias existentes:
          {{
            state.allPathologies.length == 0 ? '' : state.allPathologies.length
          }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="state.pathology"
          :options="state.allPathologies"
          :option-value="(item) => (item === null ? null : item.id)"
          option-label="description"
          map-options
          label="Patologia"
          :rules="[required]"
          @update:model-value="(val) => pathologyChanged(val)"
          @clear="(val) => clear(val)"
        >
        </q-select>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round color="primary" icon="mdi-plus" @click="add()">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Agregar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="state.pathology != null"
          flat
          round
          color="green"
          icon="mdi-pencil"
          @click="edit()"
        >
          <q-tooltip transition-show="scale" transition-hide="scale">
            Editar
          </q-tooltip>
        </q-btn>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="state.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="state.expanded = !state.expanded"
        />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="state.expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <q-form @submit="confirmChanges" class="q-gutter-md" ref="form">
              <q-input
                dense
                outlined
                v-model="state.currentPathology.description"
                label="Descripcion"
                hint="Descripcion Patologia"
                lazy-rules
                :rules="[required]"
              />
              <div>
                <q-btn label="Guardar" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryAdapter } from 'src/Adapters/PathologicalHistoryAdapter';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { PathologicalHistoryState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { required } from 'src/Application/Utilities/Helpers';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PathologicalHistoryForm',
  setup() {
    const state: PathologicalHistoryState = reactive({
      currentPathology: {} as IPathologycalHistory,
      pathology: null,
      expanded: false,
      allPathologies: <Array<PathologicalHistoryResponse>>[],
    });
    const adapter = PathologicalHistoryAdapter.getInstance(state);

    const form = ref<QForm>();
    const mediator = SettingsMediator.getInstance();

    onMounted(async () => {
      state.allPathologies = await mediator.getAllPathologies();
    });

    return {
      state,
      form,
      required,
      add() {
        state.expanded = true;
        state.currentPathology = {} as IPathologycalHistory;
      },

      edit() {
        if (state.expanded === false) {
          state.expanded = !state.expanded;
        }
        state.currentPathology = adapter.responseToEntity(state.pathology);
      },

      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) {
          return;
        }
        const response = await adapter.saveOrUpdate(state.currentPathology);
        if (response == null) {
          return;
        }
        state.pathology = adapter.responseToEntity(response);
        state.currentPathology = {} as IPathologycalHistory;
        state.expanded = false;
      },

      pathologyChanged(val: PathologicalHistoryResponse) {
        const entity = adapter.responseToEntity(val);
        state.currentPathology = entity;
      },

      clear() {
        return;
      },
    };
  },
});
</script>

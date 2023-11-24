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
          lazy-rules
          label="Patologia"
          :rules="[isNotNull]"
          @update:model-value="(val) => pathologyChanged(val)"
          @clear="(val) => clear()"
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
import { PathologicalHistoryController } from 'src/Adapters/PathologicalHistoryAdapter';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { PathologicalHistoryState } from 'src/Domine/IStates';
import { required, isNotNull } from 'src/Application/Utilities/Helpers';
import { IPathologycalHistory } from 'src/Domine/ModelsDB';
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
    const controller = PathologicalHistoryController.getInstance(state);
    const form = ref<QForm>();

    onMounted(async () => {
      state.allPathologies = await controller.getAll();
    });

    return {
      state,
      form,
      required,
      isNotNull,
      add() {
        controller.add();
      },
      edit() {
        controller.edit();
      },
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        await controller.saveOrUpdate();
      },
      pathologyChanged(val: PathologicalHistoryResponse) {
        controller.pathologyChanged(val);
      },
      clear() {
        return;
      },
    };
  },
});
</script>

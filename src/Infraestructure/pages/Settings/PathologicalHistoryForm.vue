<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-caption text-grey">
          Patologias existentes:
          {{ allPathologies == null ? '' : allPathologies.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="pathology"
          :options="allPathologies"
          :option-value="(item) => (item === null ? null : item.id)"
          option-label="description"
          map-options
          label="Patologia"
          :rules="[(val) => val || 'Campo requerido']"
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
          v-if="pathology != null"
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
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <q-form @submit="confirmChanges" class="q-gutter-md" ref="form">
              <q-input
                dense
                outlined
                v-model="currentPathology.description"
                label="Descripcion"
                hint="Descripcion Patologia"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
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
import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryAdapter } from 'src/Adapters/PathologicalHistoryAdapter';
import { QForm } from 'quasar';
import { useStorePathological } from 'src/Infraestructure/stores/SettingsPage/PathologicalHistoryStore';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PathologicalHistoryForm',
  setup() {
    const adapter = PathologicalHistoryAdapter.getInstance(
      useStorePathological()
    );
    const currentPathology = ref<IPathologycalHistory>(
      {} as IPathologycalHistory
    );
    const pathology = ref<PathologicalHistoryResponse | null>(null);
    const form = ref<QForm>();
    const expanded = ref<boolean>(false);
    const { allPathologies } = storeToRefs(useStorePathological());

    onMounted(async () => {
      allPathologies.value = await adapter.getAll();
    });

    return {
      form,
      currentPathology,
      pathology,
      allPathologies,
      expanded,
      add() {
        expanded.value = true;
        currentPathology.value = {} as IPathologycalHistory;
      },

      edit() {
        if (expanded.value === false) {
          expanded.value = !expanded.value;
        }
        currentPathology.value = adapter.responseToEntity(pathology.value);
      },

      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) {
          return;
        }
        const response = await adapter.saveOrUpdate(currentPathology.value);
        if (response == null) {
          return;
        }
        pathology.value = adapter.responseToEntity(response);
        currentPathology.value = {} as IPathologycalHistory;
        form.value?.reset();
        expanded.value = false;
      },

      pathologyChanged(val: PathologicalHistoryResponse) {
        const entity = adapter.responseToEntity(val);
        currentPathology.value = entity;
      },

      clear() {
        return;
      },
    };
  },
});
</script>

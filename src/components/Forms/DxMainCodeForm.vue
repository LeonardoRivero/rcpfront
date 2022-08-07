<template>
  <div class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Codigos CUPS</div>
        <div class="text-caption text-grey">
          CUPS existentes:
          {{
            dxMainCodeofSpeciality == null ? '' : dxMainCodeofSpeciality.length
          }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="dxMainCode"
          :options="dxMainCodeofSpeciality"
          option-value="id"
          option-label="description"
          map-options
          label="Descripcion"
          :hint="`Codigo CUP:  ${
            currentDxMainCode.CUP != null ? currentDxMainCode.CUP : ''
          }`"
          @update:model-value="(val) => dxMainCodeChanged(val)"
          @clear="(val) => clearDxMainCode(val)"
        >
        </q-select>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round color="primary" icon="mdi-plus" @click="add">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Agregar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="dxMainCode != null"
          flat
          round
          color="green"
          icon="mdi-pencil"
          @click="edit"
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
            <q-form @submit="confirmChanges" ref="formDXMainCode">
              <q-input
                dense
                outlined
                disable
                v-model="currentSpeciality.description"
                label="Especialidad"
                :error="error"
              />
              <q-input
                dense
                outlined
                v-model="currentDxMainCode.CUP"
                label="Codigo CUP"
                maxlength="10"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Codigo es requerido',
                ]"
              />
              <q-input
                dense
                outlined
                v-model="currentDxMainCode.description"
                label="Descripcion Codigo CUP"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Descripcion es requerida',
                ]"
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
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCounterStore } from 'src/stores/storeSettings';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useDxMainCode } from 'src/services/DxMainCodeService';
import { useSpeciality } from 'src/services/SpecialityService';
export default defineComponent({
  name: 'DxMainCodeForm',
  setup() {
    // const store = useCounterStore();
    // const router = useRouter();
    const {
      dxMainCodeofSpeciality,
      currentDxMainCode,
      dxMainCode,
      expanded,
      formDXMainCode,
      error,
      clearDxMainCode,
      dxMainCodeChanged,
      edit,
      add,
      confirmChanges,
    } = useDxMainCode();
    const { currentSpeciality } = useSpeciality();
    // onMounted(async () => {
    //   if (store.allDxMainCodes == undefined) {
    //     const response = await store.retrieveAllDxMainCode();
    //     if (response.status == HttpStatusCodes.NOT_FOUND) {
    //       router.push('/:catchAll');
    //     }
    //   }
    // });
    return {
      dxMainCode,
      clearDxMainCode,
      dxMainCodeChanged,
      currentDxMainCode,
      dxMainCodeofSpeciality,
      currentSpeciality,
      // store,
      expanded,
      formDXMainCode,
      error,
      edit,
      add,
      confirmChanges,
    };
  },
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  min-width: 300px
  max-width: 300px
</style>

<template>
  <div class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Codigos Relacionados</div>
        <div class="text-caption text-grey">
          Codigos Relacionados existentes:
          {{
            relationCodeOfMainCode == null ? '' : relationCodeOfMainCode.length
          }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="relationCode"
          :options="relationCodeOfMainCode"
          option-value="id"
          option-label="description"
          map-options
          label="Descripcion"
          :hint="`Codigo CUP:  ${
            currentRelationCode != null ? currentRelationCode : ''
          }`"
          @update:model-value="(val) => relationCodeChanged(val)"
          @clear="(val) => clearRelationCode(val)"
        >
        </q-select>
      </q-card-section>
      <!-- <q-card-actions>
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
                v-model="currentRelationCode.description"
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
                v-model="currentRelationCode.description"
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
      </q-slide-transition> -->
    </q-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCounterStore } from 'src/stores/storeSettings';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useSpeciality } from 'src/services/SpecialityService';
import { useRelationCode } from 'src/services/RelationCodeService';
export default defineComponent({
  name: 'DxMainCodeForm',
  setup() {
    const store = useCounterStore();
    const router = useRouter();
    const {
      relationCodeOfMainCode,
      currentRelationCode,
      relationCode,
      expanded,
      formDXMainCode,
      error,
      relationCodeChanged,
      clearRelationCode,
      edit,
      add,
      confirmChanges,
    } = useRelationCode();
    const { currentSpeciality } = useSpeciality();
    onMounted(async () => {
      if (store.allDxMainCodes == undefined) {
        const response = await store.retrieveAllDxMainCode();
        if (response.status == HttpStatusCodes.NOT_FOUND) {
          router.push('/:catchAll');
        }
      }
    });
    return {
      relationCode,
      clearRelationCode,
      relationCodeChanged,
      currentRelationCode,
      relationCodeOfMainCode,
      currentSpeciality,
      store,
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

<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Codigos CUPS</div>
        <div class="text-caption text-grey">
          CUPS existentes:
          {{ allDxMainCodes == null ? '' : allDxMainCodes.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="dxMainCode"
          :options="allDxMainCodes"
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
            <q-form @submit="confirmChanges" ref="form">
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
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useStoreSpeciality } from 'src/Infraestructure/stores/SettingsPage/SpecialityStore';
import { useStoreDxMainCode } from 'src/Infraestructure/stores/SettingsPage/DxMainCodeStore';
import { DxMainCodeAdapter } from 'src/Adapters/DxMainCodeAdapter';
import { DXMainCodeResponse } from 'src/Domine/Responses';

import 'src/css/app.sass';
import { RelationCodeAdapter } from 'src/Adapters';
import { useStoreRelationCode } from 'src/Infraestructure/stores/SettingsPage/RelationCodeStore';

export default defineComponent({
  name: 'DxMainCodeForm',
  setup() {
    const {
      error,
      currentDxMainCode,
      dxMainCode,
      expanded,
      allDxMainCodes,
      form,
    } = storeToRefs(useStoreDxMainCode());
    const { currentSpeciality } = storeToRefs(useStoreSpeciality());
    const adapter = DxMainCodeAdapter.getInstance(useStoreDxMainCode());

    const storeRelationCode = useStoreRelationCode();
    const adapterRelationCode =
      RelationCodeAdapter.getInstance(storeRelationCode);

    return {
      dxMainCode,
      currentDxMainCode,
      allDxMainCodes,
      // dxMainCodeofSpeciality: service.dxMainCodeofSpeciality,
      currentSpeciality,
      expanded,
      form,
      error,
      async clearDxMainCode() {
        await adapter.clear();
      },
      async dxMainCodeChanged(val: DXMainCodeResponse) {
        await adapter.dxMainCodeChanged(val);
        const queryParameters = { dxMainCodeId: val.id };
        const response = await adapterRelationCode.findByParameters(
          queryParameters
        );
        storeRelationCode.allRelationCodes = response;
      },
      edit() {
        adapter.edit();
      },
      add() {
        adapter.add();
      },
      async confirmChanges() {
        await adapter.saveOrUpdate();
      },
    };
  },
});
</script>

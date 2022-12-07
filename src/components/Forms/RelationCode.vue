<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Codigos Relacionados</div>
        <div class="text-caption text-grey">
          Codigos Relacionados encontrados:
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
          :hint="`Codigo Relacionado:  ${
            relationCode == undefined ? '' : currentRelationCode.code
          }`"
          @update:model-value="(val) => relationCodeChanged(val)"
          @clear="(val) => clearRelationCode(val)"
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
          v-if="relationCode != null"
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
                :error="errorSpeciality"
              />
              <q-input
                dense
                outlined
                disable
                v-model="currentDxMainCode.description"
                label="Codigo Principal"
                :error="errorDxMainCode"
              />
              <q-input
                dense
                outlined
                v-model="currentRelationCode.code"
                label="Codigo Relacionado"
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
                label="Descripcion Codigo Relacionado"
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
import { storeToRefs } from 'pinia';
import { useStoreSpeciality } from 'src/services/SpecialityService';
import {
  relationCodeService,
  useStoreRelationCode,
} from 'src/services/RelationCodeService';
import { useStoreDxMainCode } from 'src/services/DxMainCodeService';
import { IRelationCodeResponse } from 'src/models/IConsults';
import 'src/css/app.sass';

export default defineComponent({
  name: 'RelationCodeForm',
  setup() {
    const store = useStoreRelationCode();

    const {
      // relationCodeOfMainCode,
      currentRelationCode,
      relationCode,
      expanded,
      form,
      errorDxMainCode,
      errorSpeciality,
      // relationCodeChanged,
      // clearRelationCode,
      // edit,
      // add,
      // confirmChanges,
      // getAllRelationCodes,
    } = storeToRefs(store);
    const service = relationCodeService.getInstance();
    onMounted(async () => {
      service.getAll();
    });

    const storeSpeciality = useStoreSpeciality();
    const storeDxMainCode = useStoreDxMainCode();
    const { currentSpeciality } = storeToRefs(storeSpeciality);
    const { currentDxMainCode } = storeToRefs(storeDxMainCode);

    return {
      relationCode,
      currentRelationCode,
      relationCodeOfMainCode: service.relationCodeOfMainCode,
      currentSpeciality,
      currentDxMainCode,
      expanded,
      form,
      errorDxMainCode,
      errorSpeciality,
      edit() {
        service.edit();
      },
      add() {
        service.add();
      },
      async confirmChanges() {
        await service.processRequest();
      },
      clearRelationCode() {
        service.clear();
      },
      async relationCodeChanged(val: IRelationCodeResponse) {
        await service.relationCodeChanged(val);
      },
    };
  },
});
</script>

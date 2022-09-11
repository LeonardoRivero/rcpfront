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
                disable
                v-model="currentDxMainCode.description"
                label="Codigo Principal"
                :error="error"
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
import { specialityService } from 'src/services/SpecialityService';
import { relationCodeService } from 'src/services/RelationCodeService';
import { dxMainCodeService } from 'src/services/DxMainCodeService';
export default defineComponent({
  name: 'RelationCodeForm',
  setup() {
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
      getAllRelationCodes,
    } = relationCodeService();

    const { currentSpeciality } = specialityService();
    const { currentDxMainCode } = dxMainCodeService();

    onMounted(async () => {
      getAllRelationCodes();
    });
    return {
      relationCode,
      clearRelationCode,
      relationCodeChanged,
      currentRelationCode,
      relationCodeOfMainCode,
      currentSpeciality,
      currentDxMainCode,
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
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.2)
    transition: all ease 0.2s

.my-card:hover
    transition: all ease 0.2s
    box-shadow: inherit
    box-shadow: 5px 5px 20px 5px rgba(0,0,0,0.3)
</style>

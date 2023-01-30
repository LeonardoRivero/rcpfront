<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">
          <q-icon :name="icon" size="32px" />Especialidades
        </div>
        <div class="text-caption text-grey">
          Especialidades existentes:
          {{ allSpecialities == null ? '' : allSpecialities.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="speciality"
          :options="allSpecialities"
          option-value="id"
          option-label="description"
          map-options
          label="Especialidad"
          :hint="`Codigo Especialidad: ${
            speciality == undefined ? '' : speciality.code
          }`"
          @update:model-value="(val) => specialityChanged(val)"
          @clear="(val) => clearSpeciality(val)"
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
          v-if="speciality != null"
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
            <q-form @submit="confirmChanges" class="q-gutter-md" ref="form">
              <q-input
                dense
                outlined
                v-model="currentSpeciality.description"
                label="Descripcion"
                hint="Descripcion Especialidad"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Descripcion es requerida',
                ]"
              />
              <q-input
                dense
                outlined
                v-model="currentSpeciality.code"
                label="Codigo Especialidad"
                hint="Codigo Especialidad"
                lazy-rules
                type="number"
                :rules="[
                  (val) => (val && val.length > 0) || 'Codigo es requerido',
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
import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  SpecialityAdapter,
  DxMainCodeAdapter,
  RelationCodeAdapter,
} from 'src/Adapters';
import { useStoreSpeciality } from '../../stores/SettingsPage/SpecialityStore';
import { useStoreDxMainCode } from 'src/Infraestructure/stores/SettingsPage/DxMainCodeStore';

import 'src/css/app.sass';
import { useStoreRelationCode } from 'src/Infraestructure/stores/SettingsPage/RelationCodeStore';
import { IconSVG } from 'src/Application/Utilities';

export default defineComponent({
  name: 'SpecialityForm',
  setup() {
    const { allSpecialities, currentSpeciality, speciality, expanded, form } =
      storeToRefs(useStoreSpeciality());

    const adapter = SpecialityAdapter.getInstance(useStoreSpeciality());
    const dxMainCodeAdapter = DxMainCodeAdapter.getInstance(
      useStoreDxMainCode()
    );

    const relationCodeAdapter = RelationCodeAdapter.getInstance(
      useStoreRelationCode()
    );
    const iconSVG = IconSVG.getInstance();
    const icon = ref<string>('');
    onMounted(async () => {
      await adapter.getAll();
      icon.value = iconSVG.bookMedical;
    });

    return {
      icon,
      expanded,
      speciality,
      allSpecialities,
      currentSpeciality,
      form,
      add() {
        adapter.add();
      },
      edit() {
        adapter.edit();
      },
      async confirmChanges() {
        await adapter.saveOrUpdate(currentSpeciality.value);
      },
      async specialityChanged(val: ISpeciality) {
        await adapter.specialityChanged(val);
        const queryParameters = { speciality: val.id };
        const response = await dxMainCodeAdapter.findByParameters(
          queryParameters
        );
        await dxMainCodeAdapter.clear();
        dxMainCodeAdapter.listDxMainCodes = response;
        await relationCodeAdapter.clear();
      },
      clearSpeciality() {
        adapter.clear();
      },
    };
  },
});
</script>

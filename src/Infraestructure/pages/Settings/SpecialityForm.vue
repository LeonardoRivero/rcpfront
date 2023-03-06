<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">
          <q-icon :name="icons.bookMedical" size="32px" />Especialidades
        </div>
        <div class="text-caption text-grey">
          Especialidades existentes:
          {{
            state.allSpecialities == null ? '' : state.allSpecialities.length
          }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="state.speciality"
          :options="state.allSpecialities"
          option-value="id"
          option-label="description"
          map-options
          label="Especialidad"
          :hint="`Codigo Especialidad: ${
            state.speciality == undefined ? '' : state.speciality.code
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
          v-if="state.peciality != null"
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
                v-model="state.currentSpeciality.description"
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
                v-model="state.currentSpeciality.code"
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
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { ISpeciality } from 'src/Domine/ModelsDB';
import {
  SpecialityController,
  DxMainCodeController,
  RelationCodeAdapter,
} from 'src/Adapters';
import { useStoreDxMainCode } from '../../Mediators/SettingsPage/DxMainCodeStore';
import { useStoreRelationCode } from '../../Mediators/SettingsPage/RelationCodeStore';
import { IconSVG } from 'src/Application/Utilities';
import { SpecialityResponse } from 'src/Domine/Responses';
import { SpecialityFormState } from 'src/Domine/IStates';
import { SettingsMediator } from '../../Mediators';
import 'src/css/app.sass';

export default defineComponent({
  name: 'SpecialityForm',
  setup() {
    const state: SpecialityFormState = reactive({
      currentSpeciality: {} as SpecialityResponse,
      expanded: false,
      speciality: null,
      allSpecialities: <Array<SpecialityResponse>>[],
    });

    const form = ref<QForm>();
    const controller = SpecialityController.getInstance(state);
    const mediator = SettingsMediator.getInstance();
    mediator.add(controller);

    const dxMainCodeAdapter = DxMainCodeController.getInstance(
      useStoreDxMainCode()
    );

    const relationCodeAdapter = RelationCodeAdapter.getInstance(
      useStoreRelationCode()
    );

    onMounted(async () => {
      state.allSpecialities = await mediator.getAllSpecialities();
    });

    return {
      state,
      icons: IconSVG.getInstance(),
      form,
      add() {
        controller.add();
        form.value?.reset();
      },

      edit() {
        controller.edit();
      },

      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        await controller.saveOrUpdate(state.currentSpeciality);
      },

      async specialityChanged(val: ISpeciality) {
        await controller.specialityChanged(val);
        const queryParameters = { speciality: val.id };
        const response = await dxMainCodeAdapter.findByParameters(
          queryParameters
        );
        await dxMainCodeAdapter.clear();
        dxMainCodeAdapter.listDxMainCodes = response;
        await relationCodeAdapter.clear();
      },

      clearSpeciality() {
        controller.clear();
      },
    };
  },
});
</script>

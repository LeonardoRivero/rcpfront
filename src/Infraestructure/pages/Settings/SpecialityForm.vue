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
        <q-btn
          :disable="!storePermissions.specialities.canCreate"
          flat
          round
          color="primary"
          icon="mdi-plus"
          @click="add"
        >
          <q-tooltip transition-show="scale" transition-hide="scale">
            Agregar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="state.speciality != null"
          flat
          round
          color="green"
          icon="mdi-pencil"
          @click="edit"
          :disable="!storePermissions.specialities.canUpdate"
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
          :disable="!storePermissions.specialities.canUpdate"
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
                :rules="[required]"
              />
              <q-input
                dense
                outlined
                v-model="state.currentSpeciality.code"
                label="Codigo Especialidad"
                hint="Codigo Especialidad"
                lazy-rules
                type="number"
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

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { QForm } from 'quasar';
import { IconSVG } from 'src/Application/Utilities';
import { SpecialityResponse } from 'src/Domine/Responses';
import { SettingsMediator } from '../../Mediators';
import { ContextUser } from 'src/Domine/StrategyUser';
import { required } from 'src/Application/Utilities/Helpers';
import { SpecialityFormBloc } from 'src/Adapters/SpecialityController';
import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
import 'src/css/app.sass';

const contextUser = ContextUser.getInstance();
const storePermissions = contextUser.getStore();
const form = ref<QForm>();
const dependenciesLocator = inject<any>('dependenciesLocator');
const controller = <SpecialityFormBloc>(
  dependenciesLocator.provideSpecialityBloc()
);
const mediator = SettingsMediator.getInstance();
const state = usePlocState(controller);
mediator.add(controller);
const icons = IconSVG;

onMounted(async () => {
  await controller.loadInitialData();
});

function add() {
  controller.add();
  form.value?.reset();
}
function edit() {
  controller.edit();
}
async function confirmChanges() {
  const isValid = await form.value?.validate();
  if (isValid == false) return;
  await controller.saveOrUpdate();
}
async function specialityChanged(val: SpecialityResponse) {
  await controller.notifySpeciality(val);
}
function clearSpeciality(val: any) {
  controller.clear();
}
</script>

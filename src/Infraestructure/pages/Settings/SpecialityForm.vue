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

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { ISpeciality } from 'src/Domine/ModelsDB';
import { SpecialityController } from 'src/Adapters';
import { IconSVG } from 'src/Application/Utilities';
import { SpecialityResponse } from 'src/Domine/Responses';
import { SpecialityFormState } from 'src/Domine/IStates';
import { SettingsMediator } from '../../Mediators';
import { ContextUser } from 'src/Domine/StrategyUser';
import { required } from 'src/Application/Utilities/Helpers';
import 'src/css/app.sass';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
import container from 'src/inversify.config';
import { SpecialityService } from 'src/Application/Services/SpecialityService';

export default defineComponent({
  name: 'SpecialityForm',
  setup() {
    const state: SpecialityFormState = reactive({
      currentSpeciality: {} as SpecialityResponse,
      expanded: false,
      speciality: null,
      allSpecialities: <Array<SpecialityResponse>>[],
    });
    const contextUser = ContextUser.getInstance();
    const storePermissions = contextUser.getStore();

    const form = ref<QForm>();
    const controller = SpecialityController.getInstance(state);
    const mediator = SettingsMediator.getInstance();

    mediator.add(controller);
    const store = mediator.getStore();

    onMounted(async () => {
      state.allSpecialities = await mediator.getAllSpecialities();
    });

    return {
      storePermissions,
      state,
      icons: IconSVG,
      form,
      required,
      add() {
        controller.add();
        form.value?.reset();
      },

      edit() {
        controller.edit();
      },

      async confirmChanges() {
        controller.resetAllCommand();
        const isValid = await form.value?.validate();
        if (isValid == false || !state.currentSpeciality) return;
        const service = container.get<SpecialityService>('SpecialityService');
        let payload: ISpeciality = state.currentSpeciality;

        if (state.currentSpeciality?.id == undefined) {
          const createCommand = new InsertCommand(payload, service);
          controller.setOnSave(createCommand);
        } else {
          const id = state.currentSpeciality.id;
          payload.id = id;
          const upateCommand = new EditCommand(payload, id, service);
          controller.setOnUpdate(upateCommand);
        }

        await controller.saveOrUpdate();
        store.allSpecialities = state.allSpecialities;
      },

      async specialityChanged(val: SpecialityResponse) {
        await controller.notifySpeciality(val);
      },

      clearSpeciality(val: any) {
        controller.clear();
      },
    };
  },
});
</script>

<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">
          <q-icon :name="icons.barCode" size="32px" /> Codigos CUPS
        </div>
        <div class="text-caption text-grey">
          CUPS existentes:
          {{ state.allDxMainCodes == null ? '' : state.allDxMainCodes.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="state.dxMainCode"
          :options="state.allDxMainCodes"
          option-value="id"
          option-label="description"
          map-options
          label="Descripcion"
          :hint="`Codigo CUP:  ${
            state.currentDxMainCode.CUP != null
              ? state.currentDxMainCode.CUP
              : ''
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
          v-if="state.dxMainCode != null"
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
            <q-form @submit="confirmChanges" ref="form">
              <q-input
                dense
                outlined
                disable
                v-model="store.currentSpeciality.description"
                label="Especialidad"
                :error="state.error"
              />
              <q-input
                dense
                outlined
                v-model="state.currentDxMainCode.CUP"
                label="Codigo CUP"
                maxlength="10"
                lazy-rules
                :rules="[required]"
              />
              <q-input
                dense
                outlined
                v-model="state.currentDxMainCode.description"
                label="Descripcion Codigo CUP"
                lazy-rules
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
import { defineComponent, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { DxMainCodeController } from 'src/Adapters/DxMainCodeAdapter';
import { DXMainCodeResponse } from 'src/Domine/Responses';
import { IconSVG } from 'src/Application/Utilities';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { DxMainCodeState } from 'src/Domine/IStates';
import { IStoreSettings } from 'src/Domine/IStores';
import { IDXMainCode } from 'src/Domine/ModelsDB';
import { required } from 'src/Application/Utilities/Helpers';
import 'src/css/app.sass';

export default defineComponent({
  name: 'DxMainCodeForm',
  setup() {
    const state: DxMainCodeState = reactive({
      allDxMainCodes: <Array<DXMainCodeResponse>>[],
      currentDxMainCode: {} as IDXMainCode,
      expanded: false,
      dxMainCode: null,
      error: false,
    });

    const controller = DxMainCodeController.getInstance(state);
    const mediator = SettingsMediator.getInstance();
    mediator.add(controller);
    const store: IStoreSettings = mediator.getStore();
    const form = ref<QForm>();

    return {
      state,
      icons: IconSVG.getInstance(),
      store,
      form,
      required,
      async clearDxMainCode() {
        await controller.clear();
      },
      async dxMainCodeChanged(val: DXMainCodeResponse) {
        await controller.dxMainCodeChanged(val);
        const store: IStoreSettings = mediator.getStore();
        store.currentDxMainCode = val;
        mediator.notify(store, controller);
      },
      edit() {
        controller.edit();
      },
      add() {
        controller.add();
      },
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        await controller.saveOrUpdate();
      },
    };
  },
});
</script>

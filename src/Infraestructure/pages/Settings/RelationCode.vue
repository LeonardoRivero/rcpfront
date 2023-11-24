<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">
          <q-icon :name="icons.barCodePrice" size="32px" /> Codigo Relacionado
        </div>
        <div class="text-caption text-grey">
          Codigos Relacionados encontrados:
          {{ state.allRelationCodes.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="state.relationCode"
          :options="state.allRelationCodes"
          option-value="id"
          option-label="description"
          map-options
          label="Descripcion"
          :hint="`Codigo Relacionado:  ${
            state.relationCode == undefined ? '' : state.relationCode.code
          }`"
          @update:model-value="(val) => relationCodeChanged(val)"
          @clear="(val) => clearRelationCode()"
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
          v-if="state.relationCode != null"
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
                readonly
                v-model="store.currentSpeciality.description"
                label="Especialidad"
                :rules="[required]"
              />
              <q-input
                dense
                outlined
                readonly
                v-model="store.currentDxMainCode.description"
                label="Codigo Principal"
                :rules="[isNotNull]"
              />
              <q-input
                dense
                outlined
                v-model="state.currentRelationCode.code"
                label="Codigo Relacionado"
                maxlength="10"
                lazy-rules
                :rules="[required]"
              />
              <q-input
                dense
                outlined
                v-model="state.currentRelationCode.description"
                label="Descripcion Codigo Relacionado"
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
import { IRelationCode } from 'src/Domine/ModelsDB';
import { RelationCodeController } from 'src/Adapters';
import { IconSVG } from 'src/Application/Utilities';
import { RelationCodeState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { IStoreSettings } from 'src/Domine/IStores';
import { isNotNull, required } from 'src/Application/Utilities/Helpers';
import 'src/css/app.sass';

export default defineComponent({
  name: 'RelationCodeForm',
  setup() {
    const state: RelationCodeState = reactive({
      allRelationCodes: [],
      currentRelationCode: {
        id: undefined,
        description: '',
        code: '',
        dxmaincode: 0,
      },
      expanded: false,
      relationCode: null,
    });
    const controller = RelationCodeController.getInstance(state);
    const mediator = SettingsMediator.getInstance();
    mediator.add(controller);
    const store: IStoreSettings = mediator.getStore();
    const form = ref<QForm>();

    return {
      state,
      store,
      icons: IconSVG,
      form,
      required,
      isNotNull,
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
      async clearRelationCode() {
        await controller.clear();
      },
      async relationCodeChanged(val: IRelationCode) {
        await controller.relationCodeChanged(val);
      },
    };
  },
});
</script>

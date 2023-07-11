<template>
  <q-layout view="hHh Lpr lFr">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar> -->
          R.C.P
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above side="left" bordered class="bg-blue-grey-1">
    </q-drawer>
    <q-drawer show-if-above side="right" bordered class="bg-blue-grey-1">
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <div class="q-pa-md q-gutter-sm">
          <div class="text-h6">Cambiar contraseña</div>

          <q-form @submit="confirmChanges" ref="form">
            <q-input
              outlined
              dense
              v-model="state.currentPassword"
              lazy-rules
              :rules="[required]"
              label="Contraseña Actual"
              focus
            />
            <q-input
              outlined
              dense
              v-model="state.newPassword"
              label="Nueva Contraseña"
              lazy-rules
              :rules="[required]"
              focus
            />

            <q-input
              outlined
              dense
              v-model="state.confirmPassword"
              label="Confirmar Contraseña"
              lazy-rules
              :rules="[required]"
              focus
            />

            <div class="text-center text-red">
              {{ labelMessage }}
            </div>
            <div align="right" class="text-primary">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn label="Aceptar" color="primary" type="submit" />
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { UserMediator } from 'src/Infraestructure/Mediators/UserMediator';
import { required } from 'src/Application/Utilities/Helpers';
import { ChangePasswordController } from 'src/Adapters/UserController';
import { ChangePasswordState } from 'src/Domine/IStates';

export default defineComponent({
  name: 'ChangePassword',
  setup() {
    const form = ref<QForm>();
    const labelMessage = ref<string>('');
    const state: ChangePasswordState = reactive({
      newPassword: '',
      currentPassword: '',
      confirmPassword: '',
      visible: true,
    });
    const controller = ChangePasswordController.getInstance(state);
    return {
      required,
      form,
      state,
      labelMessage,
      async confirmChanges() {
        try {
          controller.save();
        } catch (ex) {
          if (ex instanceof EvalError) {
            labelMessage.value = ex.message;
          }
        }
      },
    };
  },
});
</script>

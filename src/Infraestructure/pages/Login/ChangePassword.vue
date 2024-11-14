<template>
  <q-layout>
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> R.C.P </q-toolbar-title>
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
              dense
              v-model="state.currentPassword"
              lazy-rules
              :rules="[required]"
              label="Contraseña Actual"
              focus
              type="password"
            />
            <q-input
              dense
              v-model="state.newPassword"
              label="Nueva Contraseña"
              lazy-rules
              :rules="[required]"
              focus
              :type="isPassword ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPassword = !isPassword"
                />
              </template>
            </q-input>

            <q-input
              dense
              v-model="state.confirmPassword"
              label="Confirmar Contraseña"
              lazy-rules
              :rules="[required]"
              focus
              :type="isConfirmPassword ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isConfirmPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isConfirmPassword = !isConfirmPassword"
                />
              </template>
            </q-input>

            <div class="text-center text-red">
              {{ state.message }}
            </div>
            <div align="right" class="text-primary">
              <q-btn
                label="Cancelar"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
                @click="clear()"
              />
              <q-btn label="Aceptar" color="primary" type="submit" />
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import { QForm } from 'quasar';
  import { required } from 'src/Application/Utilities/Helpers';
  import { IHandleUserState } from 'src/Domine/IPatterns';
  import { ChangePasswordBloc } from 'src/Adapters/ChangePasswordBloc';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { routerInstance } from 'src/boot/globalRouter';

  const form = ref<QForm>();
  const isPassword = ref<boolean>(true);
  const isConfirmPassword = ref<boolean>(true);
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const handleGlobalState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );
  const controller = <ChangePasswordBloc>(
    dependenciesLocator.provideChangePasswordBloc()
  );
  const state = usePlocState(controller);

  async function confirmChanges() {
    const response = await controller.save(handleGlobalState);
    if (!response) return;
    routerInstance.push('/');
  }
  function clear() {
    controller.clear();
  }
</script>

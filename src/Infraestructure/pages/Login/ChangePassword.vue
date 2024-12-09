<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-img src="mercury.svg" alt="Logo" />
          </q-avatar>
          Mercurio
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="row items-center flex flex-center">
        <div class="col-12 col-sm-8 col-md-8 col-lg-8">
          <q-card class="password-reset-card q-pa-lg">
            <q-card-section>
              <q-img
                src="undraw_authentication_re_svpt.svg"
                alt="Logo"
                width="30%"
              />
              <div class="text-h4 text-center">Cambiar contraseña</div>
            </q-card-section>
            <q-card-section>
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
                      :name="
                        isConfirmPassword ? 'visibility_off' : 'visibility'
                      "
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
            </q-card-section>
            <q-card-section class="text-center q-mt-sm">
              <q-btn
                flat
                color="primary"
                label="Volver al inicio de sesión"
                to="/"
              />
            </q-card-section>
          </q-card>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
<style scoped>
  .q-page-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
  }

  .password-reset-card {
    max-width: 400px;
    width: 100%;
    margin: 2rem auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 599px) {
    .password-reset-card {
      margin: 1rem;
      width: calc(100% - 2rem);
    }
  }
</style>

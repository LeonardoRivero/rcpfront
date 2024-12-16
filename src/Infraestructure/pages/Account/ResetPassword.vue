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
              <div class="text-h4 text-center q-mb-md">
                Reestablece tu contraseña
              </div>
            </q-card-section>
            <q-img
              src="undraw_confirmation_re_b6q5.svg"
              alt="Logo"
              width="50%"
            />
            <q-card-section>
              <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
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
                <div class="full-width q-mt-md">
                  <q-btn
                    unelevated
                    color="primary"
                    size="lg"
                    class="full-width"
                    label="Enviar"
                    type="submit"
                  />
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
  import { useRoute } from 'vue-router';
  import { QForm } from 'quasar';
  import { required } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { ResetPasswordBloc } from 'src/Adapters/ResetPasswordBloc';

  const form = ref<QForm>();
  const email = ref<string>('');
  const isPassword = ref<boolean>(true);
  const isConfirmPassword = ref<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <ResetPasswordBloc>(
    dependenciesLocator.provideResetPasswordBloc()
  );
  const state = usePlocState(controller);
  const route = useRoute();
  const userId = route.query.userId || '';
  const token = route.query.token || '';

  async function onSubmit() {
    const isValid = await form.value?.validate();
    if (!isValid) return;
    await controller.resetPassword(String(userId), String(token));
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

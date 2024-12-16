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
                src="undraw_forgot_password_re_hxwm.svg"
                alt="Logo"
                width="50%"
              />
              <h2 class="text-h4 text-center q-mb-md">
                Olvidaste tu Contraseña?
              </h2>
              <p class="text-body1 text-center q-mb-lg">
                Ingresa tu correo electrónico y te enviaremos instrucciones para
                reestablecer tu contraseña.
              </p>
            </q-card-section>
            <q-card-section>
              <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
                <q-input
                  v-model="email"
                  label="Correo electrónico"
                  type="email"
                  :rules="[emailRequired]"
                  rounded
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

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
  import { QForm } from 'quasar';
  import { emailRequired } from 'src/Application/Utilities/Helpers';
  import { ForgetPasswordBloc } from 'src/Adapters/ForgetPasswordBloc';

  const form = ref<QForm>();
  const email = ref<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <ForgetPasswordBloc>(
    dependenciesLocator.provideForgetPasswordBloc()
  );

  async function onSubmit() {
    const isValid = await form.value?.validate();
    if (!isValid) return;
    await controller.send(email.value);
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

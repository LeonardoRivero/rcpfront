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
              <q-img src="undraw_confirm_re_69me.svg" alt="Logo" width="50%" />
              <br />
              <div class="text-h4 text-center q-mb-md">Confirma tu email</div>
              <p class="text-body2 text-center q-mb-md">
                Para habilitar tu cuenta de Mercurio verifica que esta sea tu
                dirección de correo electrónico.
              </p>
            </q-card-section>
            <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <div class="flex justify-center q-gutter-sm">
                  <q-btn
                    label="Verificar correo"
                    type="submit"
                    color="primary"
                    icon="check_circle"
                  />
                </div>
              </q-form>
            </q-card-section>
            <q-card-section class="text-center">
              <small>
                Si no hiciste esta solicitud, ignora este correo electrónico
              </small>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { QForm } from 'quasar';
  import { LoginBloc } from 'src/Adapters/LoginBloc';
  import { inject } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const userId = route.query.userId || '';
  const token = route.query.token || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <LoginBloc>dependenciesLocator.provideLoginBloc();

  async function onSubmit() {
    await controller.confirmEmail(String(userId), String(token));
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
    height: 80vh;
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

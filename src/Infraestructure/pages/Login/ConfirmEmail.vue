<template>
  <q-layout>
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Mercurio
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" bordered class="bg-blue-grey-1">
    </q-drawer>

    <q-drawer show-if-above side="right" bordered class="bg-blue-grey-1">
    </q-drawer>

    <q-page-container>
      <q-page padding class="flex flex-center">
        <q-card class="custom-card">
          <q-card-section>
            <div class="text-h4 text-center q-mb-md">
              Confirma tu dirección de correo electrónico
            </div>
            <p class="text-body2 text-center q-mb-md">
              Para habilitar tu cuenta de Mercurio verifica que esta sea tu
              dirección de correo electrónico.
            </p>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div class="flex justify-center q-gutter-sm">
                <q-btn
                  label="Verificar dirección de correo"
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
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <LoginBloc>dependenciesLocator.provideLoginBloc();

  async function onSubmit() {
    await controller.confirmEmail(String(userId), String(token));
  }
</script>

<style scoped>
  .custom-card {
    border: none;
    box-shadow: none;
  }
</style>

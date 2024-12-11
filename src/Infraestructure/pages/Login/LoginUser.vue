<template>
  <div id="q-app">
    <q-layout view="hHh lpR fFf">
      <q-page-container>
        <q-page class="row no-wrap items-stretch login-page">
          <div
            class="col-12 col-md-6 bg-blue-9 flex flex-center welcome-section"
            v-if="!$q.screen.xs"
          >
            <q-img src="undraw_login_re_4vu2.svg" alt="Logo" />
          </div>
          <div class="col-12 col-md-6 flex flex-center q-pa-md form-section">
            <q-img src="mercury.svg" alt="Logo" width="30%" />
            <br />
            <div class="form-container">
              <h4 class="text-h4 q-mb-md">Iniciar sesión</h4>
              <q-form ref="form" @keyup.enter="login()" class="q-gutter-md">
                <q-input
                  square
                  clearable
                  v-model="state.email"
                  type="email"
                  label="Email"
                  rounded
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input
                  square
                  clearable
                  v-model="state.password"
                  type="password"
                  label="Contraseña"
                  rounded
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
                <!-- <q-input
                  v-if="state.labelMessage != ''"
                  v-model="state.labelMessage"
                >
                  <template v-slot:prepend>
                    <q-icon name="error" />
                  </template>
                </q-input> -->
                <transition
                  appear
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                >
                  <div
                    v-if="hasError"
                    class="text-negative q-mb-md error-message"
                    role="alert"
                  >
                    Credenciales incorrectas. Por favor, inténtalo de nuevo.
                  </div>
                </transition>
                <q-btn
                  rounded
                  color="primary"
                  size="lg"
                  class="full-width"
                  label="Iniciar sesión"
                  @click="login()"
                />
              </q-form>
              <div class="text-center q-mt-sm">
                <!-- ¿No tienes una cuenta? -->
                <a href="/forgetpassword" class="text-primary q-mt-md">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
  import { Loading, QSpinnerCube } from 'quasar';
  import { inject, ref } from 'vue';
  import { QForm } from 'quasar';
  import {
    required,
    emailRequired,
    short,
  } from 'src/Application/Utilities/Helpers';
  import { LoginBloc } from 'src/Adapters/LoginBloc';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { routerInstance } from 'src/boot/globalRouter';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const hasError = ref(false);
  const form = ref<QForm>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <LoginBloc>dependenciesLocator.provideLoginBloc();
  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );

  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  const state = usePlocState(controller);

  // onMounted(async () => {
  //   if (window.location.pathname == '/') return;
  //   const path = window.location.pathname.split('/');
  //   const key: ConfirmEmailRequest = { key: path[2] };
  //   // controller.confirmEmail(key);
  // });

  async function login() {
    const isValid = await form.value?.validate();
    if (!isValid) return;
    Loading.show({ message: 'Cargando datos ...', spinner: QSpinnerCube });
    const response = await controller.login(handleUserState, handleGlobalState);
    Loading.hide();
    if (response == null) {
      hasError.value = true;
      return;
    }

    if (response.isFirstLogin) {
      routerInstance.push('/changepassword');
      return;
    }
    routerInstance.push('/index');
    // const namegroup = response.user.groups[0].name.toString();
  }
</script>

<style scoped>
  .q-page-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    height: 100vh;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .login-page {
    width: calc(100% - 2rem);
    max-width: 1200px;
    margin: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    height: calc(100vh - 2rem);
  }

  .welcome-section,
  .form-section {
    padding: 2rem;
  }

  .form-container {
    width: 100%;
    max-width: 400px;
  }

  @media (min-width: 1024px) {
    .login-page {
      width: calc(100% - 4rem);
      margin: 2rem;
      height: calc(100vh - 4rem);
    }
  }

  @media (max-width: 1023px) {
    .login-page {
      flex-direction: column;
      height: auto;
      min-height: calc(100vh - 2rem);
    }

    .welcome-section,
    .form-section {
      width: 100%;
      flex: 0 0 auto;
    }
  }

  @media (max-width: 599px) {
    .q-page-container {
      height: auto;
      min-height: 100vh;
    }

    .login-page {
      margin: 0;
      width: 100%;
      height: auto;
      min-height: 100vh;
      border-radius: 0;
      box-shadow: none;
    }
  }
</style>

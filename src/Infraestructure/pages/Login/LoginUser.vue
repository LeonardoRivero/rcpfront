<template>
  <div id="q-app">
    <q-layout view="lHh Lpr fff" class="bg-image">
      <q-page
        class="window-height window-width row justify-center items-center"
      >
        <div class="column q-pa-lg">
          <div class="row">
            <q-card
              bordered
              class="shadow-24"
              style="width: 400px; height: 540px"
            >
              <q-card-section class="bg-blue-7">
                <h4 class="text-h5 text-white q-my-md">Bienvenido</h4>
              </q-card-section>
              <q-card-section>
                <q-form
                  class="q-px-sm q-pt-xl"
                  ref="form"
                  @keyup.enter="login()"
                >
                  <q-input
                    square
                    clearable
                    v-model="state.email"
                    type="email"
                    lazy-rules
                    :rules="[required, emailRequired, short]"
                    label="Email"
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
                    lazy-rules
                    :rules="[required, short]"
                    label="Contraseña"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                  <q-item-section>
                    <q-item-label class="text-center text-red">
                      {{ state.labelMessage }}
                    </q-item-label>
                  </q-item-section>
                </q-form>
              </q-card-section>
              <q-card-actions class="q-px-lg">
                <q-btn
                  unelevated
                  size="lg"
                  color="secondary"
                  class="full-width text-white"
                  label="Ingresar"
                  @click="login()"
                />
              </q-card-actions>
              <q-card-section class="text-center q-pa-sm">
                <p class="text-grey-6">Olvidaste tu contraseña?</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-layout>
  </div>
</template>
<script setup lang="ts">
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

  const form = ref<QForm>();
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
    const response = await controller.login(handleUserState, handleGlobalState);

    if (response == null) {
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
<style>
  .bg-image {
    background-image: url('../pngwing.com.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right;
  }
</style>

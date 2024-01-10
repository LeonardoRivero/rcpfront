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
                <q-form class="q-px-sm q-pt-xl" ref="form">
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
                  @click="login()"
                  class="full-width text-white"
                  label="Ingresar"
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
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { UserMediator } from 'src/Infraestructure/Mediators/UserMediator';
import {
  required,
  emailRequired,
  short,
  noSpaces,
} from 'src/Application/Utilities/Helpers';
import { IKeyEmailRegistration } from 'src/Domine/ModelsDB';
import { LoginState } from 'src/Domine/IStates';
import { LoginController } from 'src/Adapters/LoginController';
import { IFactoryMethodNotifications } from 'src/Domine/IPatterns';
import container from 'src/inversify.config';

export default defineComponent({
  name: 'LoginUser',
  setup() {
    const form = ref<QForm>();
    const state: LoginState = reactive({
      email: '',
      password: '',
      labelMessage: '',
    });
    const factoryNotificator =
      container.get<IFactoryMethodNotifications>('FactoryNotifactors');
    const controller = new LoginController(state, factoryNotificator);
    controller.setMediator(UserMediator.getInstance());

    onMounted(async () => {
      if (window.location.pathname == '/') return;
      const path = window.location.pathname.split('/');
      const key: IKeyEmailRegistration = { key: path[2] };
      controller.confirmEmail(key);
    });
    return {
      required,
      short,
      emailRequired,
      noSpaces,
      state,
      async login() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        await controller.login();
        // const namegroup = response.user.groups[0].name.toString();
      },
      // async register() {
      //   const isValid = await form.value?.validate();
      //   if (isValid == false) return;
      //   user = {
      //     username: state.username,
      //     email: state.email,
      //     password: state.password,
      //     repassword: state.repassword,
      //   };
      //   await controller.register(user);
      // },
      // switchTypeForm() {
      //   form.value?.reset();
      //   controller.clear();
      //   btnLabel.value = state.register ? 'Registrar' : 'Ingresar';
      // },
      // switchVisibility(val: string) {
      //   console.log({ val });
      //   state.visibility = !state.visibility;
      //   state.passwordFieldType = state.visibility ? 'text' : 'password';
      //   state.visibilityIcon = state.visibility
      //     ? 'visibility_off'
      //     : 'visibility';
      // },
      form,
      // repassword,
      // btnLabel,
    };
  },
});
</script>
<style>
.bg-image {
  background-image: url('../pngwing.com.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;
}
</style>

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
                    v-model="email"
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
                    v-model="password"
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
                      {{ labelMessage }}
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
import { defineComponent, onMounted, ref } from 'vue';
import { QForm } from 'quasar';
import { routerInstance } from 'src/boot/globalRouter';
import { storeToRefs } from 'pinia';
import {
  UserMediator,
  useStoreUser,
} from 'src/Infraestructure/Mediators/UserMediator';
import { UserService } from 'src/Application/Services/UserService';
import { login } from 'src/Domine/types';
import {
  ContextUser,
  DoctorStrategy,
  SecretaryStrategy,
} from 'src/Domine/StrategyUser';
import { Notificator, StrategyUser } from 'src/Domine/IPatterns';
import {
  required,
  emailRequired,
  short,
  noSpaces,
} from 'src/Application/Utilities/Helpers';
import { IKeyEmailRegistration } from 'src/Domine/ModelsDB';
import HttpStatusCode from 'src/Application/Utilities/HttpStatusCodes';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';

export default defineComponent({
  name: 'LoginUser',
  setup() {
    const form = ref<QForm>();
    const email = ref<string>('');
    const password = ref<string>('');
    const labelMessage = ref<string>('');
    const userService = new UserService();
    const profilesUser: Record<string, StrategyUser> = {
      Secretaria: new SecretaryStrategy(),
      Doctor: new DoctorStrategy(),
    };
    const notifySweetAlert: Notificator =
      FactoryNotifactors.getInstance().createNotificator('drawAttention');

    onMounted(async () => {
      if (window.location.pathname == '/') return;
      const path = window.location.pathname.split('/');
      const key: IKeyEmailRegistration = { key: path[2] };
      const response = await userService.confirmEmailRegistration(key);
      if (response.status != HttpStatusCode.OK) {
        notifySweetAlert.setType('error');
        await notifySweetAlert.show(
          undefined,
          'No fue posible verificar su email.'
        );
        return;
      }
      notifySweetAlert.setType('success');
      notifySweetAlert.show(undefined, 'Email verificado correctamente');
    });
    return {
      required,
      // diffPassword(val: string) {
      //   return password.value == repassword.value || 'Password no coinciden!';
      // },
      short,
      emailRequired,
      noSpaces,
      async login() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        const payload: login = {
          email: email.value,
          password: password.value,
        };
        const response = await userService.login(payload);
        console.log(response);
        if (response == null) {
          labelMessage.value =
            'Email o contraseña incorrecta. Intentelo de nuevo o comuniquise con el administrador del sistema';
          return;
        }
        // const namegroup = response.user.groups[0].name.toString();
        const namegroup = 'Secretaria';
        const strategy = profilesUser[namegroup];
        const contextUser = ContextUser.getInstance(strategy);
        contextUser.setUserData(response.user);
        await contextUser.execute();
        const { isAuthenticated } = storeToRefs(useStoreUser());
        isAuthenticated.value = true;
        routerInstance.push('/index');
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
      email,
      password,
      labelMessage,
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

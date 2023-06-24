<template>
  <!-- <div class="container">
    <q-form @submit="sendConfirmation()">
      <q-btn label="Confirmar Email" type="submit" color="primary" />
    </q-form>
    <transition
      enter-active-class="animated zoomInDown"
      leave-active-class="animated zoomOut"
    >
      <q-banner :class="classBanner" v-show="show">
        Unfortunately, the credit card did not go through, please try again.
        <template v-slot:action>
          <q-btn flat color="white" label="Dismiss" />
          <q-btn flat color="white" label="Update Credit Card" />
        </template>
      </q-banner>
    </transition>
  </div> -->
  <q-layout view="hHh lpR fFf" class="bg-image">
    <q-header elevated class="bg-brand text-white">
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page class="window-height window-width row justify-center items-center">
      <q-page-container class="q-pa-md">
        <!-- <div class="column q-pa-lg">
          <div class="row">
            <q-card
              style="
                background: radial-gradient(circle, #12a2ff 0%, #010a20 100%);
                width: 70vh;
                height: 70vh;
              "
            >
              <q-card-section>
                <div class="text-h6">Verificacion de Email</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </q-card-section>

              <q-separator inset />

              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </q-card-section>
            </q-card>
          </div>
        </div> -->
      </q-page-container>
    </q-page>
    <q-footer elevated class="bg2-brand text-black">
      <q-toolbar>
        <q-toolbar-title> 2023 Milena Rojas Fonseca </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { UserService } from 'src/Application/Services/UserService';
import { IKeyEmailRegistration } from 'src/Domine/ModelsDB';
import HttpStatusCode from 'src/Application/Utilities/HttpStatusCodes';
import { Notificator } from 'src/Domine/IPatterns';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';

export default defineComponent({
  name: 'ContactUs',
  setup() {
    const service = new UserService();
    const show = ref<boolean>(false);
    const classBanner = ref<string>('');
    const classSuccess = 'bg-primary text-white';
    const classError = 'bg-red text-white';
    const notifySweetAlert: Notificator =
      FactoryNotifactors.getInstance().createNotificator('sweetAlert');
    onMounted(async () => {
      const key: IKeyEmailRegistration = { key: window.location.pathname };
      const response = await service.confirmEmailRegistration(key);
      if (response.status == HttpStatusCode.OK) {
        notifySweetAlert.setType('error');
        notifySweetAlert.show(undefined, 'No fue posible verificar su email.');
        return;
      }
      notifySweetAlert.setType('success');
      notifySweetAlert.show(undefined, 'Email verificado correctamente');
    });
    return {
      async sendConfirmation() {
        console.log('ok');
        const key: IKeyEmailRegistration = { key: window.location.pathname };
        const response = await service.confirmEmailRegistration(key);
        // classBanner.value =
        //   response.status != HttpStatusCode.OK ? classError : classSuccess;
        classBanner.value = classSuccess;
        show.value = !show.value;
      },
      show,
      classBanner,
    };
  },
});
</script>
<style>
.bg-image {
  background-image: url(https://static.vecteezy.com/system/resources/previews/008/715/514/original/wallpaper-with-blue-button-sending-email-concept-3d-background-with-copy-space-vector.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
.bg-brand {
  background: #2b2a4c !important;
}
.bg2-brand {
  background: #eee2de !important;
}
</style>

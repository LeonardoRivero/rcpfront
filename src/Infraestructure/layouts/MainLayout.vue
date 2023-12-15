<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title v-if="!$q.screen.xs">
          Registro Clinico de Pacientes
        </q-toolbar-title>
        <div>R.C.P Version(Beta)</div>
        <q-space v-if="$q.screen.xs" />
        <q-btn dense flat no-wrap>
          <q-avatar color="white" text-color="primary">{{
            initialLetters
          }}</q-avatar>
          <q-icon name="arrow_drop_down" size="16px" />

          <q-menu auto-close>
            <q-list dense>
              <q-item class="GL__menu-link-signed-in">
                <q-item-section>
                  <div>
                    <strong>{{ name }}</strong>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable class="GL__menu-link-status">
                <q-item-section>
                  <div>
                    <q-icon name="tag_faces" color="blue-9" size="18px" />
                    Set your status
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable class="GL__menu-link">
                <q-item-section>Perfil</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable class="GL__menu-link">
                <q-item-section>Configuracion</q-item-section>
              </q-item>
              <q-item @click="logout()" clickable class="GL__menu-link">
                <q-item-section>Cerrar Sesion</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <q-img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0xHovWAQLBx7HGcdVg6RfZoDtXc9YVMrYHw&usqp=CAU"
        /></q-item-label>
        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
        <MenuTree />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
// import EssentialLink from 'src/Infraestructure/components/EssentialLink.vue';
import { ContextUser } from 'src/Domine/StrategyUser';
import { UserService } from 'src/Application/Services/UserService';
import { routerInstance } from 'src/boot/globalRouter';
import {
  UserMediator,
  useStoreUser,
} from 'src/Infraestructure/Mediators/UserMediator';
import MenuTree from './MenuTree.vue';
import { IStoreUser } from 'src/Domine/IStores';
// const linksList = [
//   {
//     title: 'Inicio',
//     caption: 'Inicio R.C.P',
//     icon: 'home',
//     link: '/index',
//   },
//   {
//     title: 'Pacientes',
//     caption: 'Gestion Pacientes',
//     icon: 'mdi-human-wheelchair',
//     link: '/patient',
//   },
//   {
//     title: 'Agenda',
//     caption: 'Administra Agenda',
//     icon: 'mdi-calendar',
//     link: '/schedule',
//   },
//   {
//     title: 'Citas',
//     caption: 'Gestiona Citas Pacientes',
//     icon: 'mdi-calendar-multiple-check',
//     link: '/appointment',
//   },
//   {
//     title: 'Historia Clinica',
//     caption: 'Gestiona Historia Pacientes',
//     icon: 'mdi-notebook',
//     link: '/clinichistory',
//   },
//   {
//     title: 'Configuraciones',
//     caption: 'Configuraciones Generales',
//     icon: 'mdi-cog',
//     link: '/settings',
//   },
// ];

export default defineComponent({
  name: 'MainLayout',

  components: { MenuTree },

  setup() {
    const leftDrawerOpen = ref(false);
    const contextUser = ContextUser.getInstance();
    const storePermissions = contextUser.getStore();
    const name =
      storePermissions.userData.first_name == '' ? 'Carmen' : 'Carmen';
    const last_name =
      storePermissions.userData.last_name == '' ? 'Arenas' : 'Arenas';
    const initialLetters: string = name.charAt(0).concat(last_name.charAt(0));
    const userService = new UserService();
    return {
      initialLetters,
      name,
      // essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      async logout() {
        await userService.logout();
        // const store = useStoreUser();
        // const { isAuthenticated } = storeToRefs(store);
        // isAuthenticated.value = false;
        const mediator = UserMediator.getInstance();
        const userStore = <IStoreUser>mediator.getStore();
        userStore.isAuthenticated = false;
        routerInstance.push('/');
      },
    };
  },
});
</script>
<style>
body {
  background: #f1f1f1 !important;
}
</style>

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
            handleUserState.store.initialLetters
          }}</q-avatar>
          <q-icon name="arrow_drop_down" size="16px" />

          <q-menu auto-close>
            <q-list dense>
              <q-item class="GL__menu-link-signed-in">
                <q-item-section>
                  <div>
                    <strong>{{ handleUserState.store.userName }}</strong>
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

<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { routerInstance } from 'src/boot/globalRouter';
  import MenuTree from './MenuTree.vue';
  import { IHandleUserState } from 'src/Domine/IPatterns';

  const leftDrawerOpen = ref<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );

  // const initialLetters: string = 'C'.concat('A');
  const initialLetters = ref<string>('');
  const name = ref<string>('');

  onMounted(async () => {
    name.value = handleUserState.store.userName;
    initialLetters.value = handleUserState.store.initialLetters;
    // const infoUser = handleUserState.getInfoUser();
    // name.value = infoUser.userId;
    // const nameSplitted = infoUser.userId.split(' ');
    // initialLetters.value = nameSplitted
    //   .map((element) => element[0].toUpperCase())
    //   .join('');
  });

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }
  async function logout() {
    // await CreateUser.logout();
    // const store = useStoreUser();
    // const { isAuthenticated } = storeToRefs(store);
    // isAuthenticated.value = false;
    // const mediator = UserContext.getInstance();
    // const userStore = <IStoreUser>mediator.getStore();
    // userStore.isAuthenticated = false;
    routerInstance.push('/');
  }
</script>
<style>
  body {
    background: #ffffff !important;
  }
</style>

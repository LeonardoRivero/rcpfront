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
        <q-toolbar-title> Registro Clinico de Pacientes </q-toolbar-title>
        <div>R.C.P Version(Beta)</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <q-img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0xHovWAQLBx7HGcdVg6RfZoDtXc9YVMrYHw&usqp=CAU"
        /></q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'src/Infraestructure/components/EssentialLink.vue';

const linksList = [
  {
    title: 'Inicio',
    caption: 'Inicio R.C.P',
    icon: 'home',
    link: '/index',
  },
  {
    title: 'Pacientes',
    caption: 'Gestion Pacientes',
    icon: 'mdi-human-wheelchair',
    link: '/patient',
  },
  {
    title: 'Agenda',
    caption: 'Administra Agenda',
    icon: 'mdi-calendar',
    link: '/schedule',
  },
  {
    title: 'Citas',
    caption: 'Gestiona Citas Pacientes',
    icon: 'mdi-calendar-multiple-check',
    link: '/appointment',
  },
  {
    title: 'Historia Clinica',
    caption: 'Gestiona Historia Pacientes',
    icon: 'mdi-notebook',
    link: '/clinichistory',
  },
  {
    title: 'Configuraciones',
    caption: 'Configuraciones Generales',
    icon: 'mdi-cog',
    link: '/settings',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
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

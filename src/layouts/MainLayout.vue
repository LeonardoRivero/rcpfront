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
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Inicio',
    caption: 'Inicio R.C.P',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Citas',
    caption: 'Gestiona Citas Pacientes',
    icon: 'mdi-calendar-multiple-check',
    link: '/appointment',
  },
  {
    title: 'Agenda',
    caption: 'Administra Agenda',
    icon: 'mdi-calendar',
    link: '/schedule',
  },
  {
    title: 'Pacientes',
    caption: 'Gestion Pacientes',
    icon: 'mdi-human-wheelchair',
    link: '/patient',
  },
  // {
  //   title: 'Twitter',
  //   caption: '@quasarframework',
  //   icon: 'rss_feed',
  //   link: 'https://twitter.quasar.dev',
  // },
  // {
  //   title: 'Facebook',
  //   caption: '@QuasarFramework',
  //   icon: 'public',
  //   link: 'https://facebook.quasar.dev',
  // },
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
/* .q-drawer {
  background-image: url('/statics/images/lake.jpg') !important;
  background-size: cover !important;
} */
/* .drawer_normal {
  background-color: rgba(1, 1, 1, 0.75);
}
.drawer_dark {
  background-color: #010101f2;
}
.navigation-item {
  border-radius: 5px;
}
.tab-active {
  background-color: green;
} */
body {
  background: #f1f1f1 !important;
}
/* .header_normal {
  background: linear-gradient(
    145deg,
    rgb(32, 106, 80) 15%,
    rgb(21, 57, 102) 70%
  );
}
.header_dark {
  background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
} */
</style>

<template>
  <q-list>
    <q-item clickable tag="a" link to="/index">
      <q-item-section avatar>
        <q-icon name="home" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ 'Inicio' }}</q-item-label>
        <q-item-label caption>{{ 'Inicio R.C.P' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable tag="a" link to="/patient">
      <q-item-section avatar>
        <q-icon name="mdi-human-wheelchair" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ 'Pacientes' }}</q-item-label>
        <q-item-label caption>{{ 'Gestion Pacientes' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable tag="a" link to="/schedule">
      <q-item-section avatar>
        <q-icon name="mdi-calendar" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ 'Agenda' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-expansion-item
      :content-inset-level="0.5"
      :icon="icons.schedule_single"
      label="Admisiones"
      caption="Admisiones citas"
    >
      <!-- <q-item clickable tag="a" link to="/appointment/list">
        <q-item-section avatar>
          <q-icon name="mdi-calendar-multiple-check" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ 'Listado' }}</q-item-label>
        </q-item-section>
      </q-item> -->
      <q-item clickable tag="a" link to="/appointment">
        <q-item-section avatar>
          <q-icon :name="icons.scheduleCalendar" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ 'Admisiones' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- <q-item clickable tag="a" link to="/clinichistory">
      <q-item-section avatar>
        <q-icon name="mdi-notebook" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ 'Historia Clinica' }}</q-item-label>
        <q-item-label caption>{{ 'Gestiona Historia Pacientes' }}</q-item-label>
      </q-item-section>
    </q-item> -->

    <!-- <q-item clickable tag="a" link to="/settings">
      <q-item-section avatar>
        <q-icon name="mdi-cog" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ 'Configuraciones' }}</q-item-label>
        <q-item-label caption>{{ 'Configuraciones Generales' }}</q-item-label>
      </q-item-section>
    </q-item> -->
  </q-list>
  <q-list v-if="canAccessAdmin || canAccessDoctor">
    <q-expansion-item
      v-for="item in menuItems"
      :key="item.label"
      :icon="item.icon"
      :label="item.label"
      :caption="item.caption"
      expand-separator
    >
      <q-list v-if="item.children">
        <q-item
          v-for="child in item.children"
          :key="child.label"
          v-ripple
          clickable
          link
          :to="child.linkTo"
        >
          <q-item-section avatar>
            <q-icon :name="child.icon" />
          </q-item-section>
          <q-item-section>{{ child.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
  import { IconSVG } from 'src/Application/Utilities';
  import { IHandleUserState } from 'src/Domine/IPatterns';
  import { GroupUser } from 'src/Domine/Types';
  import { inject, ref } from 'vue';
  const menuItems = ref([
    {
      icon: 'settings',
      label: 'Configuración',
      caption: 'Preferencias del sistema',
      children: [
        { icon: 'person', label: 'Usuarios', linkTo: 'users' },
        { icon: 'place ', label: 'Consultorio', linkTo: 'medicaloffice' },
        // { icon: 'notifications', label: 'Notificaciones' },
      ],
    },
  ]);
  const icons = IconSVG;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );
  const isAuthenticated = handleUserState.store.isAuthenticated;
  const userRoles = handleUserState.store.token.roles;
  const canAccessAdmin = isAuthenticated && userRoles.includes(GroupUser.ADMIN);
  const canAccessDoctor =
    isAuthenticated && userRoles.includes(GroupUser.DOCTOR);
  const canAccessViewer = isAuthenticated && userRoles.includes('viewer');
</script>

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

    <!-- <q-item clickable tag="a" link to="/schedule">
      <q-item-section avatar>
        <q-icon name="mdi-calendar" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ 'Agenda' }}</q-item-label>
      </q-item-section>
    </q-item> -->

    <!-- <q-expansion-item
      :content-inset-level="0.5"
      :icon="icons.schedule_single"
      label="Citas"
      caption="Administra Citas"
    >
      <q-item clickable tag="a" link to="/appointment/list">
        <q-item-section avatar>
          <q-icon name="mdi-calendar-multiple-check" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ 'Listado' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable tag="a" link to="/appointment">
        <q-item-section avatar>
          <q-icon :name="icons.calendar_plus" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ 'Registrar' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item> -->

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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconSVG } from 'src/Application/Utilities/Constants';
export default defineComponent({
  setup() {
    return {
      icons: IconSVG,
    };
  },
});
</script>

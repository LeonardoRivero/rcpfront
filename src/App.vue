<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useIdle } from '@vueuse/core';
import { routerInstance } from 'src/boot/globalRouter';
// import container from './inversify.config';
import { dependenciesLocator } from './Infraestructure/DependenciesLocator';

export default defineComponent({
  name: 'App',
  setup() {
    const { idle, lastActive } = useIdle(20 * 60 * 1000);

    watch(idle, (idleValue) => {
      if (idleValue) {
        routerInstance.push('/');
        console.log(lastActive.value);
      }
      console.log(`Triggered ${lastActive.value} times`, idle.value);
    });
  },
  provide: {
    // containerInversify: container,
    infoPatientPanelBloc: dependenciesLocator.provideInfoPatientPanelPloc(),
    preliminaryDataBloc: dependenciesLocator.providePreliminaryDataBloc(),
    scheduleFormBloc: dependenciesLocator.provideScheduleBloc(),
    dependenciesLocator: dependenciesLocator,
  },
});
</script>

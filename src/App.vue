<template>
  <router-view />
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { useIdle } from '@vueuse/core';
  import { routerInstance } from 'src/boot/globalRouter';
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
      // AppointmentBloc: dependenciesLocator.provideAppointmentBloc(), // esto se deberia sacar de aca
      // scheduleFormBloc: dependenciesLocator.provideScheduleBloc(), // esto se deberia sacar de aca
      dependenciesLocator: dependenciesLocator,
    },
  });
</script>

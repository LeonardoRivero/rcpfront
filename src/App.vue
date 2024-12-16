<template>
  <router-view />
</template>

<script lang="ts" setup>
  import { provide, watch } from 'vue';
  import { useIdle } from '@vueuse/core';
  import { routerInstance } from 'src/boot/globalRouter';
  import { dependenciesLocator } from './Infraestructure/DependenciesLocator';
  import { StoreGeneric } from 'pinia';

  // Usando useIdle de VueUse
  const { idle, lastActive } = useIdle(20 * 60 * 1000);
  const handleGlobalState = dependenciesLocator.provideHandleGlobalState();

  // Reaccionando al cambio de idle
  watch(idle, (idleValue) => {
    if (idleValue) {
      routerInstance.push('/');
      console.log(lastActive.value);
      const store = handleGlobalState.store as unknown as StoreGeneric;
      store.$reset();
    }
    console.log(`Triggered ${lastActive.value} times`, idle.value);
  });

  // Proveemos las dependencias en el contexto del componente
  // Dependencias comentadas ya que parece que deberían sacarse del `provide`
  // Si necesitas exponer algo globalmente, puedes hacerlo con defineExpose o con provide
  provide('dependenciesLocator', dependenciesLocator);
</script>

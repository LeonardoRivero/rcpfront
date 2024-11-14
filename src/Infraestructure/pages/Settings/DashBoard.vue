<template>
  <div class="q-pa-md row justify-center">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="col-12 col-sm-6 col-md-4"
    >
      <q-card class="my-card">
        <q-img
          :src="image.src"
          :ratio="16 / 9"
          @click="redirect(image.path)"
          style="max-width: 500px; cursor: pointer"
          fit="cover"
        >
          <div class="absolute-bottom text-subtitle2 text-center">
            {{ image.caption }}
          </div>
        </q-img>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { routerInstance } from 'src/boot/globalRouter';
  import { ref } from 'vue';
  const url = ref('https://picsum.photos/500/300');
  url.value = 'https://picsum.photos/500/300?t=' + Math.random();
  const images = ref([
    {
      src: url,
      caption: 'Consultorios',
      path: 'medicaloffice',
    },
    {
      src: url,
      caption: 'Usuarios',
      path: 'users',
    },
  ]);

  function redirect(path: string) {
    routerInstance.push(path);
  }
</script>

<style scoped>
  .my-card {
    width: 100%;
    max-width: 400px;
  }
</style>

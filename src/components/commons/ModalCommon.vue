<template>
  <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-dialog v-model="visible" persistent>
        <q-card class="my-card">
          <q-card-section class="row items-center q-pb-none">
            <q-avatar icon="mdi-information" color="white" text-color="black" />
            <div class="text-h6">{{ title }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            {{ objetToShow }}
          </q-card-section>
          <q-card-actions align="right">
            <div v-if="redirect">
              <q-btn label="Aceptar" color="primary" @click="confirmRedirect" />
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import modalService from 'src/services/ModalService';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ModalCommon',
  setup() {
    const router = useRouter();
    // let card = ref(true);
    const { title, visible, redirect, urlToRedirect, objetToShow } =
      modalService();
    function confirmRedirect() {
      visible.value = false;
      router.push(urlToRedirect.value);
    }
    return {
      // card,
      confirmRedirect,
      title,
      visible,
      redirect,
      urlToRedirect,
      objetToShow,
    };
  },
});
</script>

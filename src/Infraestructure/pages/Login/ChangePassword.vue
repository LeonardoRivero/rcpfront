<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="address"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add address" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { UserMediator } from 'src/Infraestructure/Mediators/UserMediator';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ChangePassword',
  setup() {
    return {
      address: ref<string>(''),
      prompt: ref<boolean>(true),
    };
  },
});
</script>

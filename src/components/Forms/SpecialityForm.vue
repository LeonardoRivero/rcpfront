<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="validate" class="q-gutter-md" ref="myForm">
      <q-input
        outlined
        v-model="description"
        label="Descripcion"
        hint="Descripcion Entidad"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Descripcion es requerida',
        ]"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { QForm } from 'quasar';
import { ref } from 'vue';

export default {
  setup() {
    const myForm = ref<QForm | null>(null);
    const description = ref(null);

    return {
      description,
      myForm,
      async validate() {
        let validForm = await myForm.value?.validate();
        if (validForm) {
          // yay, models are correct
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      },
    };
  },
};
</script>

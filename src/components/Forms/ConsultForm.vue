<template>
  <q-page>
    <div>
      <q-card class="my-card">
        <!-- <q-img
        src="https://t3.ftcdn.net/jpg/02/44/58/20/360_F_244582094_BTflxzaxlNDHk250JiOaPwAeC4487ns8.jpg"
      /> -->

        <q-card-section>
          <div class="text-black">
            <q-input
              v-model="identificationPatient"
              label="Nº Documento paciente"
              clearable
              dense
              type="number"
              @keydown.enter.prevent="searchPatient"
              lazy-rules
              :rules="[(val) => val > 0 || 'Numero invalido']"
            ></q-input>
            <q-btn
              fab
              color="primary"
              icon="search"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%)"
              @click="searchPatient"
            />
          </div>

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">FOSCAL</div>
            <div
              class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
            >
              <q-icon name="place" />
              250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">$・Italian, Cafe</div>
          <div class="text-caption text-grey">
            Small plates, salads & sandwiches in an intimate setting.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Reserve" />
          <q-btn v-close-popup flat color="primary" round icon="event" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    let card = ref(true);
    return {
      card,
    };
  },
});
</script>

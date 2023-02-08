<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <ClinicHistory />
      </div>
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <!-- <q-card class="bg-grey-2">
          <q-card-section class="text-center text-h6 text-black">
            <q-icon name="shopping_cart" class="q-mr-sm" />
            Order Summary
          </q-card-section>
          <q-card-section horizontal>
            <q-card-section class="col-5 flex flex-center">
              <q-img
                height="80px"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/parallax2.jpg"
              />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-sm">Product 1</div>
              <div class="text-subtitle2 q-mb-xs">$10.99</div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal class="q-pa-none">
            <q-card-section class="col-5 flex flex-center">
              <q-img
                height="80px"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/parallax2.jpg"
              />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-md">Product 2</div>
              <div class="text-subtitle2 q-mb-xs">$19.99</div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal class="q-pa-none">
            <q-card-section class="col-5 flex flex-center">
              <q-img
                height="80px"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/parallax2.jpg"
              />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-md">Product 3</div>
              <div class="text-subtitle2 q-mb-xs">$78.99</div>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal class="q-pa-none">
            <q-card-section class="col-5 flex flex-center">
              <q-img
                height="80px"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/parallax2.jpg"
              />
            </q-card-section>
            <q-card-section class="">
              <div class="text-subtitle2 q-mt-md">Product 4</div>
              <div class="text-subtitle2 q-mb-xs">$178.99</div>
            </q-card-section>
          </q-card-section>

          <q-separator></q-separator>
          <q-card-section class="row">
            <div class="col-12 text-h6 full-width">
              <div class="float-right q-mr-md">
                Total : <span class="text-blue">$288.96</span>
              </div>
            </div>
          </q-card-section>
        </q-card> -->
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ClinicHistory from './ClinicHistoryForm.vue';
import 'src/css/app.sass';
export default defineComponent({
  components: { ClinicHistory },
});
</script>

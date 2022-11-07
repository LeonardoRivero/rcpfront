<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card class="rounded-borders">
          <q-card-section>
            <div class="text-h6">Datos del Paciente:</div>
          </q-card-section>
          <q-separator inset></q-separator>
          <!-- <div class="row">
            <div class="col-6 offset-6">
              <q-item>
                <q-input
                  dense
                  type="number"
                  outlined
                  v-model="identificationPatient"
                  @keydown.enter.prevent="searchPatient"
                  label="N° Identificacion"
                  lazy-rules
                  :rules="[(val) => val > 0 || 'Numero invalido']"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      round
                      dense
                      icon="search"
                      class="q-mr-xs"
                      @click="searchPatient"
                    />
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Verificar Paciente
                    </q-tooltip></template
                  >
                </q-input>
              </q-item>
            </div>
          </div> -->

          <q-card-section horizontal>
            <q-card-section class="col-7 q-pt-xs">
              <!-- <div class="text-h6 text-center">Shipping</div> -->
              <div class="text-weight-bolder text-italic">
                <q-badge color="primary" label="Nombre Completo:" />
                {{ currentPatient.name }} {{ currentPatient.lastName }}
              </div>
              <div class="text-subtitle1">
                <q-badge color="primary" label="Telefono/Celular: " />
                {{ currentPatient.phoneNumber }}
              </div>
              <div class="text-subtitle1">
                <q-badge color="primary" label="Correo Electronico: " />
                {{ currentPatient.email }}
              </div>
            </q-card-section>
            <q-card-section class="col-5 q-pt-xs">
              <q-input
                dense
                type="number"
                outlined
                v-model="identificationPatient"
                @keydown.enter.prevent="searchPatient"
                label="N° Identificacion"
                lazy-rules
                :rules="[(val) => val > 0 || 'Numero invalido']"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    round
                    dense
                    icon="search"
                    class="q-mr-xs"
                    @click="searchPatient"
                  />
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Verificar Paciente
                  </q-tooltip></template
                >
              </q-input>
              <q-badge color="primary" :label="`Edad: ${6}`" />
              <div class="text-subtitle1 q-mb-xs">Card type - Visa</div>
              <div class="text-subtitle1 q-mb-xs">
                Card holder - P***ik Patel
              </div>
              <div class="text-subtitle1 q-mb-xs">
                Card Number - xxxx-xxxx-xxxx-1234
              </div>
              <div class="text-subtitle1 q-mb-xs">Expiry date - 04/2012</div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <!-- <div class="row">
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="address_detail.first_name"
                label="Nombres Paciente *"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="address_detail.last_name"
                label="Apellidos Paciente *"
              />
            </q-item>
          </div>
          <div class="col-12">
            <q-item>
              <q-input
                dense
                autogrow
                outlined
                v-model="address_detail.address_line_1"
                class="full-width"
                label="Address line 1 *"
              />
            </q-item>
          </div>
          <div class="col-12">
            <q-item>
              <q-input
                dense
                autogrow
                outlined
                v-model="address_detail.address_line_2"
                class="full-width"
                label="Address line 2 *"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="address_detail.city"
                label="City *"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="address_detail.state"
                label="State"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="address_detail.zip_code"
                label="Zip Code"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="address_detail.country"
                label="Country *"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-checkbox
                dense
                outlined
                class="full-width"
                v-model="address_detail.checkbox"
                label="Use this address for payment details"
              />
            </q-item>
          </div>
        </div> -->
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="bg-grey-2">
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
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { clinicHistoryService } from 'src/services/ClinicHistoryService';
export default defineComponent({
  setup() {
    const { searchPatient, identificationPatient, currentPatient } =
      clinicHistoryService();
    return {
      searchPatient,
      identificationPatient,
      currentPatient,
    };
  },
});
</script>

<style scoped></style>

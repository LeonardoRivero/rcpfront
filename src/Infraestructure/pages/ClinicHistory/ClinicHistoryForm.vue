<template>
  <q-page class="q-pa-md bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card class="rounded-borders">
          <q-toolbar class="rounded-borders">
            <div class="text-h5">Datos Paciente:</div>
            <q-space />
            <q-input
              dense
              outlined
              input-class="text-right"
              class="q-ml-md"
              v-model="identificationPatient"
              @keydown.enter.prevent="searchPatient"
              label="N° Identificacion"
              type="number"
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
                </q-tooltip>
              </template>
            </q-input>
          </q-toolbar>
          <q-separator inset></q-separator>

          <q-card-section horizontal>
            <q-avatar :icon="iconAvatar" color="white" size="4rem"></q-avatar>
            <q-card-section class="col-7 q-pt-xs">
              <b>Nombre Completo:</b>
              <div class="text-h6">
                {{ currentPatient.name }}
                {{ currentPatient.lastName }}
              </div>
              <q-separator />
              <b>Telefono/Celular:</b>
              <div>
                {{ currentPatient.phoneNumber }}
              </div>
              <q-separator />
              <b>Correo Electronico:</b>
              <div>
                {{ currentPatient.email }}
              </div>
            </q-card-section>
            <q-card-section class="col-4 q-pt-xs">
              <b>Fecha Nacimiento:</b>
              <div v-if="age != 0">
                {{ currentPatient.dateBirth }} <cite>({{ age }} años)</cite>
              </div>
              <q-separator />
              <b>Entidad :</b>
              <div v-if="currentPatient.insurance != null">
                {{ currentPatient.insurance.nameInsurance }}
              </div>
              <q-separator />
              <b>Fecha Primera Consulta:</b>
            </q-card-section>
          </q-card-section>
        </q-card>
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
import { clinicHistoryService } from 'src/Adapters/ClinicHistoryService';

export default defineComponent({
  setup() {
    const {
      searchPatient,
      identificationPatient,
      currentPatient,
      iconAvatar,
      age,
    } = clinicHistoryService();
    return {
      searchPatient,
      identificationPatient,
      currentPatient,
      iconAvatar,
      age,
    };
  },
});
</script>

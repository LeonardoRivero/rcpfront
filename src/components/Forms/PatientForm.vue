<template>
  <q-page>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="my-card" bordered>
          <q-card-section>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="icon" />
                </q-avatar>
              </q-item-section>
              <div class="text-h4 text_bold">Pacientes</div>
            </q-item>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <div class="text-black">
              <q-toolbar>
                <q-space />
                <q-input
                  v-model="identificationPatient"
                  label="Nº Documento paciente"
                  clearable
                  dense
                  type="number"
                  @keydown.enter.prevent="searchPatient"
                  lazy-rules
                  :rules="[(val) => val > 0 || 'Numero invalido']"
                >
                  <template v-slot:append
                    ><q-btn
                      flat
                      round
                      dense
                      icon="search"
                      class="q-mr-xs"
                      @click="searchPatient"
                    />
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Buscar paciente por N° identificacion
                    </q-tooltip></template
                  ></q-input
                >
              </q-toolbar>
            </div>
            <q-form @submit="confirmChanges" ref="form">
              <q-list>
                <q-item>
                  <q-item-section>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          :readonly="disable"
                          outlined
                          dense
                          v-model="currentPatient.name"
                          label="Nombres *"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) || 'Nombres no validos',
                          ]"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <q-input
                          :readonly="disable"
                          outlined
                          dense
                          v-model="currentPatient.lastName"
                          label="Apellidos *"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) || 'Apellidos no validos',
                          ]"
                        />
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          outlined
                          :readonly="disable"
                          dense
                          type="number"
                          v-model="currentPatient.identification"
                          label="Numero Identificacion *"
                          lazy-rules
                          :rules="[(val) => val > 0 || 'Numero invalido']"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <q-select
                          :readonly="disable"
                          dense
                          clearable
                          outlined
                          v-model="currentPatient.IDType"
                          :options="allIDTypes"
                          option-value="id"
                          option-label="abbreviation"
                          map-options
                          label="Tipo Documento *"
                          :hint="`${
                            currentPatient.IDType == undefined
                              ? ''
                              : currentPatient.IDType.description
                          }`"
                          @update:model-value="(val) => idTypeChanged(val)"
                          :rules="[
                            (val) =>
                              (val && val != null) ||
                              'Tipo documento no valido',
                          ]"
                        >
                        </q-select>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          :readonly="disable"
                          dense
                          outlined
                          v-model="currentPatient.phoneNumber"
                          label="Telefono *"
                          mask="##########"
                          unmasked-value
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) || 'Celular no valido',
                          ]"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <!-- <q-input
                          outlined
                          :readonly="disable"
                          v-model="currentPatient.dateBirth"
                          dense
                          type="date"
                          mask="DD-MM-YYYY"
                          hint="Fecha Nacimiento *"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Fecha Nacimiento es requerida',
                          ]"
                        /> -->
                        <q-input
                          outlined
                          :readonly="disable"
                          v-model="currentPatient.dateBirth"
                          dense
                          label="Fecha Nacimiento *"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Fecha Nacimiento es requerida',
                          ]"
                        >
                          <template v-slot:append>
                            <q-icon name="event">
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  v-model="currentPatient.dateBirth"
                                  today-btn
                                  mask="YYYY-MM-DD"
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn
                                      v-close-popup
                                      label="Cerrar"
                                      color="primary"
                                      flat
                                    />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-select
                          :readonly="disable"
                          dense
                          clearable
                          outlined
                          v-model="currentPatient.insurance"
                          :options="allInsurance"
                          option-value="id"
                          option-label="nameInsurance"
                          map-options
                          label="Entidad *"
                          @update:model-value="(val) => insuranceChanged(val)"
                          :rules="[
                            (val) =>
                              (val && val != null) || 'Entidad es requerida',
                          ]"
                        >
                        </q-select>
                      </div>
                      <div class="col-6 col-md">
                        <q-select
                          :readonly="disable"
                          dense
                          clearable
                          outlined
                          v-model="currentPatient.gender"
                          :options="allGenders"
                          option-value="id"
                          option-label="nameGender"
                          map-options
                          label="Genero *"
                          @update:model-value="(val) => genderChanged(val)"
                          :rules="[
                            (val) =>
                              (val && val != null) || 'Genero es requerido',
                          ]"
                        >
                        </q-select>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-12 col-md">
                        <q-input
                          :readonly="disable"
                          label="Correo electronico"
                          dense
                          v-model="currentPatient.email"
                          type="email"
                          :error="error"
                          @blur="(evt) => isValidEmail(evt.target.value)"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <div>
                  <small>
                    <cite>* = Campos Obligatorios</cite>
                    <q-tooltip anchor="bottom left" self="top left">
                      Los campos marcados con * son obligatorios
                    </q-tooltip>
                  </small>
                </div>
              </q-list>
              <q-card-actions align="right" class="text-teal">
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  icon-right="mdi-content-save"
                />
                <q-btn
                  v-if="disable"
                  color="secondary"
                  icon-right="mdi-pencil"
                  label="Editar"
                  @click="enableEdition"
                  class="q-ml-sm"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { patientService, useStorePatient } from 'src/services/PatientService';
import { IIDType, IHealthInsurance, IGender } from 'src/models/IPatients';
import {
  insuranceService,
  useStoreInsurance,
} from 'src/services/InsuranceService';
import * as Constants from 'src/scripts/Constants';
import 'src/css/app.sass';
import { storeToRefs } from 'pinia';

export default defineComponent({
  setup() {
    const iconSVG = Constants.IconSVG.getInstance();
    const icon = ref('');
    const {
      // patient,
      gender,
      currentPatient,
      currentIDType,
      form,
      allIDTypes,
      idType,
      allGenders,
      insurance,
      // confirmChanges,
      // isValidEmail,
      // idTypeChanged,
      // genderChanged,
      // getAllIDTypes,
      // getAllGenders,
      // searchPatient,
      identificationPatient,
      disable,
      // enableEdition,
      error,
    } = storeToRefs(useStorePatient());
    const { allInsurance } = storeToRefs(useStoreInsurance());
    const service = patientService.getInstance();
    const serviceInsurance = insuranceService.getInstance();

    onMounted(async () => {
      await service.getAllIDTypes();
      await service.getAllGenders();
      await serviceInsurance.getAll();
      icon.value = iconSVG.womanAndMan;
      console.log('object', currentPatient.value);
    });

    return {
      error,
      gender,
      currentPatient,
      currentIDType,
      allInsurance,
      allIDTypes,
      idType,
      insurance,
      form,
      identificationPatient,
      disable,
      allGenders,
      icon,
      confirmChanges() {
        service.processRequest();
      },
      isValidEmail(val: string) {
        service.isValidEmail(val);
      },
      idTypeChanged(val: IIDType) {
        return;
        service.idTypeChanged(val);
      },
      insuranceChanged(val: IHealthInsurance) {
        return;
        serviceInsurance.insuranceChanged(val);
      },
      genderChanged(val: IGender) {
        return;
        service.genderChanged(val);
      },
      searchPatient() {
        service.searchByIdentificacion(identificationPatient.value);
      },
      enableEdition() {
        service.enableEdition();
      },
    };
  },
});
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>

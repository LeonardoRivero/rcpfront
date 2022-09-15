<template>
  <q-page>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="my-card" bordered>
          <q-card-section>
            <div class="text-h4">Pacientes</div>
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
                      @click="searchPatient" /></template
                ></q-input>
              </q-toolbar>
            </div>
            <q-form @submit="confirmChanges" ref="formPatient">
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
                        <q-input
                          outlined
                          :readonly="disable"
                          v-model="currentPatient.dateBirth"
                          dense
                          type="date"
                          mask="DD-MM-YYYY"
                          hint="Fecha Nacimiento *"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) || 'Fecha es requerida',
                          ]"
                        />
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
                          :rules="[isValidEmail]"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <div>Campos Obligatorios *</div>
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

<script>
import { onMounted } from 'vue';
import { patientService } from 'src/services/PatientService';
import { insuranceService } from 'src/services/InsuranceService';
export default {
  setup() {
    const {
      patient,
      gender,
      currentPatient,
      currentIDType,
      formPatient,
      allIDTypes,
      idType,
      allGenders,
      insurance,
      getAllGenders,
      confirmChanges,
      isValidEmail,
      getAllIDTypes,
      idTypeChanged,
      genderChanged,
      searchPatient,
      identificationPatient,
      disable,
      enableEdition,
    } = patientService();
    const { allInsurance, getAllInsurance, insuranceChanged } =
      insuranceService();
    onMounted(async () => {
      await getAllIDTypes();
      await getAllInsurance();
      await getAllGenders();
    });
    return {
      patient,
      gender,
      currentPatient,
      currentIDType,
      allInsurance,
      allIDTypes,
      idType,
      insurance,
      formPatient,
      identificationPatient,
      disable,
      confirmChanges,
      isValidEmail,
      idTypeChanged,
      insuranceChanged,
      genderChanged,
      searchPatient,
      enableEdition,
      allGenders,
    };
  },
};
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
.my-card
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.2)
  transition: all ease 0.2s

.my-card:hover
  transition: all ease 0.2s
  box-shadow: inherit
  box-shadow: 5px 5px 20px 5px rgba(0,0,0,0.3)
</style>

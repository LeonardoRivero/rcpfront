<template>
  <q-page class="q-pa-md">
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
        ></q-input>
        <q-btn
          flat
          round
          dense
          icon="search"
          class="q-mr-xs"
          @click="searchPatient"
        />
      </q-toolbar>
    </div>
    <q-form @submit="confirmChanges" class="q-gutter-md" ref="formPatient">
      <h4>Pacientes</h4>
      <div class="q-gutter-x-md">
        <q-input
          :readonly="disable"
          dense
          v-model="currentPatient.name"
          label="Nombres *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Nombres no validos']"
        />
        <q-input
          :readonly="disable"
          dense
          v-model="currentPatient.lastName"
          label="Apellidos *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Apellidos no validos']"
        />
        <div class="row q-col-gutter-x-md">
          <div class="col-6 col-md">
            <q-input
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
                (val) => (val && val != null) || 'Tipo documento no valido',
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
              :rules="[(val) => (val && val.length > 0) || 'Celular no valido']"
            />
          </div>
          <div class="col-6 col-md">
            <q-input
              :readonly="disable"
              v-model="currentPatient.dateBirth"
              dense
              type="date"
              mask="DD-MM-YYYY"
              hint="Fecha Nacimiento *"
              :rules="[
                (val) => (val && val.length > 0) || 'Fecha es requerida',
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
              :rules="[(val) => (val && val != null) || 'Entidad es requerida']"
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
              :rules="[(val) => (val && val != null) || 'Genero es requerido']"
            >
            </q-select>
          </div>
        </div>
        <q-input
          :readonly="disable"
          label="Correo electronico"
          dense
          v-model="currentPatient.email"
          type="email"
          :rules="[isValidEmail]"
        />
        <div class="row q-col-gutter-x-md">
          <div class="col-12 col-md-12">
            <div>Campos Obligatorios *</div>
          </div>
          <div class="col-6 col-md">
            <q-btn label="Guardar" type="submit" color="primary" />
            <q-btn
              v-if="disable"
              color="secondary"
              icon-right="mdi-pencil"
              label="Editar"
              @click="enableEdition"
            />
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { onMounted } from 'vue';
import { usePatient } from 'src/services/PatientService';
import { useInsurance } from 'src/services/InsuranceService';
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
    } = usePatient();
    const { allInsurance, getAllInsurance, insuranceChanged } = useInsurance();
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
</style>

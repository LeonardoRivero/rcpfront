<template>
  <q-page class="q-pa-md">
    <q-form @submit="confirmChanges" class="q-gutter-md" ref="formPatient">
      <h4>Pacientes</h4>
      <div class="q-gutter-x-md">
        <q-input
          dense
          v-model="currentPatient.name"
          label="Nombres"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Nombres no validos']"
        />
        <q-input
          dense
          v-model="currentPatient.lastName"
          label="Apellidos"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Apellidos no validos']"
        />
        <div class="row q-col-gutter-x-md">
          <div class="col-6 col-md">
            <q-input
              dense
              type="number"
              v-model="currentPatient.identification"
              label="Numero Identificacion"
              lazy-rules
              :rules="[(val) => val > 0 || 'Numero invalido']"
            />
          </div>
          <div class="col-6 col-md">
            <q-select
              dense
              clearable
              outlined
              v-model="idType"
              :options="allIDTypes"
              option-value="id"
              option-label="abbreviation"
              map-options
              label="Tipo Documento"
              :hint="`Tipo Documento:${
                idType == undefined ? '' : idType.description
              }`"
              @update:model-value="(val) => idTypeChanged(val)"
              @clear="(val) => clearIdType(val)"
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
              dense
              outlined
              v-model="currentPatient.phoneNumber"
              label="Telefono"
              mask="##########"
              unmasked-value
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Celular no valido']"
            />
          </div>
          <div class="col-6 col-md">
            <q-input
              v-model="currentPatient.dateBirth"
              dense
              type="date"
              hint="Fecha Nacimiento"
            />
          </div>
        </div>
        <div class="row q-col-gutter-x-md">
          <div class="col-6 col-md">
            <q-select
              dense
              clearable
              outlined
              v-model="insurance"
              :options="allInsurance"
              option-value="id"
              option-label="nameInsurance"
              map-options
              label="Entidad"
              @update:model-value="(val) => insuranceChanged(val)"
              @clear="(val) => clearInsurance(val)"
              :rules="[(val) => (val && val != null) || 'Entidad es requerida']"
            >
            </q-select>
          </div>
          <div class="col-6 col-md">
            <template v-for="item in allGenders" :key="item.id">
              <q-radio
                v-model="shape"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="item.id"
                :label="item.nameGender"
              />
            </template>
          </div>
        </div>
        <q-input
          label="Correo electronico"
          dense
          v-model="currentPatient.email"
          type="email"
          :rules="[(val) => !!val || 'Email es requerido', isValidEmail]"
        />
        <div class="row q-col-gutter-x-md">
          <div class="col-6 col-md">
            <q-btn label="Guardar" type="submit" color="primary" />
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { usePatient } from 'src/services/PatientService';
import { useInsurance } from 'src/services/InsuranceService';
export default {
  setup() {
    const {
      patient,
      currentPatient,
      currentIDType,
      formPatient,
      confirmChanges,
      isValidEmail,
      allIDTypes,
      idType,
      allGenders,
      getAllGenders,
      getAllIDTypes,
      idTypeChanged,
      clearIdType,
      insurance,
      setOptionsToggle,
    } = usePatient();
    const { allInsurance, getAllInsurance, insuranceChanged } = useInsurance();
    onMounted(async () => {
      await getAllIDTypes();
      await getAllInsurance();
      await getAllGenders();
      setOptionsToggle();
    });
    return {
      model: ref('one'),
      password: ref(''),
      isPwd: ref(true),
      shape: ref('line'),

      email: ref(''),
      search: ref(''),
      tel: ref(''),
      url: ref(''),
      time: ref(''),
      date: ref(''),
      patient,
      currentPatient,
      currentIDType,
      allInsurance,
      allIDTypes,
      idType,
      insurance,
      formPatient,
      confirmChanges,
      isValidEmail,
      idTypeChanged,
      insuranceChanged,
      clearIdType,
      allGenders,
    };
  },
};
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>

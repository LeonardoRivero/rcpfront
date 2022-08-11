<template>
  <div>Una pequeña descripcion de la pagina</div>
  <div class="q-pa-md">
    <q-form @submit="confirmChanges" class="q-gutter-md" ref="formPatient">
      <q-input
        v-model="currentPatient.email"
        filled
        type="email"
        hint="Ej:email@somedomine.com"
        :rules="[(val) => !!val || 'Email es requerido', isValidEmail]"
      />
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
        :rules="[(val) => (val && val != null) || 'Tipo documento no valido']"
      >
      </q-select>
      <div class="q-gutter-md">
        <q-input
          v-model="currentPatient.name"
          label="Nombres"
          lazy-rules
          :mask="`${'A'.repeat(120)}`"
          :rules="[(val) => (val && val.length > 0) || 'Nombres no validos']"
        />
        <q-input
          v-model="currentPatient.lastName"
          label="Apellidos"
          lazy-rules
          :mask="`${'A'.repeat(120)}`"
          :rules="[(val) => (val && val.length > 0) || 'Apellidos no validos']"
        />
        <q-input
          type="number"
          v-model="currentPatient.identification"
          label="Numero Identificacion"
          lazy-rules
          :rules="[(val) => val > 0 || 'Numero invalido']"
        />
        <q-input
          v-model="currentPatient.phoneNumber"
          label="Telefono"
          mask="##########"
          fill-mask
          :rules="[(val) => (val && val.length > 0) || 'Celular no valido']"
        />
        <q-input
          v-model="currentPatient.dateBirth"
          filled
          type="date"
          hint="Fecha Nacimiento"
        />
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
      <div>
        <q-btn label="Guardar" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
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
      allGenders,
      formPatient,
      confirmChanges,
      isValidEmail,
      allIDTypes,
      idType,
      getAllIDTypes,
      idTypeChanged,
      clearIdType,
      insurance,
    } = usePatient();
    const { allInsurance, getAllInsurance, insuranceChanged } = useInsurance();
    onMounted(async () => {
      getAllIDTypes();
      getAllInsurance();
    });
    return {
      password: ref(''),
      isPwd: ref(true),

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
      allGenders,
      allIDTypes,
      idType,
      insurance,
      formPatient,
      confirmChanges,
      isValidEmail,
      idTypeChanged,
      insuranceChanged,
      clearIdType,
    };
  },
};
</script>

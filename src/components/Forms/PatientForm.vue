<template>
  <div>Una pequeña descripcion de la pagina</div>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input
        v-model="currentPatient.name"
        label="Nombres"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Nombres no validos']"
      />

      <q-input
        v-model="currentPatient.lastName"
        label="Apellidos"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Apellidos no validos']"
      />
      <q-input
        v-model="currentPatient.phoneNumber"
        label="Telefono"
        mask="(###) ### - ####"
        fill-mask
        :rules="[(val) => (val && val.length > 0) || 'Celular no valido']"
      />
      <q-input
        type="number"
        v-model="currentPatient.identification"
        label="Numero Identificacion"
        lazy-rules
        :rules="[(val) => val > 0 || 'Numero invalido']"
      />

      <q-input
        v-model="currentPatient.dateBirth"
        filled
        type="date"
        hint="Fecha Nacimiento"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { usePatient } from 'src/services/PatientService';
export default {
  setup() {
    const { patient, currentPatient } = usePatient();
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
    };
  },
};
</script>

<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Configuraciones" icon="mdi-cog" />
        <q-breadcrumbs-el label="Registro Usuarios" />
      </q-breadcrumbs>
    </div>
    <q-form @submit="confirmChanges()" ref="form">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input
            v-model="state.firstName"
            dense
            label="Nombres *"
            lazy-rules
            :rules="[required, onlyLetters]"
            @keydown="blockNumbers"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="state.lastName"
            dense
            label="Apellidos *"
            lazy-rules
            :rules="[required, onlyLetters]"
            @keydown="blockNumbers"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            :option-value="(item) => (item === null ? null : item.name)"
            option-label="name"
            map-options
            dense
            v-model="state.role"
            :options="state.roles"
            label="Perfil *"
            emit-value
            lazy-rules
            :rules="[isNotNull, required]"
            @update:model-value="getAdditionalInfo"
          >
          </q-select>
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            option-value="id"
            option-label="description"
            map-options
            dense
            emit-value
            v-model="state.documentType"
            :options="state.allDocumentType"
            label="Tipo de identificacion *"
            lazy-rules
            :rules="[isNotNull]"
            @update:model-value="updateValidationRules"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            label="Numero identificacion *"
            dense
            :rules="inputRules"
            lazy-rules
            v-model="state.documentNumber"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="state.phoneNumber"
            dense
            label="Telefono *"
            :mask="state.phoneFormat?.format"
            lazy-rules
            :rules="[required]"
            @keydown="preventE"
          >
            <template v-slot:prepend>
              <q-avatar size="24px" color="gray">{{
                state.phoneFormat?.callingCode
              }}</q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            label="Correo electronico *"
            dense
            type="email"
            :rules="[required, emailRequired]"
            lazy-rules
            v-model="state.email"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            label="Registro Medico *"
            dense
            :rules="[required]"
            lazy-rules
            v-model="state.medicalRegister"
            v-if="state.role == 'Doctor'"
          />
          <q-select
            option-value="id"
            option-label="name"
            map-options
            dense
            emit-value
            multiple
            v-model="state.medicalOffice"
            :options="state.allMedicalOffice"
            label="Consultorios *"
            lazy-rules
            :rules="[isNotNull, required]"
            v-if="state.role == 'Secretary'"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-select
            option-value="id"
            option-label="description"
            use-chips
            map-options
            dense
            emit-value
            multiple
            v-model="state.speciality"
            :options="state.allSpecialities"
            label="Especialidades *"
            lazy-rules
            :rules="[isNotNull]"
            v-if="state.role == 'Doctor'"
          />
        </div>
      </div>
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>
<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import {
    required,
    emailRequired,
    isNotNull,
    onlyNumbers,
    onlyLetters,
  } from 'src/Application/Utilities/Helpers';
  import { QForm } from 'quasar';
  import { RegisterUserBloc } from 'src/Adapters/RegisterUserBloc';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';

  const form = ref<QForm>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <RegisterUserBloc>(
    dependenciesLocator.provideRegisterUserBloc()
  );
  const state = usePlocState(controller);
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );

  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRules = ref<Array<any>>([]);
  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState, handleUserState);
  });

  function updateValidationRules() {
    inputRules.value = [];
    inputRules.value.push(required);
    if (
      state.value.documentType === 1 ||
      state.value.documentType === 8 ||
      state.value.documentType === 9
    ) {
      inputRules.value.push(required, onlyNumbers);
    }
    state.value.documentNumber = null;
    form.value?.resetValidation();
  }

  function getAdditionalInfo(role: string) {
    const userId = handleUserState.store.token.userId;
    if (userId == null) return;
    controller.getInfoAdditionalByRole(role, handleGlobalState);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function preventE(event: any) {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  function blockNumbers(event: KeyboardEvent) {
    const key = event.key;
    if (/[0-9]/.test(key)) {
      event.preventDefault();
    }
  }

  async function confirmChanges() {
    await controller.save();
    form.value?.reset();
    form.value?.resetValidation();
  }
</script>

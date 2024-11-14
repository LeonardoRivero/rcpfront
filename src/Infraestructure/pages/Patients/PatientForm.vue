<template>
  <q-stepper
    v-model="step"
    ref="stepper"
    color="primary"
    animated
    style="height: 100vh"
  >
    <q-step
      :name="1"
      title="Informacion Personal"
      icon="person"
      :done="step > 1"
    >
      <div class="text-black">
        <q-toolbar>
          <q-space />
          <q-input
            v-model="state.lookUpDocumentNumber"
            label="Nº Documento"
            clearable
            dense
            type="number"
            @keydown.enter.prevent="searchPatient"
          >
            <template v-slot:prepend>
              <q-btn
                flat
                round
                dense
                icon="refresh"
                class="q-mr-xs"
                @click="clear"
              />
              <q-tooltip transition-show="scale" transition-hide="scale">
                Limpiar
              </q-tooltip>
            </template>
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
                Buscar
              </q-tooltip>
            </template>
          </q-input>
        </q-toolbar>
      </div>
      <q-form @submit="() => {$refs.stepper!.next();}">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="state.currentPatient.name"
              label="Nombres *"
              lazy-rules
              :rules="[required]"
              dense
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="state.currentPatient.lastName"
              label="Apellidos *"
              lazy-rules
              :rules="[required]"
              dense
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="description"
              map-options
              dense
              v-model="state.idType"
              :options="state.allIDTypes"
              label="Tipo de identificacion *"
              lazy-rules
              :rules="[isNotNull]"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="state.identificationPatient"
              label="Numero identificacion *"
              lazy-rules
              :rules="[isNotNull, required]"
              dense
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              lazy-rules
              v-model="state.currentPatient.dateBirth"
              label="Fecha nacimiento *"
              mask="date"
              :rules="[required, isDateInFuture]"
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="state.currentPatient.dateBirth">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
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
          <div class="col-12 col-sm-6 row">
            <q-select
              option-value="id"
              option-label="description"
              map-options
              dense
              v-model="state.biologicalSex"
              :options="state.allBiologicalSex"
              label="Sexo *"
              lazy-rules
              :rules="[isNotNull]"
              class="col-grow q-mr-md"
            />
            <q-select
              option-value="id"
              option-label="description"
              map-options
              dense
              v-model="state.gender"
              :options="state.allGenders"
              label="Genero *"
              lazy-rules
              :rules="[isNotNull]"
              class="col-grow"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="name"
              map-options
              dense
              v-model="state.countryOrigin"
              :options="state.allCountries"
              label="Pais de Origen *"
              lazy-rules
              :rules="[isNotNull]"
              @update:model-value="(val) => countryChanged(val)"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              dense
              v-model="state.currentPatient.email"
              label="Email *"
              lazy-rules
              :rules="[emailRequired]"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              dense
              v-model="state.currentPatient.phoneNumber"
              label="Numero Telefonico *"
              :mask="state.phoneFormat?.format"
              lazy-rules
              :rules="[required]"
            >
              <template v-slot:prepend>
                <q-avatar size="24px" color="gray">{{
                  state.phoneFormat?.callingCode
                }}</q-avatar>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="name"
              map-options
              dense
              v-model="state.ocupation"
              use-input
              hide-selected
              input-debounce="0"
              :options="optionsOcupations"
              :rules="[isNotNull]"
              fill-input
              label="Ocupacion *"
              @filter="filterOcupation"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin Resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Siguiente" type="submit" />
        </q-stepper-navigation>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      title="Informacion de contacto"
      icon="contact_mail"
      :done="step > 2"
    >
      <q-form @submit="onSubmit" ref="form">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 row">
            <q-select
              option-value="id"
              option-label="name"
              map-options
              dense
              v-model="state.countryStay"
              :options="state.allCountries"
              label="Pais de Residencia*"
              lazy-rules
              :rules="[isNotNull]"
              :disable="!state.foreignPatient"
              class="col-grow"
            />
            <q-toggle
              v-model="state.foreignPatient"
              checked-icon="check"
              label="Extranjero"
              @update:model-value="(val) => onCheckboxChange(val)"
              unchecked-icon="clear"
              class="checkbox-label-top"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="codeState"
              option-label="state"
              map-options
              dense
              v-model="state.state"
              use-input
              hide-selected
              input-debounce="0"
              :options="optionsState"
              :rules="[isNotNull]"
              fill-input
              label="Departamento Residencia *"
              @filter="filterState"
              @update:model-value="(val) => stateChanged(val)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin Resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="codeTown"
              option-label="town"
              map-options
              dense
              v-model="state.town"
              use-input
              hide-selected
              input-debounce="0"
              :options="optionsTown"
              :rules="[isNotNull]"
              fill-input
              label="Ciudad Residencia*"
              @filter="filterTown"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin Resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="name"
              map-options
              dense
              v-model="state.insurance"
              use-input
              hide-selected
              input-debounce="0"
              :options="optionsInsurance"
              :rules="[isNotNull]"
              fill-input
              label="Entidad de Salud*"
              @filter="filterInsurance"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin Resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="description"
              map-options
              dense
              v-model="state.ethnicity"
              :options="state.allEthnicity"
              label="Etnia*"
              lazy-rules
              :rules="[isNotNull]"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="description"
              map-options
              dense
              v-model="state.kindDisability"
              :options="state.allKindDisability"
              label="Discapacidad *"
              lazy-rules
              :rules="[isNotNull]"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              option-value="id"
              option-label="description"
              map-options
              dense
              v-model="state.zoneStay"
              :options="state.allZoneStay"
              label="Zona Territorial *"
              lazy-rules
              :rules="[isNotNull]"
            />
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Guardar" type="submit" />
          <q-btn
            flat
            color="primary"
            label="Atras"
            class="q-ml-sm"
            @click="$refs.stepper!.previous()"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>
  </q-stepper>
</template>

<script setup lang="ts">
  import { QStepper } from 'quasar';
  import { routerInstance } from 'src/boot/globalRouter';
  import { inject, onMounted, ref } from 'vue';
  import { QForm } from 'quasar';
  import { PatientFormBloc } from 'src/Adapters';
  import {
    required,
    isNotNull,
    emailRequired,
    isDateInFuture,
  } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import 'src/css/app.sass';
  import {
    CountryResponse,
    HealthInsuranceResponse,
    OcupationResponse,
  } from 'src/Domine/Responses';
  import { StateDTO, TownDTO } from 'src/Domine/DTOs';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';
  import { UpdateFunction } from 'src/Domine/Types';

  const form = ref<QForm>();
  const step = ref<number>(1);
  const stepper = ref<QStepper>();
  const optionsOcupations = ref<OcupationResponse[]>([]);
  const optionsState = ref<StateDTO[]>([]);
  const optionsTown = ref<TownDTO[]>([]);
  const optionsInsurance = ref<HealthInsuranceResponse[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  const controller = <PatientFormBloc>(
    dependenciesLocator.providePatientFormBloc()
  );
  const state = usePlocState(controller);

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
    optionsOcupations.value = state.value.allOcupations;
    optionsState.value = state.value.allCities.state;
  });

  async function onSubmit() {
    const isValid = await form.value?.validate();
    if (isValid == false) return;
    const response = await controller.saveOrUpdate();
    if (response != null) {
      routerInstance.push('/schedule');
      form.value?.reset();
    }
  }

  async function stateChanged(val: StateDTO) {
    const town: TownDTO[] = state.value.allCities?.town;
    const townBelongToState = town?.filter(
      (num: TownDTO) => num.codeState == val.codeState
    );
    optionsTown.value = townBelongToState;
    state.value.town = townBelongToState[0];
  }

  async function countryChanged(val: CountryResponse) {
    await controller.asignPhoneFormat(val.numeric);
    if (!state.value.foreignPatient) {
      state.value.countryStay = state.value.countryOrigin;
    }
  }

  async function searchPatient() {
    const response = await controller.searchByIdentificacion();
    if (response === null) {
      form.value?.reset();
    }
  }

  function filterOcupation(val: string, update: UpdateFunction) {
    update(() => {
      const needle = val.toLowerCase();
      optionsOcupations.value = state.value.allOcupations.filter((option) => {
        return option.name.toLowerCase().indexOf(needle) > -1;
      });
    });
  }

  function onCheckboxChange(value: boolean) {
    if (!value) {
      state.value.countryStay = state.value.countryOrigin;
    }
  }

  function filterState(val: string, update: UpdateFunction) {
    update(() => {
      const needle = val.toLowerCase();
      optionsState.value = state.value.allCities.state.filter((option) => {
        return option.state.toLowerCase().indexOf(needle) > -1;
      });
    });
  }

  function filterInsurance(val: string, update: UpdateFunction) {
    update(() => {
      const needle = val.toLowerCase();
      optionsInsurance.value = state.value.allInsurance.filter((option) => {
        return option.name.toLowerCase().indexOf(needle) > -1;
      });
    });
  }

  function filterTown(val: string, update: UpdateFunction) {
    update(() => {
      if (val === '') {
        optionsTown.value = state.value.allCities.town.filter((option) => {
          return option.codeState == state.value.state?.codeState;
        });
      }
      const needle = val.toLowerCase();
      optionsTown.value = state.value.allCities.town.filter((option) => {
        return (
          option.codeState == state.value.state?.codeState &&
          option.town.toLowerCase().indexOf(needle) > -1
        );
      });
    });
  }

  function clear() {
    controller.clear();
    form.value?.reset();
    form.value?.resetValidation();
  }
  // function enableEdition() {
  //   controller.enableEdition();
  // }
</script>
<style scoped>
  .checkbox-label-top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .checkbox-label-top .q-checkbox__label {
    margin-bottom: 8px;
  }
</style>

<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el
          label="Configuraciones"
          icon="mdi-cog"
          to="/settings"
        />
        <q-breadcrumbs-el label="Consultorio" :icon="icons.medicalClinic" />
      </q-breadcrumbs>
    </div>
    <q-form @submit="confirmChanges" ref="form">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input
            dense
            v-model="state.name"
            label="Nombre Consultorio *"
            class="col-grow"
            :rules="[required]"
          />
        </div>
        <div class="col-12 col-sm-6 row">
          <q-input
            dense
            v-model="state.country.name"
            label="Pais"
            disable
            class="col-grow"
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
            class="col-grow"
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
          <q-input
            dense
            v-model="state.phoneNumber"
            label="Numero Telefonico *"
            :mask="state.phoneFormat?.format"
            lazy-rules
            :rules="[required]"
          >
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input dense v-model="state.address" label="Direccion *" />
        </div>
      </div>
      <br />
      <div>
        <q-btn label="Guardar" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { QForm } from 'quasar';
  import { IconSVG } from 'src/Application/Utilities';
  import { required, isNotNull } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { MedicalOfficeBloc } from 'src/Adapters/MedicalOfficeBloc';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
  import { StateDTO, TownDTO } from 'src/Domine/DTOs';
  import { UpdateFunction } from 'src/Domine/Types';
  import 'src/css/app.sass';

  const form = ref<QForm>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const optionsState = ref<StateDTO[]>([]);
  const optionsTown = ref<TownDTO[]>([]);

  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  const controller = <MedicalOfficeBloc>(
    dependenciesLocator.provideMedicalOfficeBloc()
  );

  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );
  const state = usePlocState(controller);
  const icons = IconSVG;

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
    optionsState.value = state.value.allCities.state;
  });

  async function stateChanged(val: StateDTO) {
    const town: TownDTO[] = state.value.allCities?.town;
    const townBelongToState = town?.filter(
      (num: TownDTO) => num.codeState == val.codeState
    );
    optionsTown.value = townBelongToState;
    state.value.town = townBelongToState[0];
  }

  function filterState(val: string, update: UpdateFunction) {
    update(() => {
      const needle = val.toLowerCase();
      optionsState.value = state.value.allCities.state.filter((option) => {
        return option.state.toLowerCase().indexOf(needle) > -1;
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

  async function confirmChanges() {
    const isValid = await form.value?.validate();
    if (isValid == false) return;
    const response = await controller.saveOrUpdate(
      handleUserState,
      handleGlobalState
    );
    if (response != null) {
      controller.clear();
      form.value?.reset();
    }
  }
</script>

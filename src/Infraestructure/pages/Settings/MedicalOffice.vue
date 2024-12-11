<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Configuraciones" icon="mdi-cog" />
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
        <div class="col-12 col-sm-6">
          <q-input
            dense
            v-model="state.intervalAppointment"
            label="Intervalo Consulta en Min *"
            @blur="(val) => changeInterval(val)"
            min="0"
            max="60"
            :rules="[
              (val) => (val >= 0 && val <= 60) || 'Debe estar entre 0 y 60',
            ]"
          />
          <br />
          <q-table
            :rows="state.openingHoursDTO"
            :columns="columns"
            hide-bottom
            flat
            title="Horario Consulta"
            dense
            row-key="id"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="nameDay" :props="props">
                  {{ props.row.nameDay }}
                </q-td>
                <q-td key="start" :props="props">
                  <q-input
                    filled
                    v-model="props.row.start"
                    mask="time"
                    :rules="['time']"
                    dense
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="props.row.start"
                            format24h
                            :minute-options="state.options"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-td>
                <q-td key="end" :props="props">
                  <q-input
                    filled
                    v-model="props.row.end"
                    mask="time"
                    :rules="['time']"
                    dense
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="props.row.end"
                            format24h
                            :minute-options="state.options"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
  import { QTableColumn } from 'quasar';
  import { IconSVG } from 'src/Application/Utilities';
  import { required, isNotNull } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { MedicalOfficeBloc } from 'src/Adapters/MedicalOfficeBloc';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
  import { OpeningHoursDTO, StateDTO, TownDTO } from 'src/Domine/DTOs';
  import { UpdateFunction } from 'src/Domine/Types';
  import 'src/css/app.sass';

  const form = ref<QForm>();
  // const time = ref('10:56');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const optionsState = ref<StateDTO[]>([]);
  const optionsTown = ref<TownDTO[]>([]);
  // const test = ref<number[]>([0, 15, 60]);
  // const rows = ref<OpeningHoursDTO[]>([
  //   { nameDay: 'Lunes', start: '08:00', end: '12:00' },
  //   { nameDay: 'Martes', start: '09:30', end: '12:00' },
  //   { nameDay: 'Miercoles', start: '12:15', end: '12:00' },
  //   { nameDay: 'Jueves', start: '14:45', end: '12:00' },
  //   { nameDay: 'Viernes', start: '16:00', end: '12:00' },
  //   { nameDay: 'Sabado', start: '16:00', end: '12:00' },
  //   { nameDay: 'Domingo', start: '16:00', end: '12:00' },
  // ]);

  const columns: QTableColumn<OpeningHoursDTO>[] = [
    {
      name: 'nameDay',
      label: 'Nombre',
      align: 'left',
      field: 'nameDay',
    },
    {
      name: 'start',
      label: 'Hora Inicio',
      align: 'center',
      field: 'start',
    },
    {
      name: 'end',
      label: 'Hora Fin',
      align: 'center',
      field: 'end',
    },
  ];

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function changeInterval(event: any) {
    controller.generateInterval(parseInt(event.target.value));
  }

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
    const intervalIsValid = controller.checkIntervalOpeningHours(
      state.value.openingHoursDTO
    );
    if (!isValid || !intervalIsValid) return;

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

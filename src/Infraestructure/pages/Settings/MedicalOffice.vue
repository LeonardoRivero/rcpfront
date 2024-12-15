<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Lista Consultorios" :to="'/medicaloffice'" />
        <q-breadcrumbs-el :label="state.name" />
      </q-breadcrumbs>
    </div>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      :bordered="false"
      flat
    >
      <q-step :name="1" title="Información Basica" :done="step > 1">
        <q-form @submit="() => {$refs.stepper!.next();}" ref="form">
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
          <q-stepper-navigation>
            <q-btn color="primary" label="Siguiente" type="submit" />
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="2"
        title="Horario"
        :done="step > 2"
        icon="mdi-calendar-clock"
      >
        <q-form @submit="onSubmit" ref="form">
          <div class="row q-col-gutter-md">
            <div
              class="col-12 col-sm-9"
              :class="{ 'order-first': !$q.screen.xs }"
            >
              <q-table
                :rows="state.openingHoursDTO"
                :columns="columns"
                flat
                title="Horario Consulta"
                dense
                row-key="id"
                :rows-per-page-options="[7]"
                hide-bottom
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
            <div
              class="col-12 col-sm-3"
              :class="{ 'order-first': $q.screen.xs }"
            >
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
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn label="Guardar" type="submit" color="primary" />
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
  </div>
</template>
<script setup lang="ts">
  import { inject, onMounted, onUnmounted, ref } from 'vue';
  import { QForm, QStepper } from 'quasar';
  import { QTableColumn } from 'quasar';
  import { required, isNotNull } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { MedicalOfficeBloc } from 'src/Adapters/MedicalOfficeBloc';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
  import { OpeningHoursDTO, StateDTO, TownDTO } from 'src/Domine/DTOs';
  import { UpdateFunction } from 'src/Domine/Types';
  import { routerInstance } from 'src/boot/globalRouter';
  import 'src/css/app.sass';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const form = ref<QForm>();
  const step = ref<number>(1);
  const stepper = ref<QStepper>();
  const optionsState = ref<StateDTO[]>([]);
  const optionsTown = ref<TownDTO[]>([]);
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

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
    optionsState.value = state.value.allCities.state;
  });

  onUnmounted(async () => {
    controller.clear();
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

  async function onSubmit() {
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
      routerInstance.push('/medicaloffice');
    }
  }
</script>

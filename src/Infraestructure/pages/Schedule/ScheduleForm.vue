<template>
  <q-form @submit="confirmChanges" ref="form">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs"
            >Datos Paciente
            <small>
              <cite title="Ayuda"
                >(Antes de agendar la cita medica,verifique la informacion del
                paciente)</cite
              >
            </small>
          </q-item-label>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                dense
                v-model="state.currentSchedule.start"
                label="Fecha y Hora"
                filled
                readonly
                :rules="[required]"
                lazy-rules
                :hint="`Finalizacion Cita: ${date.formatDate(
                  date.addToDate(state.currentSchedule.start, { minutes: 20 }),
                  FORMAT_DATETIME
                )}`"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        today-btn
                        v-model="state.currentSchedule.start"
                        :navigation-min-year-month="CURRENTYEAR_MONTH"
                        :mask="FORMAT_DATETIME"
                      >
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

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="state.currentSchedule.start"
                        :mask="FORMAT_DATETIME"
                        :minute-options="OPTIONS_MINUTES"
                        :hour-options="OPTIONS_HOURS"
                        format24h
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
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                dense
                type="number"
                v-model="state.identificationPatient"
                @keydown.enter.prevent="searchPatient()"
                label="N° Identificacion"
                lazy-rules
                :rules="[(val) => val > 0 || 'Numero invalido']"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    round
                    dense
                    icon="search"
                    class="q-mr-xs"
                    @click="searchPatient()"
                  />
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Verificar Paciente
                  </q-tooltip></template
                >
              </q-input>
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                :readonly="true"
                dense
                v-model="state.currentPatient.name"
                label="Nombre Paciente"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                :readonly="true"
                dense
                v-model="state.currentPatient.lastName"
                label="Apellido Paciente"
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                :readonly="true"
                dense
                v-model="state.currentPatient.phoneNumber"
                label="Telefono Paciente"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                :readonly="true"
                dense
                v-model="state.currentPatient.email"
                label="Email"
              />
            </div>
            <!-- <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense

                v-model="state.currentPatient.insurance.nameInsurance"
                label="Entidad Paciente"
              />
            </div> -->
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          Datos Generales:
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-sm-6">
              <q-select
                dense
                clearable
                v-model="state.currentDoctor"
                :options="state.allDoctors"
                :option-value="(item) => (item === null ? null : item.id)"
                emit-value
                :option-label="(option) => `${option.name} ${option.lastName}`"
                map-options
                label="Doctor *"
                :rules="[isNotNull, required]"
                lazy-rules
                :disable="state.allDoctors.length == 1"
              >
              </q-select>
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                dense
                clearable
                v-model="state.speciality"
                :options="state.allSpecialities"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="description"
                map-options
                label="Especialidad"
                :rules="[isNotNull]"
                lazy-rules
              >
              </q-select>
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                dense
                v-model="state.medicalOfficeSelected"
                :options="state.allMedicalOffice"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="name"
                map-options
                label="Consultorio *"
                :rules="[isNotNull]"
                lazy-rules
              >
              </q-select>
            </div>
            <div class="col-12 col-sm-12">
              <q-input
                v-model="state.currentSchedule.observations"
                dense
                stack-label
                :error="state.error"
                clearable
                autogrow
                :label="`${
                  state.allowToDelete == false
                    ? 'Observaciones'
                    : 'Motivo de Cancelaciòn'
                }`"
                :error-message="Messages.requiredForDelete"
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-actions align="right" class="text-teal">
      <q-btn
        v-if="state.allowToUpdate"
        label="Guardar"
        type="submit"
        color="primary"
      />
      <q-btn
        v-if="state.allowToDelete"
        label="Eliminar"
        @click="confirmDeleteSchedule()"
        color="negative"
      />
    </q-card-actions>
  </q-form>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, ref, inject } from 'vue';
  import { date, QForm } from 'quasar';
  import { ScheduleFormBloc } from 'src/Adapters';
  import {
    CURRENTYEAR_MONTH,
    FORMAT_DATETIME,
    OPTIONS_HOURS,
    OPTIONS_MINUTES,
  } from 'src/Application/Utilities/Constants';
  import 'src/css/app.sass';
  import { Messages } from 'src/Application/Utilities';
  import { required, isNotNull } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';

  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <ScheduleFormBloc>(
    dependenciesLocator.provideScheduleBloc()
  );

  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );

  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );
  const state = usePlocState(controller);
  const form = ref<QForm>();

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
  });

  onUnmounted(async () => {
    await controller.clear();
  });

  async function confirmChanges() {
    const isValid = await form.value?.validate();
    if (isValid == false) return;
    await controller.saveOrUpdate(handleUserState.store.token.userId);
    handleGlobalState.refecthEvents();
  }

  async function searchPatient() {
    await controller.searchPatient();
  }

  async function confirmDeleteSchedule() {
    await controller.confirmDeleteSchedule();
  }

  // async function specialityChanged(val: number) {
  //   await controller.getDoctorsBelongSpeciality(val);
  // }
</script>

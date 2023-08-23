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
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                dense
                outlined
                v-model="storeSchedule.dateSchedule"
                label="Fecha Cita"
                :hint="`Finalizacion Cita: ${dates.formatDate(
                  dates.addToDate(storeSchedule.dateSchedule, { minutes: 20 }),
                  FORMAT_DATETIME
                )}`"
              >
                <template v-slot:prepend>
                  <q-icon name="event">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        today-btn
                        v-model="storeSchedule.dateSchedule"
                        :navigation-min-year-month="CURRENTYEAR_MONTH"
                        :mask="FORMAT_DATETIME"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="storeSchedule.dateSchedule"
                        :mask="FORMAT_DATETIME"
                        :minute-options="OPTIONS_MINUTES"
                        :hour-options="OPTIONS_HOURS"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
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
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                dense
                type="number"
                outlined
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
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense
                outlined
                v-model="state.currentPatient.name"
                label="Nombre Paciente"
              />
            </div>
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense
                outlined
                v-model="state.currentPatient.lastName"
                label="Apellido Paciente"
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense
                outlined
                v-model="state.currentPatient.phoneNumber"
                label="Telefono Paciente"
              />
            </div>
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense
                outlined
                v-model="state.currentPatient.insurance.nameInsurance"
                label="Entidad Paciente"
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          Datos Generales:
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-select
                dense
                clearable
                outlined
                v-model="state.currentDoctor"
                :options="state.allDoctors"
                :option-value="(item) => (item === null ? null : item.id)"
                emit-value
                label="Doctor"
                map-options
                :rules="[required]"
                :display-value="`${
                  state.currentDoctor ? state.currentDoctor.name : ''
                } ${state.currentDoctor ? state.currentDoctor.lastName : ''}`"
              >
                <template v-slot:option="{ itemProps, opt }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label
                        >{{ opt.name }} {{ opt.lastName }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-select
                dense
                clearable
                outlined
                v-model="state.speciality"
                :options="state.allSpecialities"
                :option-value="(item) => (item === null ? null : item.id)"
                emit-value
                option-label="description"
                map-options
                label="Especialidad"
                :rules="[required]"
                @clear="(val) => clearSpeciality(val)"
                @update:model-value="(val) => specialityChanged(val)"
              >
              </q-select>
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md col-sm-12 col-xs-12">
              <q-input
                v-model="state.currentSchedule.observations"
                dense
                stack-label
                :error="error"
                clearable
                autogrow
                :label="`${
                  state.allowToDelete == false
                    ? 'Observaciones'
                    : 'Motivo de Cancelaciòn'
                }`"
                :error-message="errorMessage"
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
        @click="confirmDeleteSchedule(currentSchedule.id)"
        color="negative"
      />
    </q-card-actions>
  </q-form>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, reactive } from 'vue';
import { date, QForm } from 'quasar';
import container from 'src/inversify.config';
import { HealthInsuranceResponse, PatientResponse } from 'src/Domine/Responses';
import { EventSchedule, IAppointment } from 'src/Domine/ModelsDB';
import { ScheduleAdapter } from 'src/Adapters';
import {
  CURRENTYEAR_MONTH,
  FORMAT_DATETIME,
  OPTIONS_HOURS,
  OPTIONS_MINUTES,
  FIELD_REQUIRED,
} from 'src/Application/Utilities/Constants';
import { DoctorService } from 'src/Application/Services/DoctorService';
import 'src/css/app.sass';
import { Messages } from 'src/Application/Utilities';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { ScheduleState } from 'src/Domine/IStates';
import FullCalendar from '@fullcalendar/vue3/dist/FullCalendar';
import {
  PatientMediator,
  ScheduleMediator,
} from 'src/Infraestructure/Mediators';
import { required, isNotNull } from 'src/Application/Utilities/Helpers';

export default defineComponent({
  components: {},
  setup() {
    const dates = date;
    const mediator = ScheduleMediator.getInstance();
    const storeSchedule = mediator.getStore();
    const state: ScheduleState = reactive({
      lastConsult: {} as IAppointment,
      isReadonly: false,
      card: false,
      currentAppointment: {} as IAppointment,
      currentPatient: {
        insurance: {} as HealthInsuranceResponse,
      } as PatientResponse,
      currentSchedule: {
        id: undefined,
        start: storeSchedule.dateSchedule,
      } as EventSchedule,
      currentDoctor: null,
      allDoctors: [],
      speciality: null,
      allSpecialities: [],
      identificationPatient: '',
      allowToUpdate: true,
      allowToDelete: false,
      calendar: {} as InstanceType<typeof FullCalendar>,
    });
    const adapter = ScheduleAdapter.getInstance(state);
    const specialityService =
      container.get<SpecialityService>('SpecialityService');
    const doctorService = new DoctorService();
    const patientMediator = PatientMediator.getInstance();
    const form = ref<QForm>();
    const error = ref<boolean>(false);

    onMounted(async () => {
      const doctors = await doctorService.getAll();
      const specialities = await specialityService.getAll();
      state.allDoctors = doctors == null ? [] : doctors;
      state.allSpecialities = specialities == null ? [] : specialities;
    });

    onUnmounted(async () => {
      state.speciality = null;
      state.currentDoctor = null;
      state.currentAppointment = {} as IAppointment;
      state.currentPatient = {
        insurance: {} as HealthInsuranceResponse,
      } as PatientResponse;
      state.identificationPatient = '';
    });
    return {
      required,
      isNotNull,
      storeSchedule,
      state,
      error,
      errorMessage: Messages.requiredForDelete,
      CURRENTYEAR_MONTH,
      OPTIONS_HOURS,
      OPTIONS_MINUTES,
      FORMAT_DATETIME,
      FIELD_REQUIRED,
      form,
      dates,
      async confirmChanges() {
        const responsePatient = await patientMediator.searchByIdentificacion(
          state.identificationPatient
        );
        if (responsePatient === null) {
          storeSchedule.card = false;
          await patientMediator.patientNotFound();
          return;
        }
        state.currentPatient = responsePatient;
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        await adapter.saveOrUpdate(state.currentSchedule);
      },

      async searchPatient() {
        const response = await patientMediator.searchByIdentificacion(
          state.identificationPatient
        );
        if (response !== null) {
          state.currentPatient = response;
          return;
        }
        storeSchedule.card = false;
        await patientMediator.patientNotFound();
      },

      async confirmDeleteSchedule(val: number) {
        if (state.currentSchedule.observations.length === 0) {
          error.value = true;
          return;
        }
        await adapter.confirmDeleteSchedule(val);
      },

      async specialityChanged(val: number) {
        // await specialityAdapter.specialityChanged(speciality.value);
        const queriesParameters = {
          speciality: val,
        };
        const response = await doctorService.findByParameters(
          queriesParameters
        );
        console.log(response)
        state.currentDoctor = null;
        state.allDoctors = response;
        form.value?.resetValidation();
      },

      async clearSpeciality() {
        // specialityService.clear();
      },
    };
  },
});
</script>

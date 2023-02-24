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
                v-model="currentSchedule.start"
                label="Fecha Cita"
                :hint="`Finalizacion Cita: ${dates.formatDate(
                  dates.addToDate(currentSchedule.start, { minutes: 20 }),
                  'YYYY-MM-DD HH:mm'
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
                        v-model="currentSchedule.start"
                        :navigation-min-year-month="MIN_YEAR_MONTH"
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
                        v-model="currentSchedule.start"
                        :mask="FORMAT_DATETIME"
                        :minute-options="MINUTES_ALLOWED"
                        :hour-options="HOURS_ALLOWED"
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
                v-model="identificationPatient"
                @keydown.enter.prevent="searchPatient"
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
                    @click="searchPatient"
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
                v-model="currentPatient.name"
                label="Nombre Paciente"
              />
            </div>
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense
                outlined
                v-model="currentPatient.lastName"
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
                v-model="currentPatient.phoneNumber"
                label="Telefono Paciente"
              />
            </div>
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
                :readonly="true"
                dense
                outlined
                v-model="currentPatient.insurance.nameInsurance"
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
                v-model="currentDoctor"
                :options="allDoctors"
                option-value="id"
                label="Doctor"
                lazy-rules
                map-options
                :rules="[(val) => val || FIELD_REQUIRED]"
                :display-value="`${currentDoctor ? currentDoctor.name : ''} ${
                  currentDoctor ? currentDoctor.lastName : ''
                }`"
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
                v-model="speciality"
                :options="allSpecialities"
                option-value="id"
                option-label="description"
                map-options
                label="Especialidad"
                lazy-rules
                :rules="[(val) => val || FIELD_REQUIRED]"
                @clear="(val) => clearSpeciality(val)"
                @update:model-value="(val) => specialityChanged(val)"
              >
              </q-select>
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md col-sm-12 col-xs-12">
              <q-input
                v-model="currentSchedule.observations"
                dense
                stack-label
                :error="error"
                clearable
                autogrow
                :label="`${
                  allowToDelete == false
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
        v-if="allowToUpdate"
        label="Guardar"
        type="submit"
        color="primary"
      />
      <q-btn
        v-if="allowToDelete"
        label="Eliminar"
        @click="confirmDeleteSchedule(currentSchedule.id)"
        color="negative"
      />
    </q-card-actions>
  </q-form>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
import {
  HealthInsuranceResponse,
  PatientResponse,
  SpecialityResponse,
} from 'src/Domine/Responses';
import { IAppointment } from 'src/Domine/ModelsDB';
import {
  SpecialityAdapter,
  ScheduleAdapter,
  PatientAdapter,
} from 'src/Adapters';
import {
  CURRENTYEAR_MONTH,
  FORMAT_DATETIME,
  OPTIONS_HOURS,
  OPTIONS_MINUTES,
  FIELD_REQUIRED,
} from 'src/Application/Utilities/Constants';
import { useStoreSchedule } from '../../stores/SchedulePage/ScheduleStore';
import { useStoreSpeciality } from '../../stores/SettingsPage/SpecialityStore';
import { useStorePatient } from 'src/Infraestructure/stores/PatientsPage/PatientStore';
import { DoctorService } from 'src/Application/Services/DoctorService';
import 'src/css/app.sass';
import { Messages } from 'src/Application/Utilities';

export default defineComponent({
  components: {},
  setup() {
    const dates = date;
    // const FORMATDATETIME = FORMAT_DATETIME;
    const MINUTES_ALLOWED = OPTIONS_MINUTES;
    const HOURS_ALLOWED = OPTIONS_HOURS;
    const MIN_YEAR_MONTH = CURRENTYEAR_MONTH;
    const store = useStoreSchedule();
    const {
      form,
      currentAppointment,
      currentSchedule,
      identificationPatient,
      currentPatient,
      allDoctors,
      currentDoctor,
      allowToUpdate,
      allowToDelete,
      speciality,
      allSpecialities,
      isReadonly,
      card,
    } = storeToRefs(store);

    // const { getAllSpecialities, allSpecialities, clearSpeciality } =
    //   specialityService();
    // const storeSpeciality = useStoreSpeciality();
    // const { allSpecialities } = storeToRefs(storeSpeciality);
    const adapter = ScheduleAdapter.getInstance(store);
    const specialityAdapter = SpecialityAdapter.getInstance(
      useStoreSpeciality()
    );
    const doctorService = new DoctorService();
    const patientAdapter = PatientAdapter.getInstance(useStorePatient());
    const messages = Messages.getInstance();

    const error = ref<boolean>(false);

    onMounted(async () => {
      const doctors = await doctorService.getAll();
      const specialities = await specialityAdapter.getAll();
      allDoctors.value = doctors == null ? [] : doctors;
      allSpecialities.value = specialities == null ? [] : specialities;
    });

    onUnmounted(async () => {
      speciality.value = null;
      currentDoctor.value = null;
      currentAppointment.value = {} as IAppointment;
      currentPatient.value = {
        insurance: {} as HealthInsuranceResponse,
      } as PatientResponse;
      identificationPatient.value = '';
    });
    return {
      error,
      errorMessage: messages.requiredForDelete,
      MIN_YEAR_MONTH,
      HOURS_ALLOWED,
      MINUTES_ALLOWED,
      FORMAT_DATETIME,
      FIELD_REQUIRED,
      form,
      dates,
      currentAppointment,
      currentSchedule,
      identificationPatient,
      currentPatient,
      allowToUpdate,
      allowToDelete,
      allDoctors,
      allSpecialities,
      speciality,
      currentDoctor,
      isReadonly,
      async confirmChanges() {
        const responsePatient = await patientAdapter.searchByIdentificacion(
          identificationPatient.value
        );
        if (responsePatient === null) {
          card.value = false;
          await patientAdapter.patientNotFound();
          return;
        }
        currentPatient.value = responsePatient;
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        await adapter.saveOrUpdate(currentSchedule.value);
      },

      async searchPatient() {
        const response = await patientAdapter.searchByIdentificacion(
          identificationPatient.value
        );
        if (response !== null) {
          currentPatient.value = response;
          return;
        }
        card.value = false;
        await patientAdapter.patientNotFound();
      },

      async confirmDeleteSchedule(val: number) {
        if (currentSchedule.value.observations.length === 0) {
          error.value = true;
          return;
        }
        await adapter.confirmDeleteSchedule(val);
      },

      async specialityChanged(val: SpecialityResponse) {
        // await specialityAdapter.specialityChanged(speciality.value);
        const queriesParameters = {
          speciality: val.id,
        };
        const response = await doctorService.findByParameters(
          queriesParameters
        );
        currentDoctor.value = null;
        allDoctors.value = response;
        form.value?.resetValidation();
      },

      async clearSpeciality() {
        specialityAdapter.clear();
      },
    };
  },
});
</script>

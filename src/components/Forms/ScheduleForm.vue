<template>
  <q-form @submit="confirmChanges" ref="form">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs"
            >Datos Paciente
            <small>
              <cite title="Ayuda"
                >(Antes de crear la cita,verifique la informacion del
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
                dense
                outlined
                v-model="currentPatient.name"
                label="Nombre Paciente"
              />
            </div>
            <div class="col-6 col-md col-sm-12 col-xs-12">
              <q-input
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
                :rules="[(val) => val || 'Doctor es requerido']"
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
                :rules="[(val) => val || 'Especialidad es requerida']"
                @clear="(val) => clearSpeciality(val)"
              >
              </q-select>
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
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
import {
  ScheduleService,
  useStoreSchedule,
} from 'src/services/ScheduleService';
import {
  specialityService,
  useStoreSpeciality,
} from 'src/services/SpecialityService';
import { IAppointmentRequest, ISpeciality } from 'src/models/IConsults';
import { IPatientResponse } from 'src/models/IPatients';
import * as Constants from 'src/scripts/Constants';
import 'src/css/app.sass';

export default defineComponent({
  components: {},
  setup() {
    const dates = date;
    const FORMAT_DATETIME = Constants.FORMAT_DATETIME;
    const MINUTES_ALLOWED = Constants.OPTIONS_MINUTES;
    const HOURS_ALLOWED = Constants.OPTIONS_HOURS;
    const MIN_YEAR_MONTH = Constants.CURRENTYEAR_MONTH;
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
      // confirmChanges,
      // searchPatient,
      // confirmDeleteSchedule,
      // getAllDoctors,
      // specialityChanged,
      speciality,
    } = storeToRefs(store);
    const service = new ScheduleService();
    const serviceSpeciality = specialityService.getInstance();
    // const { getAllSpecialities, allSpecialities, clearSpeciality } =
    //   specialityService();
    const storeSpeciality = useStoreSpeciality();
    const { allSpecialities } = storeToRefs(storeSpeciality);

    onMounted(async () => {
      await service.getAllDoctors();
      await serviceSpeciality.getAll();
    });
    onUnmounted(async () => {
      currentAppointment.value = {} as IAppointmentRequest;
      currentPatient.value = {} as IPatientResponse;
      identificationPatient.value = '';
    });

    return {
      MIN_YEAR_MONTH,
      HOURS_ALLOWED,
      MINUTES_ALLOWED,
      FORMAT_DATETIME,
      form,
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
      async confirmChanges() {
        await service.confirmChanges();
      },
      async searchPatient() {
        await service.searchPatient();
      },
      async confirmDeleteSchedule(val: number) {
        await service.confirmDeleteSchedule(val);
      },
      async specialityChanged() {
        await serviceSpeciality.specialityChanged(speciality.value);
      },
      async clearSpeciality() {
        serviceSpeciality.clear();
      },
      dates,
    };
  },
});
</script>

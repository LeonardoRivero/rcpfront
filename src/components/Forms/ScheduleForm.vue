<template>
  <q-form @submit="confirmChanges" ref="formSchedule">
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
                v-model="currentAppointment.date"
                label="Fecha Cita"
                hint="Finalizacion Cita"
              >
                <template v-slot:prepend>
                  <q-icon name="event">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        today-btn
                        v-model="currentAppointment.date"
                        :navigation-min-year-month="currentYearMonth"
                        :mask="formatDatetime"
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
                        v-model="currentAppointment.date"
                        :mask="formatDatetime"
                        :minute-options="minutesAllowed"
                        :hour-options="hoursAllowed"
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
    </q-list>
    <q-card-actions align="right" class="text-teal">
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-card-actions>
  </q-form>
  <ModalCommon />
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { appointmentService } from 'src/services/AppointmentService';
import { scheduleService } from 'src/services/ScheduleService';
import ModalCommon from 'src/components/commons/ModalCommon.vue';
import 'src/css/app.sass';
import { IConsultRequest } from 'src/interfaces/IConsults';
import { IPatientRequest, IPatientResponse } from 'src/interfaces/IPatients';

export default defineComponent({
  components: { ModalCommon },
  setup() {
    const {
      formattedTime,
      formatDatetime,
      hoursAllowed,
      minutesAllowed,
      currentYearMonth,
    } = appointmentService();
    const {
      formSchedule,
      currentAppointment,
      identificationPatient,
      currentPatient,
      confirmChanges,
      searchPatient,
    } = scheduleService();

    onMounted(async () => {
      // getAllSpecialities();
      // getAllDxMainCode();
      // getAllReasonConsult();
      // getAllPatientStatus();
    });
    onUnmounted(async () => {
      currentAppointment.value = {} as IConsultRequest;
      currentPatient.value = {} as IPatientResponse;
      identificationPatient.value = '';
    });

    return {
      currentYearMonth,
      hoursAllowed,
      minutesAllowed,
      formattedTime,
      formatDatetime,
      formSchedule,
      currentAppointment,
      identificationPatient,
      confirmChanges,
      searchPatient,
      currentPatient,
    };
  },
});
</script>

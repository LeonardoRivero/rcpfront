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
                v-model="state.currentSchedule.start"
                label="Fecha Cita"
                :hint="`Finalizacion Cita: ${dates.formatDate(
                  dates.addToDate(state.currentSchedule.start, { minutes: 20 }),
                  FORMAT_DATETIME
                )}`"
                :rules="[required]"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="event">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        today-btn
                        v-model="state.currentSchedule.start"
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
                        v-model="state.currentSchedule.start"
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
                :option-value="(item) => (item === null ? null : item.user.id)"
                label="Doctor"
                map-options
                lazy-rules
                :rules="[isNotNull]"
                :display-value="`${
                  state.currentDoctor ? state.currentDoctor.user.first_name : ''
                } ${
                  state.currentDoctor ? state.currentDoctor.user.last_name : ''
                }`"
              >
                <template v-slot:option="{ itemProps, opt }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label
                        >{{ opt.user.first_name }}
                        {{ opt.user.last_name }}</q-item-label
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
                :rules="[isNotNull]"
                lazy-rules
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
import { ScheduleMediator } from 'src/Infraestructure/Mediators';
import { required, isNotNull } from 'src/Application/Utilities/Helpers';
import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';

const dates = date;
const mediator = ScheduleMediator.getInstance();
const controller = inject<ScheduleFormBloc>(
  'scheduleFormBloc'
) as ScheduleFormBloc;
const state = usePlocState(controller);
const form = ref<QForm>();
mediator.add(controller);

onMounted(async () => {
  await controller.loadInitialData();
});

onUnmounted(async () => {
  await controller.clear();
});

async function confirmChanges() {
  // try {
  const isValid = await form.value?.validate();
  if (isValid == false) return;
  await controller.saveOrUpdate();
  // } catch (error: any) {
  //   const messageError = (error as Error).message;
  //   const notifyQuasar = factoryNotificator.createNotificator(
  //     ModalType.NotifyQuasar
  //   );
  //   notifyQuasar.setType('error');
  //   notifyQuasar.show(undefined, messageError);
  // }
}

async function searchPatient() {
  await controller.searchPatient();
}

async function confirmDeleteSchedule() {
  await controller.confirmDeleteSchedule();
}

async function specialityChanged(val: number) {
  await controller.getDoctorsBelongSpeciality(val);
}
</script>

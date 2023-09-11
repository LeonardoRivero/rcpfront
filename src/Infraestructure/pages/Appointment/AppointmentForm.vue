<template>
  <q-form @submit="confirmChanges" ref="form">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs"
            >Datos Paciente
            <small>
              <cite
                >(Antes de crear la cita,verifique la informacion del
                paciente)</cite
              >
            </small>
          </q-item-label>
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md">
              <!-- <q-select
                dense
                label="Entidad"
                outlined
                v-model="state.currentHealthInsurance"
                :options="listInsurancePatient"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="nameInsurance"
                map-options
                stack-label
                :disable="shape"
                @update:model-value="(val) => calculateAmountPaid(val)"
                :rules="[isNotNull]"
              ></q-select> -->
              <q-input
                dense
                outlined
                v-model="state.schedule.patient.insurance.nameInsurance"
                label="Entidad"
                readonly
              />
            </div>
            <div class="col-6 col-md">
              <q-input
                dense
                type="number"
                outlined
                v-model="state.identificationPatient"
                @keydown.enter.prevent="patientHasAppointment()"
                label="N° Identificacion"
                lazy-rules
                :rules="[numberRequired]"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    round
                    dense
                    icon="search"
                    class="q-mr-xs"
                    @click="patientHasAppointment()"
                  />
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Buscar Paciente
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
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="state.schedule.patient.name"
                label="Nombre Paciente"
                readonly
              />
            </div>
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="state.schedule.patient.lastName"
                label="Apellido Paciente"
                readonly
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Datos Consulta</q-item-label>
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md-6">
              <q-input
                dense
                type="text"
                outlined
                v-model="state.schedule.speciality.description"
                label="Especialidad"
                readonly
                hint=" "
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                dense
                outlined
                v-model="state.schedule.start"
                label="Fecha Cita"
                :hint="`Finalizacion Cita: ${
                  state.end == undefined ? '' : state.schedule.end
                }`"
                readonly
              >
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md-4">
              <q-input
                dense
                type="number"
                outlined
                v-model="state.currentAppointment.authorizationNumber"
                label="N° Autorización"
                lazy-rules
                :rules="[numberRequired]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                dense
                label="Razon Consulta"
                outlined
                v-model="state.currentAppointment.reasonConsult"
                :options="store.allReasonConsult"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="abbreviation"
                map-options
                emit-value
                stack-label
                :rules="[isNotNull]"
              ></q-select>
            </div>
            <div class="col-12 col-md-4">
              <q-select
                dense
                outlined
                v-model="state.currentAppointment.patientStatus"
                :options="store.allPatientStatus"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="description"
                map-options
                emit-value
                stack-label
                label="Estado Paciente"
                :rules="[isNotNull]"
              ></q-select>
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md-4">
              <q-input
                prefix="$"
                dense
                type="number"
                outlined
                v-model="state.currentAppointment.copayment"
                label="Copago"
                @update:model-value="(val) => calculateAmountPaid(val)"
                lazy-rules
                :rules="[(val) => val >= 0 || 'Valor copago invalido']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                dense
                type="text"
                outlined
                label="Codigo Transaccion"
                v-model="state.currentAppointment.codeTransaction"
                :disable="disableCodeTransaction"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                dense
                label="Metodo Pago"
                outlined
                v-model="state.currentAppointment.paymentMethod"
                @update:model-value="(val) => changePaymentMethod(val)"
                :options="store.allPaymentOptions"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="description"
                map-options
                emit-value
                stack-label
                :rules="[(val) => (val && val != null) || FIELD_REQUIRED]"
              ></q-select>
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md-4">
              <q-input
                prefix="$"
                dense
                type="number"
                outlined
                v-model="state.currentAppointment.price"
                label="Valor Consulta"
                @update:model-value="(val) => calculateAmountPaid(val)"
                lazy-rules
                :rules="[numberRequired]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-checkbox
                size="md"
                v-model="state.currentAppointment.isPrivate"
                val="lg"
                label="Cita Particular"
                @update:model-value="(val) => calculateAmountPaid(val)"
              />
            </div>
          </div>

          <div class="row q-col-gutter-x-md">
            <div class="col-12 col-md-4 align-xright">
              <q-input
                outlined
                :bg-color="
                  state.currentAppointment.amountPaid > 0 ? 'green' : 'red'
                "
                readonly
                dense
                hint="Total monto a pagar"
                v-model="state.currentAppointment.amountPaid"
                type="number"
                prefix="$"
                :rules="[noLowerZero]"
              >
              </q-input>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-actions align="right" class="text-teal">
      <q-btn
        label="Guardar"
        type="submit"
        color="primary"
        :disable="disableButtonSave"
      />
    </q-card-actions>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import {
  DoctorSpecialityResponse,
  EventScheduleResponse,
  HealthInsuranceResponse,
  PatientResponse,
  PatientStatusResponse,
} from 'src/Domine/Responses';
import { IAppointment, ISpeciality } from 'src/Domine/ModelsDB';
import {
  OPTIONS_HOURS,
  OPTIONS_MINUTES,
  CURRENTYEAR_MONTH,
  FORMAT_DATETIME,
  FIELD_REQUIRED,
} from 'src/Application/Utilities';
import { AppointmentAdapter } from 'src/Adapters';
import { PaymentOptionsService } from 'src/Application/Services/PaymentOptionsService';
import {
  required,
  noLowerZero,
  isNotNull,
  numberRequired,
} from 'src/Application/Utilities/Helpers';
import {
  AppointmentMediator,
  PatientMediator,
  ScheduleMediator,
  SettingsMediator,
} from 'src/Infraestructure/Mediators';
import { QForm } from 'quasar';
import { AppointmentState } from 'src/Domine/IStates';
import 'src/css/app.sass';

export default defineComponent({
  name: 'Appointment_Form',
  setup() {
    const HOURS_ALLOWED = OPTIONS_HOURS;
    const MINUTES_ALLOWED = OPTIONS_MINUTES;
    // const CURRENTYEARMONTH = CURRENTYEAR_MONTH;
    // const FORMATDATETIME = FORMAT_DATETIME;
    const form = ref<QForm>();
    const state: AppointmentState = reactive({
      identificationPatient: '',
      // currentHealthInsurance: null,
      reasonConsult: null,
      currentAppointment: { isPrivate: false } as IAppointment,
      // currentPatient: {
      //   insurance: {} as HealthInsuranceResponse,
      // } as PatientResponse,
      allPaymentOptions: [],
      allReasonConsult: [],
      allPatientStatus: [],
      start: '',
      end: '',
      schedule: {
        patient: { insurance: {} },
        speciality: {},
        doctor: {},
        end: '',
        start: '',
      } as EventScheduleResponse,
    });
    const controller = AppointmentAdapter.getInstance(state);
    const mediator = AppointmentMediator.getInstance();
    const patientMediator = PatientMediator.getInstance();
    const settingsMediator = SettingsMediator.getInstance();
    const scheduleMediator = ScheduleMediator.getInstance();
    const servicePaymentOptions = PaymentOptionsService.getInstance();
    const listInsurancePatient = ref<Array<HealthInsuranceResponse>>([]);
    const store = mediator.getStore();
    const disableButtonSave = ref<boolean>(true);
    const disableCodeTransaction = ref<boolean>(false);

    onMounted(async () => {
      await mediator.getAllPaymentOptions();
      await mediator.getAllReasonConsult();
      await mediator.getAllPatientStatus();
    });
    // onUnmounted(async () => {
    //   state.currentPatient = {} as PatientResponse;
    //   state.currentAppointment = {} as IAppointment;
    //   state.identificationPatient = '';
    //   state.currentHealthInsurance = null;
    //   state.speciality = {} as ISpeciality;
    // });

    return {
      CURRENTYEAR_MONTH,
      HOURS_ALLOWED,
      MINUTES_ALLOWED,
      FORMAT_DATETIME,
      FIELD_REQUIRED,
      form,
      disableButtonSave,
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        const confirm = await controller.showModalConfirmation();
        if (confirm == false) return;
        const response = await controller.saveOrUpdate();
        if (response != null) {
          controller.clear();
          form.value?.reset();
        }
      },
      async changePaymentMethod(idPaymentOption: number) {
        const isCash = await servicePaymentOptions.paymentIsCash(
          idPaymentOption
        );
        disableCodeTransaction.value = isCash;
        controller.paymentIsCash(isCash);
      },

      calculateAmountPaid(val: any) {
        controller.calculateAmountPaid();
      },

      async patientHasAppointment() {
        console.log(state.schedule.id);
        const patient = await patientMediator.searchByIdentificacion(
          state.identificationPatient
        );
        if (patient === null) {
          await patientMediator.patientNotFound();
          return;
        }
        const schedule = await scheduleMediator.findByIdentificationPatient(
          patient.identification.toString()
        );
        if (schedule === null) {
          await scheduleMediator.scheduleNotFound();
          return;
        }
        state.schedule = schedule;
        state.currentAppointment.schedule = schedule.id;
        state.schedule.start = new Date(schedule.start).toLocaleString();
        state.schedule.end = new Date(schedule.end).toLocaleString();
        disableButtonSave.value = false;
        // state.currentPatient = schedule.patient;
        // state.currentHealthInsurance = schedule.patient.insurance;
        // state.currentDoctor = schedule.doctor;
      },
      listInsurancePatient,
      state,
      store,
      disableCodeTransaction,
      required,
      noLowerZero,
      numberRequired,
      isNotNull,
    };
  },
});
</script>

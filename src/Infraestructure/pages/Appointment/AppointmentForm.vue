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
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="currentHealthInsurance.nameInsurance"
                label="Entidad"
                disable
              />
            </div>
            <div class="col-6 col-md">
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
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="currentPatient.name"
                label="Nombre Paciente"
                disable
              />
            </div>
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="currentPatient.lastName"
                label="Apellido Paciente"
                disable
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-slide-transition>
        <div>
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">Datos Consulta</q-item-label>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-6">
                  <q-input
                    dense
                    type="text"
                    outlined
                    v-model="speciality.description"
                    label="Especialidad"
                    disable
                    hint=" "
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    dense
                    outlined
                    v-model="currentAppointment.date"
                    label="Fecha Cita"
                    hint="Finalizacion Cita"
                    disable
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
                    v-model="currentAppointment.authorizationNumber"
                    label="N° Autorización"
                    lazy-rules
                    :rules="[(val) => val > 0 || 'Autorizacion invalida']"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    dense
                    label="Razon Consulta"
                    outlined
                    v-model="currentAppointment.reasonConsult"
                    :options="allReasonConsult"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="abbreviation"
                    map-options
                    emit-value
                    stack-label
                    :rules="[
                      (val) =>
                        (val && val != null) || 'Razon consulta es requerida',
                    ]"
                  ></q-select>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    dense
                    outlined
                    v-model="currentAppointment.patientStatus"
                    :options="allPatientStatus"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    map-options
                    emit-value
                    stack-label
                    label="Estado Paciente"
                    :rules="[
                      (val) =>
                        (val && val != null) || 'Estado Paciente es requerido',
                    ]"
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
                    v-model="currentAppointment.copayment"
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
                    v-model="currentAppointment.codeTransaction"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    dense
                    label="Metodo Pago"
                    outlined
                    v-model="currentAppointment.paymentMethod"
                    :options="allPaymentOptions"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    map-options
                    emit-value
                    stack-label
                    :rules="[
                      (val) =>
                        (val && val != null) || 'Razon consulta es requerida',
                    ]"
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
                    v-model="currentAppointment.price"
                    label="Valor Consulta"
                    @update:model-value="(val) => calculateAmountPaid(val)"
                    lazy-rules
                    :rules="[(val) => val >= 0 || 'Valor consulta invalido']"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <!-- <div class="col-12 col-md-4">
                  <q-input
                    prefix="$"
                    dense
                    type="number"
                    outlined
                    v-model="currentAppointment.copayment"
                    label="Copago"
                    @update:model-value="(val) => calculateAmountPaid(val)"
                    lazy-rules
                    :rules="[(val) => val >= 0 || 'Valor copago invalido']"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    prefix="$"
                    dense
                    type="number"
                    outlined
                    v-model="currentAppointment.price"
                    label="Valor Consulta"
                    @update:model-value="(val) => calculateAmountPaid(val)"
                    lazy-rules
                    :rules="[(val) => val >= 0 || 'Valor consulta invalido']"
                  />
                </div> -->
                <div class="col-12 col-md-4 align-xright">
                  <q-input
                    outlined
                    :bg-color="
                      currentAppointment.amountPaid > 0 ? 'green' : 'red'
                    "
                    readonly
                    dense
                    hint="Total monto a pagar"
                    v-model="currentAppointment.amountPaid"
                    type="number"
                    prefix="$"
                  >
                  </q-input>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </q-slide-transition>
    </q-list>
    <q-card-actions align="right" class="text-teal">
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-card-actions>
  </q-form>
</template>
<script lang="ts">
import { date } from 'quasar';
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { PatientResponse, PaymentOptionsResponse } from 'src/Domine/Responses';
import { IAppointment, IPaymentOptions } from 'src/Domine/ModelsDB';
import {
  OPTIONS_HOURS,
  OPTIONS_MINUTES,
  CURRENTYEAR_MONTH,
  FORMAT_DATETIME,
} from 'src/Application/Utilities';
import {
  AppointmentAdapter,
  PatientAdapter,
  ScheduleAdapter,
} from 'src/Adapters';
import { useStorePatient } from 'src/Infraestructure/stores/PatientsPage/PatientStore';
import { useStoreAppointments } from 'src/Infraestructure/stores/Appointment/AppointmentStore';
import { useStoreSchedule } from 'src/Infraestructure/stores/SchedulePage/ScheduleStore';
import { CommonService } from 'src/Application/Services/CommonTest';
import { PaymentOptionsService } from 'src/Application/Services/PaymentOptionsService';
import { ReasonConsultService } from 'src/Application/Services/ReasonConsultService';
import { PatientStatusService } from 'src/Application/Services/PatientStatusService';
import 'src/css/app.sass';

export default defineComponent({
  setup() {
    const HOURS_ALLOWED = OPTIONS_HOURS;
    const MINUTES_ALLOWED = OPTIONS_MINUTES;
    // const CURRENTYEARMONTH = CURRENTYEAR_MONTH;
    // const FORMATDATETIME = FORMAT_DATETIME;
    const store = useStoreAppointments();
    const storePatient = useStorePatient();
    const {
      identificationPatient,
      currentAppointment,
      form,
      currentPatient,
      currentPatientStatus,
      currentHealthInsurance,
      speciality,
      reasonConsult,
      currentDoctor,
      allPaymentOptions,
      allReasonConsult,
      allPatientStatus,
      currentPaymentOption,
      // searchPatient,
      // confirmChanges,
      // calculateAmountPaid,
      // patientStatusChanged,
    } = storeToRefs(store);
    const service = AppointmentAdapter.getInstance(useStoreAppointments());
    // const { allSpecialities, clearSpeciality, getAllSpecialities } =
    //   specialityService();
    // const {
    //   dxMainCodeofSpeciality,
    //   getAllDxMainCode,
    //   dxMainCode,
    //   currentDxMainCode,
    //   dxMainCodeChanged,
    // } = dxMainCodeService();
    const {
      // allReasonConsult,
      // allPatientStatus,
      // getAllReasonConsult,
      // getAllPatientStatus,
    } = storeToRefs(storePatient);
    // const servicePatient = patientService.getInstance();
    const patientAdapter = PatientAdapter.getInstance(useStorePatient());
    const scheduleAdapter = ScheduleAdapter.getInstance(useStoreSchedule());
    const servicePaymentOptions = PaymentOptionsService.getInstance();
    const serviceReasonConsult = ReasonConsultService.getInstance();
    const servicePatienStatus = PatientStatusService.getInstance();

    onMounted(async () => {
      // const repo = new PaymentOptionsRepository();
      // const repositoryPaymentOption = new CommonService<
      //   IPaymentOptions,
      //   PaymentOptionsResponse
      // >(repo);

      allPaymentOptions.value = await servicePaymentOptions.getAll();
      allReasonConsult.value = await serviceReasonConsult.getAll();
      allPatientStatus.value = await servicePatienStatus.getAll();
      // getAllSpecialities();
      // await servicePatient.getAllReasonConsult();
      // await servicePatient.getAllPatientStatus();
    });
    onUnmounted(async () => {
      currentPatient.value = {} as PatientResponse;
      currentAppointment.value = {} as IAppointment;
    });

    return {
      CURRENTYEAR_MONTH,
      HOURS_ALLOWED,
      MINUTES_ALLOWED,
      FORMAT_DATETIME,
      currentHealthInsurance,
      reasonConsult,
      allReasonConsult,
      allPatientStatus,
      currentPaymentOption,
      form,
      currentAppointment,
      allPaymentOptions,
      currentPatientStatus,
      identificationPatient,
      confirmChanges() {
        service.processRequest();
      },
      calculateAmountPaid() {
        service.calculateAmountPaid();
      },
      async searchPatient() {
        // service.searchPatient();
        const patient = await patientAdapter.searchByIdentificacion(
          identificationPatient.value
        );
        if (patient === null) {
          await patientAdapter.patientNotFound();
          return;
        }
        // const queryParameters = {
        //   patientIdentification: patient.identification,
        // };
        const schedule = await scheduleAdapter.findByIdentificationPatient(
          patient.identification.toString()
        );
        if (schedule === null) {
          await scheduleAdapter.scheduleNotFound();
          return;
        }
        currentAppointment.value.schedule = schedule.id;
        currentAppointment.value.date = date.formatDate(
          schedule.start,
          FORMAT_DATETIME
        );
        currentPatient.value = schedule.patient;
        currentHealthInsurance.value = schedule.patient.insurance;
        speciality.value = schedule.speciality;
        currentDoctor.value = schedule.doctor;
        // currentPatient.value = patient;
      },
      // patientStatusChanged() {
      //   service.patientStatusChanged(currentPatientStatus.value);
      // },
      // allSpecialities,
      speciality,
      // clearSpeciality,
      currentPatient,
      filter: '',
      mode: 'list',
      deposit: {},
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
});
</script>

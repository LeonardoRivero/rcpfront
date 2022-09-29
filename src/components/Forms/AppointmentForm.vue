<template>
  <q-form @submit="confirmChanges" :ref="formAppointment">
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
                        navigation-min-year-month="2022/09"
                        mask="YYYY-MM-DD HH:mm"
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
                        mask="YYYY-MM-DD HH:mm"
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
              />
            </div>
            <div class="col-6 col-md">
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
      <div v-if="hasArrowForExpanded">
        <q-card-actions align="right" class="text-teal">
          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
            @click="expanded = !expanded"
          />
        </q-card-actions>
      </div>
      <q-slide-transition>
        <div v-show="expanded">
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">Datos Consulta</q-item-label>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-4">
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
                    @update:model-value="(val) => specialityChanged(val)"
                    @clear="(val) => clearSpeciality(val)"
                    :rules="[
                      (val) =>
                        (val && val != null) || 'Especialidad es requerida',
                    ]"
                  >
                  </q-select>
                </div>
                <div class="col-12 col-md-8">
                  <q-select
                    dense
                    clearable
                    outlined
                    v-model="dxMainCode"
                    :options="dxMainCodeofSpeciality"
                    option-value="id"
                    option-label="description"
                    map-options
                    label="Codigo Principal"
                    :hint="Codigo"
                    :rules="[
                      (val) =>
                        (val && val != null) || 'Codigo Principal es requerido',
                    ]"
                  ></q-select>
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
                    v-model="reasonConsult"
                    :options="allReasonConsult"
                    option-value="id"
                    option-label="abbreviation"
                    map-options
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
                    clearable
                    outlined
                    v-model="currentAppointment.patientStatus"
                    :options="allPatientStatus"
                    option-value="id"
                    option-label="description"
                    map-options
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
                <div class="col-12 col-md-4">
                  <q-input
                    outlined
                    disable
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
  <ModalCommon />
  <!-- </q-card-section>
        </q-card> -->
  <!-- </div> -->
  <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="my-card" bordered>
          <q-card-section>
            <div class="text-h6">Historial Citas Paciente</div>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <q-table
              :data="data"
              :hide-header="mode === 'grid'"
              :columns="columns"
              row-key="name"
              :grid="mode == 'grid'"
              :filter="filter"
              :pagination="pagination"
            >
              <template v-slot:top-right="props">
                <q-input
                  outlined
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Search"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <q-btn
                  flat
                  round
                  dense
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen"
                  v-if="mode === 'list'"
                >
                  <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
                    >{{
                      props.inFullscreen
                        ? 'Exit Fullscreen'
                        : 'Toggle Fullscreen'
                    }}
                  </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  dense
                  :icon="mode === 'grid' ? 'list' : 'grid_on'"
                  @click="
                    mode = mode === 'grid' ? 'list' : 'grid';
                    separator = mode === 'grid' ? 'none' : 'horizontal';
                  "
                  v-if="!props.inFullscreen"
                >
                  <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
                    >{{ mode === 'grid' ? 'List' : 'Grid' }}
                  </q-tooltip>
                </q-btn>

                <q-btn
                  color="primary"
                  icon-right="archive"
                  label="Export to csv"
                  no-caps
                  @click="exportDepositsTable"
                />
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div> -->
  <!-- </div> -->
  <!-- </q-page> -->
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { exportFile } from 'quasar';
import Patients from 'src/components/Forms/PatientForm.vue';
import { appointmentService } from 'src/services/AppointmentService';
import { patientService } from 'src/services/PatientService';
import { specialityService } from 'src/services/SpecialityService';
import { dxMainCodeService } from 'src/services/DxMainCodeService';
import ModalCommon from 'src/components/commons/ModalCommon.vue';

export default defineComponent({
  components: { ModalCommon },
  setup() {
    const {
      hasArrowForExpanded,
      expanded,
      identificationPatient,
      currentAppointment,
      formAppointment,
      currentPatient,
      formattedTime,
      dxMainCode,
      reasonConsult,
      show, //verificar si se esta usando sino borrar
      hoursAllowed,
      minutesAllowed,
      searchPatient,
      confirmChanges,
      calculateAmountPaid,
    } = appointmentService();
    const { allSpecialities, speciality, specialityChanged, clearSpeciality } =
      specialityService();
    const { dxMainCodeofSpeciality } = dxMainCodeService();
    const { allReasonConsult, allPatientStatus } = patientService();

    return {
      hoursAllowed,
      minutesAllowed,
      show, //verificar si se esta usando sino borrar
      reasonConsult,
      allReasonConsult,
      allPatientStatus,
      dxMainCode,
      formattedTime,
      formAppointment,
      currentAppointment,
      identificationPatient,
      confirmChanges,
      calculateAmountPaid,
      searchPatient,
      hasArrowForExpanded,
      expanded,
      // date,
      allSpecialities,
      speciality,
      clearSpeciality,
      specialityChanged,
      // saveAppointment,
      currentPatient,
      dxMainCodeofSpeciality,
      filter: '',
      mode: 'list',
      deposit: {},
      pagination: {
        rowsPerPage: 10,
      },
      options: ['Primera Vez', 'Control', 'Post-Quirurgico '],
      columns: [
        {
          name: 'description',
          align: 'left',
          label: 'Description',
          field: 'description',
          sortable: true,
        },
        {
          name: 'amount',
          label: 'Amount',
          align: 'left',
          field: 'amount',
          sortable: true,
        },
      ],
      data: [
        {
          description: 'Invoice 10 Payment',
          amount: '$ 200',
        },
        {
          description: 'Pvt Ltd Invoice',
          amount: '$ 300',
        },
        {
          description: 'Invoice 6 Payment',
          amount: '$ 250',
        },
        {
          description: 'Invoice 18 Payment',
          amount: '$ 400',
        },
        {
          description: 'John and company Payment',
          amount: '$ 500',
        },
      ],
    };
  },
  // methods: {
  //   exportDepositsTable() {
  //     // naive encoding to csv format
  //     const content = [this.columns.map((col) => wrapCsvValue(col.label))]
  //       .concat(
  //         this.data.map((row) =>
  //           this.columns
  //             .map((col) =>
  //               wrapCsvValue(
  //                 typeof col.field === 'function'
  //                   ? col.field(row)
  //                   : row[col.field === void 0 ? col.name : col.field],
  //                 col.format
  //               )
  //             )
  //             .join(',')
  //         )
  //       )
  //       .join('\r\n');
  //     const status = exportFile('deposits.csv', content, 'text/csv');
  //     if (status !== true) {
  //       this.$q.notify({
  //         message: 'Browser denied file download...',
  //         color: 'negative',
  //         icon: 'warning',
  //       });
  //     }
  //   },
  //   showLoading() {
  //     // this.$q.loading.show({
  //     //   message: '<b>Demo loading screen, replace your message here<b>',
  //     // });
  //     // // hiding in 2s
  //     // this.timer = setTimeout(() => {
  //     //   this.$q.loading.hide();
  //     //   this.timer = void 0;
  //     // }, 3000);
  //   },
  //   beforeDestroy() {
  //     if (this.timer !== void 0) {
  //       clearTimeout(this.timer);
  //       this.$q.loading.hide();
  //     }
  //   },
  // },
  // beforeMount() {
  //   this.showLoading();
  // },
});
</script>
<style lang="sass" scoped>
.my-card
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.2)
    transition: all ease 0.2s

.my-card:hover
    transition: all ease 0.2s
    box-shadow: inherit
    box-shadow: 5px 5px 20px 5px rgba(0,0,0,0.3)
</style>

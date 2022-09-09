<template>
  <q-page>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="my-card" bordered>
          <q-card-section>
            <div class="text-h6">Agregar/Actualizar Cita</div>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <q-form>
              <q-list>
                <q-item>
                  <q-item-section>
                    <!-- <q-item-label class="q-pb-xs"
                      >Nombres Paciente</q-item-label
                    > -->
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          dense
                          outlined
                          v-model="deposit.description"
                          label="Nombre Paciente"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <q-input
                          dense
                          outlined
                          v-model="deposit.description"
                          label="Apellido Paciente"
                        />
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
                          v-model="deposit.date"
                          mask="date"
                          label="Fecha Cita"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy
                                ref="depositDateProxy"
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date v-model="date" />
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
                          v-model="deposit.amount"
                          label="N° Identificacion"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <!-- <q-item>
                  <q-item-section>
                    <div class="row q-col-gutter-x-md"></div>
                    <q-select
                      dense
                      label="Account"
                      outlined
                      v-model="deposit.account"
                      :options="options"
                      stack-label
                      options-dense
                    ></q-select>
                  </q-item-section>
                </q-item> -->
                <div v-if="expandedT">
                  <q-card-actions align="right" class="text-teal">
                    <q-btn
                      color="grey"
                      round
                      flat
                      dense
                      :icon="
                        expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
                      "
                      @click="expanded = !expanded"
                    />
                  </q-card-actions>
                </div>
                <q-slide-transition>
                  <div v-show="expanded">
                    <q-item>
                      <q-item-section>
                        <div class="row q-col-gutter-x-md">
                          <div class="col-6 col-md">
                            <q-input
                              dense
                              type="number"
                              outlined
                              v-model="deposit.amount"
                              label="Copago"
                            />
                          </div>
                          <div class="col-6 col-md">
                            <q-input
                              dense
                              type="number"
                              outlined
                              v-model="deposit.phone"
                              label="Phone"
                            />
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-slide-transition>
              </q-list>
              <q-card-actions align="right" class="text-teal">
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  v-close-popup
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent } from 'vue';
import { exportFile } from 'quasar';
import Patients from 'src/components/Forms/PatientForm.vue';
import { appointmentService } from 'src/services/AppointmentService';
// function wrapCsvValue(val, formatFn) {
//   let formatted = formatFn !== void 0 ? formatFn(val) : val;
//   formatted =
//     formatted === void 0 || formatted === null ? '' : String(formatted);
//   formatted = formatted.split('"').join('""');
//   return `"${formatted}"`;
// }
export default defineComponent({
  components: {},
  setup() {
    const { expandedT, expanded } = appointmentService();

    // const expanded = ref(false);
    const date = ref('2019/02/01');
    return {
      expandedT,
      expanded,
      date,
      filter: '',
      mode: 'list',
      deposit: {},
      pagination: {
        rowsPerPage: 10,
      },
      options: [
        'National Bank',
        'Bank of Asia',
        'Corporate Bank',
        'Public Bank',
      ],
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
  methods: {
    exportDepositsTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(',')
          )
        )
        .join('\r\n');
      const status = exportFile('deposits.csv', content, 'text/csv');
      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning',
        });
      }
    },
    showLoading() {
      // this.$q.loading.show({
      //   message: '<b>Demo loading screen, replace your message here<b>',
      // });
      // // hiding in 2s
      // this.timer = setTimeout(() => {
      //   this.$q.loading.hide();
      //   this.timer = void 0;
      // }, 3000);
    },
    beforeDestroy() {
      if (this.timer !== void 0) {
        clearTimeout(this.timer);
        this.$q.loading.hide();
      }
    },
  },
  beforeMount() {
    this.showLoading();
  },
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

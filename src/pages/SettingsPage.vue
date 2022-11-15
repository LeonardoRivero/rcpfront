<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="Insurance" label="Entidades" />
          <q-tab name="Speciality" label="Especialidad" />
          <q-tab name="MedicalHistory" label="Historia Clinica" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Insurance">
            <div class="row">
              <div class="col-6 col-md offset-6"><Insurance /></div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="Speciality">
            <div class="row">
              <div class="col-4 col-md-4 col-sm-12 col-xs-12">
                <SpecialityForm />
              </div>
              <div class="col-4 col-md-4 col-sm-12 col-xs-12">
                <DxMainCode />
              </div>
              <div class="col-4 col-md-4 col-sm-12 col-xs-12">
                <RelationCode />
              </div>
            </div>
            <DataTable />
          </q-tab-panel>
          <q-tab-panel name="MedicalHistory">
            <div class="row"><ClinicHistorySetting2 /></div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SpecialityForm from 'src/components/Forms/SpecialityForm.vue';
import DxMainCode from 'src/components/Forms/DxMainCodeForm.vue';
import RelationCode from 'src/components/Forms/RelationCode.vue';
import Insurance from 'src/components/Forms/InsuranceForm.vue';
import DataTable from 'src/components/commons/DataTable.vue';
import ClinicHistorySetting2 from 'src/components/Forms/ClinicHistorySetting2.vue';

export default defineComponent({
  components: {
    SpecialityForm,
    DxMainCode,
    RelationCode,
    Insurance,
    DataTable,
    ClinicHistorySetting2,
  },

  setup() {
    return {
      tab: ref('Insurance'),
      splitterModel: ref(20),
    };
  },
});
</script>
<style lang="sass" scoped>
.row > div
  padding: 5px 5px
.row + .row
  margin-top: 1rem
</style>

<template>
  <div>
    <!-- <q-card>
      <q-tabs
        v-model="tab"
        dense
        no-caps
        inline-label
        align="justify"
        class="text-blue"
      >
        <q-tab
          name="mails"
          icon="mdi-hospital-building"
          label="Entidad"
          class="bg-white"
        />
        <q-tab name="alarms" icon="mdi-numeric" label="CUPS" class="bg-white" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <div class="text-h6">{{ doubleCount }}Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <TableCUPS />
          <SpecialityForm />
          <div v-if="store.specialityForm.visible">
            <SpecialityForm />
          </div>
          <q-btn
            push
            color="white"
            text-color="primary"
            label="Push"
            @click="test"
          />
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <CUPS />
        </q-tab-panel>
      </q-tab-panels>
    </q-card> -->
    <div class="row">
      <div class="col-12 col-md"><Insurance /></div>
      <div class="col-12 col-md"><SpecialityForm /></div>
      <div class="col-12 col-md"><DxMainCode /></div>
      <div class="col-12 col-md"><RelationCode /></div>
    </div>
    <DataTable />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { ref } from 'vue';
import { useStoreSettings } from 'src/stores/storeSettings';
import SpecialityForm from 'src/components/Forms/SpecialityForm.vue';
import DxMainCode from 'src/components/Forms/DxMainCodeForm.vue';
import RelationCode from 'src/components/Forms/RelationCode.vue';
import Insurance from 'src/components/Forms/InsuranceForm.vue';
import DataTable from 'src/components/commons/DataTable.vue';

export default defineComponent({
  components: {
    SpecialityForm,
    DxMainCode,
    RelationCode,
    Insurance,
    DataTable,
  },

  setup() {
    const store = useStoreSettings();

    onMounted(async () => {
      // if (store.allSpecialities == undefined) {
      //   const response = await store.retrieveAllSpecialities();
      //   if (response.status == HttpStatusCodes.NOT_FOUND) {
      //     router.push('/:catchAll');
      //   }
      // }
    });
    return {
      tab: ref('mails'),
      store,
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

<template>
  <div>
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

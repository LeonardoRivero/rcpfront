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
    <div class="row justify-around">
      <div><SpecialityForm /></div>
      <div><DxMainCode /></div>
      <div><RelationCode /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useCounterStore } from 'src/stores/storeSettings';
import SpecialityForm from 'src/components/Forms/SpecialityForm.vue';
import DxMainCode from 'src/components/Forms/DxMainCodeForm.vue';
import RelationCode from 'src/components/Forms/RelationCode.vue';

export default defineComponent({
  components: { SpecialityForm, DxMainCode, RelationCode },

  setup() {
    const store = useCounterStore();
    const router = useRouter();

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

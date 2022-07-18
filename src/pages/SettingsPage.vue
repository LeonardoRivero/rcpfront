<template>
  <div>
    <q-card>
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
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useCounterStore } from 'src/stores/example-store';
import CUPS from 'src/components/CUPS.vue';
import TableCUPS from 'src/components/DataTable.vue';
import SpecialityForm from 'src/components/Forms/SpecialityForm.vue';
export default defineComponent({
  components: { CUPS, TableCUPS, SpecialityForm },

  setup() {
    const store = useCounterStore();
    const router = useRouter();
    const { doubleCount } = storeToRefs(store);
    const { increment } = store;

    onMounted(async () => {
      if (store.allSpecialities == undefined) {
        const response = await store.getAllInsurance();
        if (response.status == HttpStatusCodes.NOT_FOUND) {
          router.push('/:catchAll');
        }
      }
    });
    return {
      tab: ref('mails'),
      store,
      doubleCount,
      increment,
      async test() {
        store.counter = 8;
      },
    };
  },
});
</script>

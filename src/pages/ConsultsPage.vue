<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-12 col-md">
      <Consul />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Consults from 'src/components/CalendarConsults.vue';
import Consul from 'src/components/Forms/CaleForm.vue';

export default defineComponent({
  components: { Consul },
  setup() {
    test: ref(false);
  },
});
</script>

<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-12 col-md">
      <!-- <ConsultForm /> -->
      <Test />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ConsultForm from 'src/components/Forms/ConsultForm.vue';
import Test from 'src/components/Forms/TestFormd.vue';
export default defineComponent({
  components: { Test },
  setup() {
    test: ref(false);
  },
});
</script>

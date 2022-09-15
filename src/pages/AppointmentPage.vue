<template>
  <q-page>
    <div class="row q-col-gutter-x-md">
      <div class="col-12 col-md">
        <!-- <ConsultForm /> -->
        <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-card class="my-card" bordered>
              <q-card-section>
                <div class="text-h6">Agregar/Actualizar Cita</div>
              </q-card-section>
              <q-separator inset></q-separator>
              <q-card-section>
                <AppointmentForm />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ConsultForm from 'src/components/Forms/ConsultForm.vue';
import AppointmentForm from 'src/components/Forms/AppointmentForm.vue';
import { appointmentService } from 'src/services/AppointmentService';

export default defineComponent({
  components: { AppointmentForm },
  setup() {
    const { cardIsExpandible } = appointmentService();
    test: ref(false);
    onMounted(async () => {
      await cardIsExpandible(false);
    });
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

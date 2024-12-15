<template>
  <q-card class="bg-grey-1">
    <q-card-section>
      <div class="text-h6">Ultimas Citas</div>
    </q-card-section>
    <q-separator />
    <!-- <q-card-section v-if="state.scheduleForMedicalOffice.length > 0">
            <q-list bordered separator>
              <q-item
                v-for="schedule in state.scheduleForMedicalOffice"
                :key="schedule.id"
                clickable
                v-ripple
                @click="showAppointmentDetails(schedule.id)"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ schedule.patient.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    >{{ schedule.patient.name }}
                    {{ schedule.patient.lastName }}</q-item-label
                  >
                  <q-item-label caption
                    >Dr {{ schedule.doctor.name }}
                    {{ schedule.doctor.lastName }} -
                    {{
                      new Date(schedule.start).toLocaleString()
                    }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="primary" icon="info" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section> -->
    <q-card-section>
      <q-list separator> No se encontraron datos para mostrar</q-list>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  console.log('hola');
</script>

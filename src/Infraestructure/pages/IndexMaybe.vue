<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Acciones Rápidas -->
      <div class="col-12 col-md-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Acciones Rápidas</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="column q-gutter-y-sm">
              <q-btn
                color="primary"
                icon="person_add"
                label="Nuevo Paciente"
                @click="onNewPatient"
              />
              <q-btn
                color="secondary"
                icon="event"
                label="Agendar Cita"
                @click="onScheduleAppointment"
              />
              <q-btn
                color="accent"
                icon="search"
                label="Buscar Paciente"
                @click="onSearchPatient"
              />
              <q-btn
                color="info"
                icon="description"
                label="Generar Informe"
                @click="onGenerateReport"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Próximas Citas -->
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Próximas Citas</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list bordered separator>
              <q-item
                v-for="appointment in upcomingAppointments"
                :key="appointment.id"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ appointment.patientName.charAt(0) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ appointment.patientName }}</q-item-label>
                  <q-item-label caption
                    >{{ appointment.doctorName }} -
                    {{ appointment.time }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="info"
                    @click="showAppointmentDetails(appointment.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Resultados Pendientes -->
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Resultados Pendientes</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list bordered separator>
              <q-item
                v-for="result in pendingResults"
                :key="result.id"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-avatar color="warning" text-color="white" icon="pending" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ result.patientName }}</q-item-label>
                  <q-item-label caption
                    >{{ result.testType }} - {{ result.date }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="warning"
                    icon="visibility"
                    @click="viewPendingResult(result.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  // Datos de ejemplo (en una aplicación real, estos datos vendrían de una API o store)
  const stats = ref({
    totalPatients: 1250,
    appointmentsToday: 28,
    pendingResults: 15,
    availableDoctors: 8,
  });

  const upcomingAppointments = ref([
    {
      id: 1,
      patientName: 'Juan Pérez',
      doctorName: 'Dra. García',
      time: '10:00 AM',
    },
    {
      id: 2,
      patientName: 'María López',
      doctorName: 'Dr. Rodríguez',
      time: '11:30 AM',
    },
    {
      id: 3,
      patientName: 'Carlos Gómez',
      doctorName: 'Dra. Martínez',
      time: '2:00 PM',
    },
  ]);

  const pendingResults = ref([
    {
      id: 1,
      patientName: 'Ana Torres',
      testType: 'Análisis de Sangre',
      date: '2023-05-15',
    },
    {
      id: 2,
      patientName: 'Pedro Sánchez',
      testType: 'Radiografía',
      date: '2023-05-16',
    },
    {
      id: 3,
      patientName: 'Laura Ramírez',
      testType: 'Electrocardiograma',
      date: '2023-05-17',
    },
  ]);

  // Funciones para manejar las acciones
  const onNewPatient = () => {
    $q.notify({
      color: 'positive',
      message: 'Redirigiendo a formulario de nuevo paciente',
      icon: 'person_add',
    });
  };

  const onScheduleAppointment = () => {
    $q.notify({
      color: 'secondary',
      message: 'Abriendo agenda de citas',
      icon: 'event',
    });
  };

  const onSearchPatient = () => {
    $q.notify({
      color: 'accent',
      message: 'Abriendo búsqueda de pacientes',
      icon: 'search',
    });
  };

  const onGenerateReport = () => {
    $q.notify({
      color: 'info',
      message: 'Generando informe',
      icon: 'description',
    });
  };

  const showAppointmentDetails = (id: number) => {
    $q.dialog({
      title: 'Detalles de la Cita',
      message: `Mostrando detalles de la cita ID: ${id}`,
    });
  };

  const viewPendingResult = (id: number) => {
    $q.dialog({
      title: 'Resultado Pendiente',
      message: `Visualizando resultado pendiente ID: ${id}`,
    });
  };
</script>

<style scoped>
  .my-card {
    width: 100%;
  }
</style>

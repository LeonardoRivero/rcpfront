<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
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
          <q-card-section v-if="state.scheduleForMedicalOffice.length > 0">
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
          </q-card-section>
          <q-card-section v-if="state.scheduleForMedicalOffice.length == 0">
            <q-list separator> No se encontraron datos para mostrar</q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Resultados Pendientes -->
      <!-- <div class="col-12 col-md-6">
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
      </div> -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';
  import { IndexBloc, NotificatorIndexBloc } from 'src/Adapters/IndexBloc';
  import { usePlocState } from '../Utilities/usePlocState';
  import { routerInstance } from 'src/boot/globalRouter';
  import { AppointmentBloc } from 'src/Adapters';

  const dependenciesLocator = inject<any>('dependenciesLocator');
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  const controller = <IndexBloc>dependenciesLocator.provideIndexBloc();
  const controllerInfoPatientPanel = <IndexBloc>(
    dependenciesLocator.provideInfoPatientPanelPloc()
  );

  const controllerAppointmentBloc = <AppointmentBloc>(
    dependenciesLocator.provideAppointmentBloc()
  );

  const state = usePlocState(controller);
  const notificatorIndexBloc = new NotificatorIndexBloc();
  notificatorIndexBloc.attach(controllerInfoPatientPanel);
  notificatorIndexBloc.attach(controllerAppointmentBloc);

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
  });
  const $q = useQuasar();

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

  function showAppointmentDetails(id: number) {
    const schedule = state.value.scheduleForMedicalOffice.find(
      (s) => s.id === id
    );
    if (schedule === undefined) return;
    notificatorIndexBloc.notify(schedule);
    routerInstance.push('/appointment');
  }

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

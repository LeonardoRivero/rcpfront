<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Configuraciones" icon="mdi-cog" />
      </q-breadcrumbs>
    </div>
    <div class="row justify-end">
      <div style="overflow: auto">
        <q-btn
          label="Agregar"
          icon="add"
          color="primary"
          :to="'/medicaloffice/add'"
        />
      </div>
    </div>
    <br />
    <br />
    <q-table
      :rows="state.medicalOfficeBelongToDoctor"
      :columns="columns"
      flat
      title="Consultorios"
      dense
      row-key="id"
      no-data-label="Lo sentimos... No hay datos para mostrar"
      :loading="loading"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <q-item-label header> {{ col.label }}</q-item-label>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
          <q-td key="city" :props="props">
            {{ props.row.city.town }}
          </q-td>
          <q-td key="phoneNumber" :props="props">
            {{ props.row.phoneNumber }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="editMedicalOffice(props)"
              icon="edit"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="removeRow(props)"
              icon="delete"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { QTableColumn } from 'quasar';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import {
    ListMedicalOfficeBloc,
    MedicalOfficeBloc,
    NotificatorListMedicalOfficeBloc,
  } from 'src/Adapters/MedicalOfficeBloc';
  import { IHandleUserState } from 'src/Domine/IPatterns';
  import { MedicalOfficeResponse } from 'src/Domine/Responses';
  import 'src/css/app.sass';

  const loading = ref(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const columns: QTableColumn<MedicalOfficeResponse>[] = [
    {
      name: 'name',
      label: 'Nombre',
      align: 'center',
      field: 'name',
    },
    {
      name: 'address',
      label: 'Direccion',
      align: 'left',
      field: 'address',
    },
    {
      name: 'city',
      label: 'Ciudad',
      align: 'center',
      field: (row) => row.city.town,
    },
    {
      name: 'phoneNumber',
      label: 'Numero Telefonico',
      align: 'center',
      field: (row) => row.phoneNumber,
    },
    {
      name: 'actions',
      label: 'Acciones',
      align: 'center',
      field: 'address',
    },
  ];

  const controller = <ListMedicalOfficeBloc>(
    dependenciesLocator.provideListMedicalOfficeBloc()
  );

  const controllerMedicalOfficeBloc = <MedicalOfficeBloc>(
    dependenciesLocator.provideMedicalOfficeBloc()
  );
  const state = usePlocState(controller);

  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );

  const notificatorIndexBloc = new NotificatorListMedicalOfficeBloc();
  notificatorIndexBloc.attach(controllerMedicalOfficeBloc);

  onMounted(async () => {
    loading.value = true;
    const userInfo = handleUserState.getInfoUser();
    await controller.getListMedicalOffice(userInfo.userId);
    loading.value = false;
  });

  function removeRow(props: unknown) {
    console.log(props);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function editMedicalOffice(evt: any) {
    await controller.redirectToEdition(evt.key);
    notificatorIndexBloc.notify(state.value.medicalOfficeResponse);
  }
</script>

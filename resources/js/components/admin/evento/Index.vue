<template>
  <v-container fluid>
    <v-toolbar>
        <v-toolbar-title>Eventos</v-toolbar-title>
        <v-spacer></v-spacer>        
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-toolbar-title>
          <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
              width="20px"
            ></v-text-field>
        </v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <Form :bus="bus"/>
        <RemoveItem :bus="bus"/>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="table"
      :search="search"
      class="elevation-1"
      :loading="loading" 
      loading-text="Cargando... Espere por favor"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-card>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td><strong>Sector: </strong></td>
                    <td>{{ item.sector.nombre }}</td>
                  </tr>
                  <tr>
                    <td><strong>Nombre: </strong></td>
                    <td>{{ item.nombre }}</td>
                  </tr>
                  <tr>
                    <td><strong>Teléfono: </strong></td>
                    <td>{{ item.telefono }}</td>
                  </tr>
                  <tr>
                    <td><strong>Referencia Técnico de apoyo: </strong></td>
                    <td>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <td>Nombre</td>
                              <td>Teléfono</td>
                              <td>Institución</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(temp, index) in item.referencia_apoyo" :key="index">
                              <td>{{ temp.nombre }}</td>
                              <td>{{ temp.telefono }}</td>
                              <td>{{ temp.unidad }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Avanzada: </strong></td>
                    <td>{{ item.avanzada }}</td>
                  </tr>
                  <tr>
                    <td><strong>Delegado: </strong></td>
                    <td>{{ item.delegado.nombre }}</td>
                  </tr>
                  <tr>
                    <td><strong>Fecha y hora: </strong></td>
                    <td>{{ formatDate(item.fecha_hora) }}</td>                    
                  </tr>
                  <tr>
                    <td><strong>Observaciones: </strong></td>
                    <td>{{ item.observaciones }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </td>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)" flat icon color="indigo"> edit </v-icon>
        <v-icon small @click="removeItem(item)" flat icon color="red darken-3">delete </v-icon>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="fa fa-times">
        Tu Busqueda de "{{ search }}" no encontró resultados.
      </v-alert>
      <template slot="no-data">
        <v-alert slot="no-results" :value="true" color="info" icon="fa fa-times" class="white--text">
          Sin resultados.
        </v-alert>
      </template>
    </v-data-table>
  </v-container>
</template>
<script type="text/javascript">
import Vue from "vue";
import axios from 'axios'
import RemoveItem from "../RemoveItem";
import Form from "./Form";

export default {
  components: {
    RemoveItem,
    Form,
  },
  data: () => ({
    bus: new Vue(),
    headers: [
      { 
        text: '', 
        value: 'data-table-expand' 
      },
      {
        text: "Institución",
        value: "institucion.nombre",
        align: "center"
      },
      {
        text: "Actividad",
        value: "actividad",
        align: "center"
      },
      {
        text: "Lugar",
        value: "lugar.nombre",
        align: "center"
      },
      {
        text: "Opciones",
        align: "center",
        sortable: false,
        value: "action"
      }
    ],
    table: [],
    search: "",
    loading: true,
    expanded: [],
    singleExpand: false,
  }),
  computed: {},
  mounted() {
    this.getTable();
    this.bus.$on("closeDialog", () => {
      this.getTable();
    });
  },
  methods: {
    async getTable() {
      try {
        let res = await axios.get("api/evento")
        this.table = res.data;
        this.table.forEach( elem => elem.referencia_apoyo = JSON.parse(elem.referencia_apoyo))
        this.loading = false
      } catch (e) {
        console.log(e);
      }
    },
    editItem(item) {
      this.bus.$emit("openDialog", item);
    },
    async removeItem(item) {
      this.bus.$emit("openDialogRemove", `api/evento/${item.id}`);      
    },
    formatDate(date){
      return this.$moment(date).format("DD/MM/YYYY hh:mm")
    }, 
  }
};
</script>

<template>
<v-container>
  <v-row>
    <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="blue lighten-2"
      ></v-progress-linear>
  </v-row>
  <v-row>
    <v-col cols="3">
          <v-btn class="mx-2" fab dark small color="blue darken-3" v-on:click="substract()">
      <v-icon dark>keyboard_arrow_left</v-icon>
    </v-btn>
    </v-col>
    <v-col cols="6">
          <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="270px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="FormattedDate"
            label="Seleccionar fecha"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu2 = false" dateFormat="dd-MM-yyyy" @change="getAgendaDia()"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="3">
      <v-btn class="mx-2" fab dark small color="blue darken-3" v-on:click="changeDate()">
      <v-icon dark>keyboard_arrow_right</v-icon>
  </v-btn>
    </v-col>
  </v-row>
<v-timeline align-top dense v-if="eventos.length!=0">
  <v-timeline-item v-for="evento in eventos" color="blue darken-2" small v-bind:key="evento.id">
    <v-card max-width="344">
    <v-card-title>
        {{evento.actividad}}
    </v-card-title>
    <v-card-subtitle>
      lugar: {{evento.institucion.nombre}} - {{evento.institucion.direccion}}
      <br>
      hora: {{evento.fecha_hora | moment("H:mm a")}}
    </v-card-subtitle>
    <v-card-actions>
      Delegado: {{evento.delegado.nombre}}
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="evento.show=!evento.show">
        <v-icon>{{ evento.show ? 'mdi-chevron-up': 'mdi-chevron-down'}}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="evento.show">
        <v-divider></v-divider>
        <v-card-text>
          Sector: {{evento.sector.nombre}}
          <br>
          Lugar: {{evento.lugar.nombre}}
          <br>
          Telefono: {{evento.telefono}}
          <br>
          Observaciones: {{evento.observaciones}}
          <br>
          Referencias:
          <br>
          <span v-for="refs in evento.referencia_apoyo" v-bind:key="refs.telefono">
            {{refs.nombre}} - {{refs.unidad}} - {{refs.telefono}}
            <br>
          </span>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  </v-timeline-item>
</v-timeline>
<v-alert type="info" v-if="eventos.length==0">
      No hay eventos para este dia .!
</v-alert>
</v-container>
  
</template>
<script type="text/javascript">
import Vue from "vue";
import axios from 'axios'
import RemoveItem from "../RemoveItem";
import Form from "./Form";
import moment from 'moment';

export default {
  components: {
    RemoveItem,
    Form,
  },
  data: () => ({
    bus: new Vue(),
    search: "",
    loading: true,
    eventos: [],
    date: new moment().format('YYYY-MM-DD'),
      menu: false,
      menu2: false,
  }),
  computed: {
    FormattedDate () {
        return this.date ? moment(this.date).format('DD-MM-YYYY') : '';
      },
  },
  mounted() {
    this.getAgendaDia();
  },
  methods: {
    async getAgendaDia() {
      this.loading = true;
      try {
        let res = await axios.get("api/eventos/getAgendaDia?fecha="+this.date)
        await res.data.forEach(elem =>{
          elem.show=false;
          elem.referencia_apoyo = JSON.parse(elem.referencia_apoyo);
        });
        this.eventos = res.data;
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async changeDate() {
      let newDate = new moment(this.date).add(1, 'days').format('YYYY-MM-DD'); 
      this.date = newDate;
      this.getAgendaDia();
    },
    async substract() {
      let newDate = new moment(this.date).add(-1, 'days').format('YYYY-MM-DD'); 
      this.date = newDate;
      this.getAgendaDia();
    },   
  }
};
</script>

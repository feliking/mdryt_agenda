<template>
<v-container>
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
            v-model="date"
            label="Seleccionar fecha"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu2 = false" @change="getAgendaDia()"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="3">
      <v-btn class="mx-2" fab dark small color="blue darken-3" v-on:click="changeDate()">
      <v-icon dark>keyboard_arrow_right</v-icon>
  </v-btn>
    </v-col>
  </v-row>
<v-timeline align-top dense>
  <v-timeline-item v-for="evento in eventos" color="blue darken-2" small v-bind:key="evento.id">
    <v-card max-width="344">
    <v-card-title>
        {{evento.actividad}}
    </v-card-title>
    <v-card-subtitle>
      lugar: salon gandarillas ministerio de desarrollo
      <br>
      Fecha y hora: 10-10-2019 14:30
    </v-card-subtitle>
    <v-card-actions>
      <v-btn text>ver mas</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="show=!show">
        <v-icon>{{ show ? 'mdi-chevron-up': 'mdi-chevron-down'}}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ratione numquam mollitia id magnam laborum expedita magni, eveniet, laboriosam minima, voluptas repellendus et sit? Deserunt minima laborum ipsum facere accusantium?
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  </v-timeline-item>
</v-timeline>
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
    show: false,
    search: "",
    loading: true,
    eventos: [],
    date: new moment().format('YYYY-MM-DD'),
      menu: false,
      menu2: false,
  }),
  computed: {},
  mounted() {
    this.getAgendaDia();
  },
  methods: {
    async getAgendaDia() {
      try {
        let res = await axios.get("api/eventos/getAgendaDia?fecha="+this.date)
        this.eventos = res.data;
        this.loading = false
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
    }
  }
};
</script>

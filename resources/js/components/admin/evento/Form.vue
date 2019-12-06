<template v-slot:top>
  <v-dialog v-model="dialog" max-width="900px" @keydown.enter="save()">
    <template v-slot:activator="{ on }">
      <v-icon large v-on="on">add_circle</v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-text-field 
                  v-model="selectedItem.actividad" 
                  label="Actividad"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido"
                  persistent-hint>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete                      
                  v-model="selectedItem.institucion_id"
                  :items="instituciones"
                  item-text="nombre"
                  item-value="id"
                  label="Institución"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido"
                  persistent-hint
                  >
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="lugar"
                  :items="lugares"
                  label="Lugar"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido" 
                  persistent-hint
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-combobox
                  v-model="sector"
                  :items="sectores"
                  label="Sector"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido" 
                  persistent-hint
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field 
                  v-model="selectedItem.nombre" 
                  label="Nombre"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido"
                  persistent-hint>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field 
                  v-model="selectedItem.telefono" 
                  label="Teléfono"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido"
                  persistent-hint>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field 
                  v-model="selectedItem.referencia_apoyo" 
                  label="Referencia Apoyo"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido"
                  persistent-hint>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field 
                  v-model="selectedItem.avanzada" 
                  label="Avanzada"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido"
                  persistent-hint>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-combobox
                  v-model="delegado"
                  :items="delegados"
                  label="Delegado"
                  :rules="[v => !!v || 'Requerido']"
                  hint="Requerido" 
                  persistent-hint
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-datetime-picker 
                  label="Fecha y hora del evento" 
                  v-model="datetime"
                  dateFormat="dd-MM-yyyy"
                ></v-datetime-picker>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-textarea
                  v-model="selectedItem.observaciones" 
                  label="Observaciones"
                  persistent-hint>
                </v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" :disabled="!valid" text @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  props: ["item", "bus"],  
  data() {
    return {      
      valid: true,
      dialog: false,
      selectedIndex: -1,     
      selectedItem: {},
      error: '',
      instituciones: [],
      lugar: "",
      lugares: [],
      delegado: "",
      delegados: [],
      sectores: [],
      sector: "",
      datetime: "",

    };
  },
  created() {},  
  mounted() {
    this.bus.$on("openDialog", item => {
      this.selectedItem = item;
      this.dialog = true;
      this.selectedIndex = item;
    });
    this.getInstituciones();
    this.getLugares();
    this.getSectores();
    this.getDelegados();
  },
  computed: {
    formTitle() {
      return this.selectedIndex === -1 ? 'Nuevo ' : 'Editar '
    }    
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.reset()
      this.bus.$emit("closeDialog");
      this.selectedIndex = -1;
      this.selectedItem = {}
    },
    async save() {
      try {
        if (this.$refs.form.validate()) {
          if (this.selectedIndex != -1) {
            await axios.put("api/evento/"+this.selectedItem.id, this.selectedItem)
          } else {
            try{
              let lugar = await axios.get('api/lugar/fill/'+JSON.stringify({'nombre': this.lugar}))
              if(lugar.data.length == 0){
                let aux = await axios.post('api/lugar', {'nombre': this.lugar})
                this.selectedItem.lugar_id = aux.data.id
              }
              else{
                this.selectedItem.lugar_id = lugar.data[0].id
              }

              let sector = await axios.get('api/sector/fill/'+JSON.stringify({'nombre': this.sector}))
              if(sector.data.length == 0){
                let aux = await axios.post('api/sector', {'nombre': this.sector})
                this.selectedItem.sector_id = aux.data.id
              }
              else{
                this.selectedItem.sector_id = sector.data[0].id
              }

              let delegado = await axios.get('api/delegado/fill/'+JSON.stringify({'nombre': this.delegado}))
              if(delegado.data.length == 0){
                let aux = await axios.post('api/delegado', {'nombre': this.delegado})
                this.selectedItem.delegado_id = aux.data.id
              }
              else{
                this.selectedItem.delegado_id = delegado.data[0].id
              }
              this.selectedItem.fecha_hora = this.datetime
              await axios.post("api/evento", this.selectedItem)
            }
            catch(e){
              console.log(e)
            }
          }
          this.$toast.success('Correcto.')
          this.close();
        }
      } catch(e) {
        console.log(e)
      }
    },
    async getInstituciones(){
      try{
        let res = await axios.get('api/institucion')
        this.instituciones = res.data
      }
      catch(e){
        console.log(e)
      }
    },
    async getLugares(){
      try{
        let res = await axios.get('api/lugar')
        for(let temp of res.data){
          this.lugares.push(temp.nombre)
        }
      }
      catch(e){
        console.log(e)
      }
    },
    async getSectores(){
      try{
        let res = await axios.get('api/sector')
        for(let temp of res.data){
          this.sectores.push(temp.nombre)
        }
      }
      catch(e){
        console.log(e)
      }
    },
    async getDelegados(){
      try{
        let res = await axios.get('api/delegado')
        for(let temp of res.data){
          this.delegados.push(temp.nombre)
        }
      }
      catch(e){
        console.log(e)
      }
    }
  },  
};
</script>
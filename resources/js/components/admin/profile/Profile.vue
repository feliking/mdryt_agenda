<template>
  <div>
    <h2 class="mb-4 primary--text headline">Tu perfil</h2>

    <v-card>
      <v-card-text>
        <v-text-field
          label="Nombre"
          v-model="user.name"
          filled
          readonly
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-text-field
          label="Email"
          v-model="user.email"
          filled
          readonly
          hide-details
        ></v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    user: {
      name: null,
      email: null,
    }
  }),

  computed: mapGetters({
    auth: 'auth/user'
  }),

  mounted() {
    this.user = Object.assign(this.user, this.auth)
  }
}
</script>

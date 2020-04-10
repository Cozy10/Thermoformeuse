<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit="setPassword" onSubmit="return false;">
      <v-layout text-center wrap>
        <v-flex offset-md-3 xs6>
          <v-text-field
            autocomplete="current-password"
            :value="pwd"
            label="Saisissez le nouveau mot de passe"
            hint="Mot de passe valide"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (show = !show)"
            :type="show ? 'password' : 'text'"
            :rules="[rules.password]"
            @input="_=>pwd=_"
            required
          ></v-text-field>
          <v-btn color="green" dark type="submit">Valider</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      pwd: "",
      valid: true,
      show: true,
      rules: {
        required: show => !!show || "requis",
        password: value => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
          return (
            pattern.test(value) ||
            "Minimum 8 caractères avec au moins une majuscule, minuscule et un nombre"
          );
        }
      }
    }),
    methods: {
      setPassword() {
        if(this.valid){
          console.log(this.pwd);
        }
      }
    }
  };
</script>

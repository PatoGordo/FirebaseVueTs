<template>
  <div v-if="signed">
    <app-signed-component v-on:signout="SignOut()"></app-signed-component>
  </div>
  <div v-else>
    <app-sign-in-component
      v-if="signinorsignup"
      v-on:changeScrren="signinorsignup = !signinorsignup"
    ></app-sign-in-component>
    <app-sign-up-component
      v-if="!signinorsignup"
      v-on:changeScrren="signinorsignup = !signinorsignup"
    ></app-sign-up-component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { db, auth } from "./firebase";
import AppSignInComponent from "./components/SignInComponent.vue";
import AppSignUpComponent from "./components/SignUpComponent.vue";
import AppSignedComponent from "./components/AppSignedComponent.vue";

const myCollection = db.collection("MyCollection");

interface DataTypes {
  signinorsignup: boolean;
  signed: boolean;
}

export default defineComponent({
  name: "App",
  components: {
    AppSignInComponent,
    AppSignUpComponent,
    AppSignedComponent,
  },
  data(): DataTypes {
    return {
      signinorsignup: true,
      signed: false,
    };
  },
  methods: {
    SignOut() {
      auth.signOut().then(() => {
        this.signed = false;
      });
    },
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.signed = true;
      }
      return;
    });
  },
});
</script>

<style lang="scss">
@import "./scss/app.scss";
</style>

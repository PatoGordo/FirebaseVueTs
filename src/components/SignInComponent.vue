<template>
  <form class="form login" @submit.prevent="signinWithEmail">
    <h2 class="form-title">Sign in</h2>

    <i id="google-auth" @click="SignInWithGoogle"
      ><ion-icon name="logo-google"></ion-icon
    ></i>

    <div class="form-fields">
      <label for="email-signup" class="only-screen-reader">Your email</label>
      <input
        v-model="email"
        id="email-signup"
        type="email"
        placeholder="Your email"
        required
      />

      <label for="password-signup" class="only-screen-reader"
        >Your password</label
      >
      <input
        v-model="password"
        autocomplete="off"
        id="password-signup"
        type="password"
        placeholder="Your password"
        required
      />
    </div>
    <p class="form-changer">
      Not have an account?<a href="#" @click="$emit('changeScrren')">sign up</a>
    </p>

    <button type="submit" class="submit-button">Sign in</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, signInWithGoogle } from "../firebase";

interface DataTypes {
  email: string;
  password: string;
}

export default defineComponent({
  name: "AppSignInComponent",
  data(): DataTypes {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    signinWithEmail() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {})
        .catch((err) => {
          alert(err);
        });
    },
    SignInWithGoogle() {
      signInWithGoogle();
    },
  },
});
</script>
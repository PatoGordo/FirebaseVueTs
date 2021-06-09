<template>
  <form class="form login" @submit.prevent="signupWithEmail">
    <h2 class="form-title">Sign up</h2>

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

      <label for="user-signup" class="only-screen-reader">Your username</label>
      <input
        v-model="userName"
        id="user-signup"
        type="text"
        placeholder="Your username"
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

      <label for="password-confirm-signup" class="only-screen-reader"
        >Repeat your password</label
      >
      <input
        v-model="confirmPassword"
        autocomplete="off"
        id="password-confirm-signup"
        type="password"
        placeholder="Confirm your password"
        required
      />
      <strong v-if="password !== confirmPassword" class="passwords-not-same"
        >The passwords isn't the same</strong
      >
    </div>
    <p class="form-changer">
      Already have an account?<a href="#" @click="$emit('changeScrren')"
        >sign in</a
      >
    </p>

    <button type="submit" class="submit-button">Sign up</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, signInWithGoogle } from "../firebase";

interface DataTypes {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
}

export default defineComponent({
  name: "AppSignUpComponent",
  data(): DataTypes {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      userName: '',
    };
  },
  methods: {
    signupWithEmail() {
      if (this.password !== this.confirmPassword) {
        return alert("The passwords is not the same");
      }

      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          const user = auth.currentUser
          user?.updateProfile({
            displayName: this.userName,
            photoURL: 'https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg'
          })
        })
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
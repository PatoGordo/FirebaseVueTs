<template>
  <div v-if="signed">
    <button @click="logOut">Log out</button>
    <img :src="user.photoURL" />
    <h2>Hello {{ user.displayName }}</h2>

    <ul>
      <li v-for="(value, key) in messages" :key="key">
        <p>{{ value.author }}: {{ value.message }}</p>
      </li>
    </ul>

    <div class="input-box">
      <input
        type="text"
        v-model="input"
        v-on:keyup.enter="setDataToCollection"
        placeholder="Your data..."
        required
      />
      <button type="button" @click="setDataToCollection">Send</button>
    </div>
  </div>
  <div v-else-if="!signed">
    <form class="form login" @submit.prevent="loginWithEmail" v-if="signinorsignup">
      <h2 class="form-title">Sign in</h2>

      <i id="google-auth" @click="signInWithGoogle"><ion-icon name="logo-google"></ion-icon></i>


      <div class="form-fields">
        <label for="email" class="only-screen-reader">Your email</label>
        <input v-model="loginForm.email" id="email" type="email" placeholder="Your email" required />

        <label for="password" class="only-screen-reader">Your password</label>
        <input v-model="loginForm.password" autocomplete="off" id="password" type="password" placeholder="Your password" required />
      </div>
      <p class="form-changer">Not have an account?<a  href="#" @click="signinorsignup = !signinorsignup">sign up</a></p>

      <button type="submit" class="submit-button">Sign in</button>
    </form>

    <form class="form sign-up" @submit.prevent="signupWithEmail" v-else>
      <h2 class="form-title">Sign up</h2>

      <i id="google-auth" @click="signInWithGoogle"><ion-icon name="logo-google"></ion-icon></i>

      <div class="form-fields">
        <label for="email-signup" class="only-screen-reader">Your email</label>
        <input v-model="signUpForm.email" id="email-signup" type="email" placeholder="Your email" required />

        <label for="password-signup" class="only-screen-reader">Your password</label>
        <input v-model="signUpForm.password" autocomplete="off" id="password-signup" type="password" placeholder="Your password" required />

        <label for="password-confirm-signup" class="only-screen-reader">Repeat your password</label>
        <input v-model="signUpForm.confirmPassword" autocomplete="off" id="password-confirm-signup" type="password" placeholder="Confirm your password" required />
        <strong v-if="signUpForm.password !== signUpForm.confirmPassword" class="passwords-not-same">The passwords is not the same</strong>
      </div>
      <p class="form-changer">Already have an account?<a  href="#" @click="signinorsignup = !signinorsignup">sign in</a></p>

      <button type="submit" class="submit-button">Sign up</button>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { db, auth, googleProvider } from "./firebase";
  const myCollection = db.collection("MyCollection");

  interface DataTypes {
    input: string;
    messages: Array<any>;
    signed: boolean;
    signinorsignup: boolean;
    user: any;
    loginForm: {
      email: string;
      password: string;
    };
    signUpForm: {
      email: string;
      password: string;
      confirmPassword: string;
    }
  }

  export default defineComponent({
    name: "App",
    data(): DataTypes {
      return {
        input: "",
        messages: [],
        signed: false,
        signinorsignup: true,
        user: {
          displayName: 'Unknow user',
          photoURL: 'https://static.vecteezy.com/system/resources/previews/000/550/731/non_2x/user-icon-vector.jpg',
        },
        loginForm: {
          email: "",
          password: "",
        },
        signUpForm: {
          email: '',
          password: '',
          confirmPassword: '',
        }
      };
    },
    methods: {
      setDataToCollection() {
        // check if input is null/undefined/empty and stop function execution
        if (this.input === "") {
          return;
        }

        // addding message to colletion
        myCollection.doc().set({
          author: this.user.displayName,
          message: this.input,
          sendedAt: new Date(), // later will be used to order the messages by time
        });
      },
      isSigned() {
        auth.onAuthStateChanged((user) => {
          if (user) {
            this.signed = true;
            this.user = auth.currentUser
            return;
          }
          this.signed = false;
          return;
        });
      },
      loginWithEmail() {
        auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
        .then(() => {
          this.user = auth.currentUser
          this.signed = true
        })
        .catch((err) => {
          alert(err)
        })
      },
      signupWithEmail() {
        if(this.signUpForm.password !== this.signUpForm.confirmPassword) {
          return alert('The passwords is not the same')
        }

        auth.createUserWithEmailAndPassword(this.signUpForm.email, this.signUpForm.password)
        .then(() => {
          this.user = auth.currentUser
          this.signed = true
        })
        .catch((err) => {
          alert(err)
        })
      },
      signInWithGoogle() {
        auth
          .signInWithPopup(googleProvider)
          .then(() => {
            this.user = auth.currentUser
            this.signed = true
          }).catch((err) => {
            alert(err)
          });
      },
      logOut() {
        auth.signOut()
        this.signed = false
      }
    },
    created() {
      this.isSigned()

      myCollection
        .orderBy("sendedAt", "asc") // This line code will order the messages by sent time
        .onSnapshot((snapshot) => {
          snapshot.docChanges().map((change) => {
            // Get only the change message and put on the messges array
            this.messages.push(change.doc.data());
          });
        });
    }
  });
</script>

<style lang="scss">
  @import './scss/app.scss';
</style>
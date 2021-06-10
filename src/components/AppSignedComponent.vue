<template>
  <div class="chat-view">
    <div class="profile-bar">
      <img :src="user.photoURL" />
      <h2>General chat</h2>
      <button @click="$emit('signout')">Log out</button>
    </div>

    <ul class="messages-list" ref="messageScroll">
      <li v-for="(value, key) in messages" :key="key" :class="value.uid === user.uid? 'is-the-author': 'is-not-the-author'">
        <img v-if="value.uid !== user.uid" :src="value.photo" alt="user-photo">
        <p><strong>{{ value.uid !== user.uid? `${value.author}: ` : ''}}</strong>{{ value.message }}</p>
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
      <button type="button" @click="setDataToCollection"><ion-icon name="send"></ion-icon></button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db } from "../firebase";

const collection = db.collection("MyCollection");

interface DataTypes {
  input: string;
  messages: Array<any>;
  user: any;
}

export default defineComponent({
  name: "AppSignedComponent",
  data(): DataTypes {
    return {
      input: "",
      messages: [],
      user: {
        displayName: "Unknow",
        photoURL:
          "https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg",
      },
    };
  },
  methods: {
    setDataToCollection() {
      if (this.input === "") {
        return;
      }

      collection
        .doc()
        .set({
          author: auth.currentUser?.displayName,
          photo: auth.currentUser?.photoURL,
          message: this.input,
          uid: auth.currentUser?.uid,
          createdAt: new Date(),
        })
        .then(() => {
          this.input = "";
        })
        .catch((err) => {
          alert(err);
        });
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = auth.currentUser;
        return;
      }
      return;
    });

    collection
      .orderBy("createdAt", "asc") // This line code will order the messages by sent time
      .onSnapshot((snapshot) => {
        snapshot.docChanges().map((change) => {
          // Get only the change message and put on the messges array
          this.messages.push(change.doc.data());
          setTimeout(() => {
            const el: any = this.$refs.messageScroll
            el.scrollTop = el.scrollHeight
          }, 200)
        });
      });
  }
});
</script>

<style lang="scss" scoped>
@import '../scss/components/chat'
</style>
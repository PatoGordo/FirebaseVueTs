import Firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/auth'

Firebase.initializeApp({
  apiKey: "AIzaSyAxYQcgjHB5Fdjo9pvS5Uxrh5ALfUOk8q8",
  authDomain: "tests-a079f.firebaseapp.com",
  projectId: "tests-a079f",
  storageBucket: "tests-a079f.appspot.com",
  messagingSenderId: "551903792401",
  appId: "1:551903792401:web:0ae5f448c0c1b2cc9150b0",
  measurementId: "G-JP2RY93LV6"
})
export const analytics = Firebase.analytics()
export const db = Firebase.firestore()
export const auth = Firebase.auth()
export const { currentUser } = auth
export const googleProvider = new Firebase.auth.GoogleAuthProvider()
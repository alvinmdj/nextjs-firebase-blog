import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAz6-fD2KBfJT4BttYtMXcO0Z4HdNQTqj4",
  authDomain: "next-firebase-blog-a173b.firebaseapp.com",
  projectId: "next-firebase-blog-a173b",
  storageBucket: "next-firebase-blog-a173b.appspot.com",
  messagingSenderId: "262875897174",
  appId: "1:262875897174:web:2677ca10aa54c8c54acaf7",
}

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
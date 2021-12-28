import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

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
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp // provide reliable timestamp

export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED // A special Firebase event that we can listen to, which tells us the progress of the file upload

// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
 export function postToJSON(doc) {
  const data = doc.data()

  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}
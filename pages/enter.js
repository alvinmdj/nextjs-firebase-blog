import { auth, googleAuthProvider } from '../lib/firebase'
import { useContext } from "react"
import { UserContext } from "../lib/context"

export default function EnterPage (props) {
  const { user, username } = useContext(UserContext)

  // 1. <SignInButton />  => if user is signed out
  // 2. <UsernameForm />  => if user is signed in, but missing username
  // 3. <SignOutButton /> => if user is signed in and has username
  return (
    <main>
      {user ? username? <SignOutButton /> : <UsernameForm /> : <SignInButton />}
    </main>
  )
}

// Google Sign in
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  )
}

// Sign out
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {

}
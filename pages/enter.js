import { auth, googleAuthProvider } from '../lib/firebase'

export default function EnterPage (props) {
  const user = null
  const username = null

  // 1. <SignInButton />  => if user is signed out
  // 2. <UsernameForm />  => if user is signed in, but missing username
  // 3. <SignOutButton /> => if user is signed in and has username
  return (
    <main>
      {user ?
        !username? <UsernameForm /> : <SignOutButton />
        :
        <SignInButton />
      }
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
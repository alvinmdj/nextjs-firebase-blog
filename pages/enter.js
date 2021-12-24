import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { useState, useEffect, useCallback, useContext } from "react"
import { UserContext } from "../lib/context"
import debounce from 'lodash.debounce'

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
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  const onSubmit = async (e) => {
    e.preventDefault()

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // Commit both docs together as a batch write
    const batch = firestore.batch()
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName
    })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if(val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if(re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if(username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get() // 'exists' destructured from the docSnapshot
        console.log('Get data success')
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name='username' placeholder='Enter a username' value={formValue} onChange={onChange} />

          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

          <button type='submit' className='btn-green' disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading}) {
  if(loading) {
    return <p>Checking...</p>
  } else if(isValid) {
    return <p className='text-success'><i>{username}</i> is available!</p>
  } else if(username && !isValid) {
    return <p className='text-danger'>That username is taken!</p>
  } else {
    return <p></p>
  }
}
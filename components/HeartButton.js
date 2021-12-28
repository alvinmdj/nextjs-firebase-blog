import { firestore, auth, increment } from "../lib/firebase"
import { useDocument } from "react-firebase-hooks/firestore"

// Allows user to like a post
export default function HeartButton({ postRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid)
  const [heartDoc] = useDocument(heartRef)

  // Creates a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid
    const batch = firestore.batch() // batch 2 docs to update or fail at the same time

    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })
    
    await batch.commit()
  }
  
  // Removes a user-to-post relatioship
  const removeHeart = async () => {
    const batch = firestore.batch()
    
    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)

    await batch.commit()
  }

  return heartDoc?.exists ? (
    <button onClick={ removeHeart }>💔 Unlike</button>
  ) : (
    <button onClick={ addHeart }>💓 Like</button>
  )
}

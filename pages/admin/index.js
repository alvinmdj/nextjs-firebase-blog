import styles from "../../styles/Admin.module.css"
import AuthCheck from "../../components/AuthCheck"
import PostFeed from "../../components/PostFeed"
import { firestore, auth, serverTimestamp } from "../../lib/firebase"
import { UserContext } from "../../lib/context"

import { useContext, useState } from "react"
import { useRouter } from "next/router"

import { useCollection } from "react-firebase-hooks/firestore"
import kebabCase from "lodash.kebabcase"
import toast from "react-hot-toast"

export default function AdminPostsPage ({  }) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage Posts</h1>
      <PostFeed posts={ posts } admin />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate title length
  const isValid = title.trim().length > 3 && title.trim().length < 100

  // Create a new post in firestore when submitted
  const createPost = async (e) => {
    e.preventDefault()

    // Tip: give all fields a default value here to prevent error in the future
    if(isValid) {
      const uid = auth.currentUser.uid
      const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

      const data = {
        title,
        slug,
        uid,
        username,
        published: false,
        content: '# Put your content here.',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        heartCount: 0
      }

      await ref.set(data)

      toast.success('Post created successfully!')

      // Imperative navigation after doc is set
      router.push(`/admin/${slug}`)
    } else {
      toast.error('Please provide a valid title!')
    }
  }

  return (
    <form onSubmit={ createPost }>
      <input
        value={ title }
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter the Post Title"
        className={ styles.input } />
      <p>
        <strong>Slug:</strong> { slug }
      </p>
      <button type="submit" disabled={ !isValid } className="btn-green">
        Create Post
      </button>
    </form>
  )
}
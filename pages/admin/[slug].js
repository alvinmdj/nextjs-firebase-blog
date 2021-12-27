import styles from '../../styles/Admin.module.css'
import AuthCheck from "../../components/AuthCheck"
import Metatags from "../../components/Metatags"
import { useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form";
import { firestore, auth, serverTimestamp } from "../../lib/firebase"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import ReactMarkdown from 'react-markdown'
import toast from "react-hot-toast"
import Link from 'next/link'

export default function AdminPostEdit () {
  return (
    <>
      <Metatags 
        title="Admin - Edit Post"
        description="Page for admin to edit their post." />
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
  const [post] = useDocumentDataOnce(postRef)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{ post.title }</h1>
            <p>ID: { post.slug }</p>
            <PostForm postRef={ postRef } defaultValues={ post } preview={ preview } />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit': 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='btn-blue'>Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm ({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' })

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp()
    })

    reset({ content, published })

    toast.success('Post updated successfully!')
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <textarea 
          {...register('content')}  // react-hook-form v7
          // name="content"
          // ref={register}
        ></textarea>

        <fieldset>
          <input 
            className={styles.checkbox} 
            type="checkbox" 
            // name="published" 
            // ref={register}
            {...register('published')} /* react-hook-form v7 */ />
          <label>Published</label>
        </fieldset>

        <button type="submit" className='btn-green'>
          Save Changes
        </button>
      </div>
    </form>
  )
}
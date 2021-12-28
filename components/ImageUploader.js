import { useState } from "react"
import { auth, storage, STATE_CHANGED } from "../lib/firebase"
import Loader from "./Loader"

// Uploads image to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState(null)

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0]
    const extension = file.type.split('/')[1]

    // Makes reference to the storage location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
    setUploading(true)

    // Starts the upload
    const task = ref.put(file)

    // Listen to updates to upload task
    task.on(STATE_CHANGED, snapshot => {
      const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
      setProgress(percentage)

      // Get download URL AFTER task resolves (Note: this is not a native promise)
      task
        .then(d => ref.getDownloadURL())
        .then(url => {
          setDownloadURL(url)
          setUploading(false)
        })
    })
  }

  return (
    <div className="box">
      <Loader show={ uploading } />
      
      {uploading && <h3>{ progress }%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            Upload Image
            <input 
              type="file" 
              onChange={ uploadFile }
              accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  )
}

import Link from "next/link";

export default function NotFound () {
  return (
    <main>
      <h1>404 - That page does not seem to exist...</h1>
      <iframe 
        src="https://giphy.com/embed/C21GGDOpKT6Z4VuXyn" 
        width="362" 
        height="362"
        frameBorder="0" 
        allowFullScreen
      ></iframe>
      <Link href='/'>
        <button className="btn-blue">Go to homepage</button>
      </Link>
    </main>
  )
}

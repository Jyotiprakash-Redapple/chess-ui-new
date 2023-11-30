"use client"
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <div className='w-screen max-w-5xl min-h-screen align-middle' style={{ backgroundColor: 'white' }}>
        <Image  height={1920} width={1200} src={'/bg.png'} alt='splash screen' />
      </div>
    </main>
  )
}

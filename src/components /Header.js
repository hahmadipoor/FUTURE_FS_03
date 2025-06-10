// components/Header.js

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Learnify
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/courses" className="text-gray-700 hover:text-blue-500">Courses</Link>
        </nav>
      </div>
    </header>
  )
}

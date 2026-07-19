// Footer.jsx - Minimal footer shown at the bottom of every authenticated page.

import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <img src="/car-icon.svg" alt="" className="w-5 h-5" />
          <span>&copy; {new Date().getFullYear()} AutoDrive Dealership. All rights reserved.</span>
        </div>
        <p className="text-xs text-gray-400">Built with FastAPI &amp; React</p>
      </div>
    </footer>
  )
}

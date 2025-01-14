import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex'>
        <Sidebar />
        <main className='w-full h-[94vh] bg-gray-100 border-4 border-white shadow-xl rounded-2xl my-4 mx-2'>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout
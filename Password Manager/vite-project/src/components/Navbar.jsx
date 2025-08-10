import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white'>
            <div className='mycontainer flex justify-between items-center px-4 h-14 py-5'>
                <div className='logo font-bold text-2xl'>
                    <span className='text-green-700'> &lt;;</span>

                    Passop
                    <span className='text-green-700'>OP/&gt;</span>

                </div>
                {/* <ul>
                    <li className='flex gap-4'>
                        <a className='hover:font-bold' href="/">Home</a>
                        <a className='hover:font-bold' href="#">About</a>
                        <a className='hover:font-bold' href="#">Contact</a>
                      </li>
                </ul> */}
                <button className='text-white bg-green-500 my-5 rounded-full flex justify-between items-center roundef ring-white ring-1'>
                    <img className='invert w-10 p-1' src="icons/github-logo.png" alt="" />
                    <span className='font-bold px-2'>GitHub</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar

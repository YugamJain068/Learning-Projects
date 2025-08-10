"use client"
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'

const generate = () => {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [links, setlinks] = useState([{ link: "", linktext: "" }])
    const [handle, sethandle] = useState(searchParams.get('handle') || "")
    const [pic, setpic] = useState("")
    const [desc, setdesc] = useState("")

    const handleChange = (index, link, linktext) => {
        setlinks((initiallinks) => {
            return initiallinks.map((item, i) => {
                if (i == index) {
                    return { link, linktext }
                }
                else {
                    return item
                }
            })
        })
    }

    const addLink = () => {
        setlinks(links.concat([{ link: "", linktext: "" }]))
    }

    const submitLinks = async () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "links": links,
            "handle": handle,
            "pic": pic,
            "desc": desc
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const r = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add`, requestOptions)
        const res = await r.json()
        if(res.success){
            toast.success(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setlinks([])
            setpic("")
            sethandle("")
            setdesc("")
            
            setTimeout(() => {
                router.push(`/${handle}`)
            }, 3000);
        }
        else{
            toast.error(res.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        
        
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='bg-[#E9C0E9] min-h-screen grid grid-cols-2 pt-14'>
                <div className="col1 flex justify-center items-center flex-col text-gray-900">

                    <div className='flex flex-col gap-5 my-8 ml-[10vw]'>
                        <h1 className='font-bold text-4xl'>Create your Bittree</h1>
                        <div className="item">
                            <h2 className='font-semibold text-4xl'>Step 1: Claim your handle</h2>

                            <div className='mx-4'>
                                <input value={handle} onChange={e => { sethandle(e.target.value) }} className='bg-white px-4 py-2 focus:outline-pink-500 rounded-full my-2' type="text" placeholder='Choose a Handle' />
                            </div>
                        </div>
                        <div className="item">
                            <h2 className='font-semibold text-4xl'>Step 2: Add Links</h2>

                            {links && links.map((item, index) => {
                                return <div key={index} className='mx-4'>
                                    <input value={item.linktext || ""} onChange={e => { handleChange(index, item.link, e.target.value) }} className='bg-white px-4 py-2 focus:outline-pink-500 rounded-full mx-2 my-2' type="text" placeholder='Enter link text' />

                                    <input value={item.link || ""} onChange={e => { handleChange(index, e.target.value, item.linktext) }} className='bg-white px-4 py-2 focus:outline-pink-500 rounded-full mx-2 my-2' type="text" placeholder='Enter link' />

                                </div>
                            })}
                            <button className='px-5 py-2 mx-2 bg-slate-900 text-white font-bold rounded-3xl' onClick={() => addLink()}>+ Add Link</button>
                        </div>
                        <div className="item">
                            <h2 className='font-semibold text-4xl'>Step 3: Add Picture and Description</h2>
                            <div className='mx-4 flex flex-col'>
                                <input value={pic} onChange={e => { setpic(e.target.value) }} className='bg-white px-4 py-2 focus:outline-pink-500 rounded-full mx-2 my-2' type="text" placeholder='Enter link to your picture' />
                                <input value={desc} onChange={e => { setdesc(e.target.value) }} className='bg-white px-4 py-2 focus:outline-pink-500 rounded-full mx-2 my-2' type="text" placeholder='Enter Description' />
                                <button disabled={pic =="" || handle=="" || links[0].linktext == "" || links[0].link == "" || desc ==""} onClick={() => { submitLinks() }} className='disabled:bg-slate-500 disabled:cursor-not-allowed px-5 w-fit my-5 py-2 mx-2 bg-slate-900 text-white font-bold rounded-3xl'>Create your BitTree</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col2 w-full h-screen bg-[#E9C0E9]">
                    <img className='h-full object-contain ml-[6vw]' src="/generate.png" alt="generate your links" />
                </div>
            </div>
        </>
    )
}

export default generate

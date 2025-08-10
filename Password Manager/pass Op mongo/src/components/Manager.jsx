import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const passref = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setpasswordArray] = useState([]);

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setpasswordArray(passwords);
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const showPassword = () => {

        if (ref.current.src.includes("/icons/hidden_2355322.png")) {
            passref.current.type = "text"
            ref.current.src = "/icons/eye.png";
        }
        else {
            ref.current.src = "/icons/hidden_2355322.png";
            passref.current.type = "password"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            if (form.id) {
                await fetch(`http://localhost:3000/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: form.id })
                });
            }

            setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));
            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            // console.log([...passwordArray, form])
            setForm({ site: "", username: "", password: "" });
            toast.success('Password Saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            toast.error('Please fill all the fields', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const deletePassword = async (id) => {
        console.log("delete password with id : ", id)
        let c = confirm("Are you sure you want to delete this password?")
        if (c) {
            let res = await fetch(`http://localhost:3000/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })
            toast.success('Password Deleted', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setpasswordArray(passwordArray.filter((item) => item.id !== id));
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter((item) => item.id !== id)));
        }
    }
    const editPassword = (id) => {
        console.log("edit password with id : ", id)
        setForm({ ...passwordArray.filter((item) => item.id === id)[0], id: id });
        setpasswordArray(passwordArray.filter((item) => item.id !== id));
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const copyText = (text) => {
        toast('Copied Succesfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigator.clipboard.writeText(text)
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            <div>
                <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

                <div className="p-3 md:mycontainer min-h-[86.4vh]">
                    <h1 className='text-4xl text-center font-bold'><span className='text-green-700'> &lt;;</span>

                        Passop
                        <span className='text-green-500'>OP/&gt;</span></h1>
                    <p className='text-green-900 text-lg text-center'>Your own password manager</p>


                    <div className="flex flex-col p-4 text-black gap-8 items-center">

                        <input className='rounded-full border border-green-500 w-full p-4 py-1' type="text"
                            placeholder='Enter website name' name="site" id="site" value={form.site} onChange={handleChange} />

                        <div className="flex flex-col md:flex-row w-full justify-between gap-8">

                            <input className='rounded-full border border-green-500 w-full p-4 py-1'
                                placeholder='Enter Username' type="text" name="username" id="username" value={form.username} onChange={handleChange} />

                            <div className='relative w-full'>
                            <input ref={passref} className='relative rounded-full border border-green-500 w-full p-4 py-1'
                                placeholder='Enter Password' type="password" name="password" id="password" value={form.password} onChange={handleChange} />

                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="/icons/hidden_2355322.png" alt="eye" />
                            </span>
                            </div>

                        </div>

                        <button onClick={savePassword} className='flex justify-center items-center bg-green-400 rounded-full px-6 py-2 w-fit hover:bg-green-300 gap-2 border border-green-900 '>
                            <lord-icon
                                src="https://cdn.lordicon.com/jgnvfzqg.json"
                                trigger="hover">
                            </lord-icon>
                            Save Password</button>
                    </div>
                    <div className="passwords">
                        <h2 className='font-bold text-2xl py-4'>your passwords</h2>
                        {passwordArray.length === 0 && <div>No passwords to show</div>}
                        {passwordArray.length != 0 &&
                            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                                <thead className="bg-green-800 text-white">
                                    <tr>
                                        <th className='py-2'>Site</th>
                                        <th className='py-2'>User Name</th>
                                        <th className='py-2'>Password</th>
                                        <th className='py-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-green-100'>
                                    {passwordArray.map((item, index) => {
                                        return (
                                            <tr>
                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex items-center justify-center' onClick={() => copyText(item.site)}>
                                                        <a href={item.site} target='_blank'>{item.site}</a>
                                                        <div className='py-3 pl-3'>
                                                            <img className='cursor-pointer w-5 ' src="/icons/copy.png" alt="" />
                                                        </div>
                                                    </div>

                                                </td>

                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex items-center justify-center' onClick={() => copyText(item.username)}>
                                                        <span>{item.username}</span>
                                                        <div className='py-3 pl-3'>
                                                            <img className='cursor-pointer w-5 ' src="/icons/copy.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex items-center justify-center' onClick={() => copyText(item.password)}>
                                                        <span>{"*".repeat(item.password.length)}</span>
                                                        <div className='py-3 pl-3'>
                                                            <img className='cursor-pointer w-5 ' src="/icons/copy.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex gap-2 justify-center items-center'>
                                                        <span className='cursor-pointer' onClick={() => { deletePassword(item.id) }}>
                                                            <script src="https://cdn.lordicon.com/lordicon.js"></script>
                                                            <lord-icon
                                                                src="https://cdn.lordicon.com/skkahier.json"
                                                                trigger="hover"
                                                                style={{ "width": "25px", "height": "25px" }}>
                                                            </lord-icon>
                                                        </span>
                                                        <span className='cursor-pointer' onClick={() => { editPassword(item.id) }}>

                                                            <img height={20} width={20} src="/icons/pencil.png" alt="edit" />

                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Manager

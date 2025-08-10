import Link from "next/link";
import React from 'react'
import clientPromise from "@/lib/mongodb";

export default async function Page({ params }) {
    const handle = (await params).handle
    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")
    const item = await collection.findOne({ handle: handle })
    if (!item) {
        return <div className="flex min-h-screen bg-purple-400 justify-center items-start py-10">
            <span className="font-bold text-xl">This Bitree does not exist</span>
        </div>
    }
    return <div className="flex min-h-screen bg-purple-400 justify-center items-start py-10">
        {item && <div className="photo flex justify-center flex-col items-center gap-4">
            <img className="size-32 rounded-full" src={item.pic} alt="" />
            <span className="font-bold text-xl">@{item.handle}</span>
            <span className="desc w-80 text-center">{item.desc}</span>
            <div className="links">
                {item.links.map((item, index) => {
                    return <Link key={index} target="_blank" href={item.link}><div className="py-4 px-2 bg-purple-100 rounded-md my-3 shadow-lg min-w-96 flex justify-center">
                        {item.linktext}

                    </div></Link>
                })}
            </div>
        </div>}

    </div>
}

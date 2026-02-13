'use client'

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')


    useEffect(() => {
        getUser()
    }, [])



    useEffect(() => {
        if (!user) return

        fetchBookmarks()

        const channel = supabase.channel('bookmarks-channel').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
        }, () => {
            fetchBookmarks()
        }).subscribe()


        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])




    const getUser = async () => {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
            setUser(data.user)
        } else {
            window.location.href = '/'
        }
    }



    const fetchBookmarks = async () => {
        const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false })

        if (error) console.error('Error fetching bookmarks:', error)
        if (data) setBookmarks(data);
    }



    const addBookmark = async () => {
        if (!user) return

        if (!title || !url) {
            alert('Please enter both title and URL')
            return
        }

        const { error } = await supabase.from('bookmarks').insert({
            title,
            url,
            user_id: user.id
        })

        if (error) {
            console.error('Error adding bookmark:', error)
            alert('Error adding bookmark')
        } else {
            setTitle('')
            setUrl('')
        }
    }

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)

        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Error deleting bookmark')
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }




    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {user && <p className="text-gray-600 text-sm sm:text-base">Logged in as: {user.email}</p>}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full sm:w-auto"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Bookmark</h2>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <input type="text" placeholder="Title (e.g., My Portfolio)" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="text-black border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input type="text" placeholder="URL (e.g., https://mywork.com)" value={url} onChange={(e) => setUrl(e.target.value)}
                            className="text-black border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={addBookmark} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            Add
                        </button>
                    </div>
                </div>


                <div className="grid gap-4">
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{bookmark.title}</h3>
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {bookmark.url}
                                </a>
                            </div>

                            <button onClick={() => deleteBookmark(bookmark.id)} className="text-red-500 hover:text-red-700 font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition">
                                Delete
                            </button>
                        </div>
                    ))}

                    {bookmarks.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No bookmarks yet. Add one above!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

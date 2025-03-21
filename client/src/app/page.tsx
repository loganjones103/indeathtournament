"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface User {
    _id: string;
    username: string;
    avatar: string;
    role: string;
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState(""); // Stores input field value
    const [saving, setSaving] = useState(false); // Prevents multiple requests
    const [message, setMessage] = useState(""); // Success/Error messages

    // ✅ Fetch user data initially and after login
    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/user", { withCredentials: true });
            setUser(res.data);
            setNewUsername(res.data.username); // Pre-fill username input
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(); // Initial fetch

        // ✅ Check if user was just redirected from login
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("loggedIn")) {
            fetchUser(); // Fetch user again to update UI
            window.history.replaceState(null, "", window.location.pathname); // Remove query param
        }
    }, []);

    const handleLogin = () => {
        window.location.href = "http://localhost:5000/auth/google"; // Redirect to Google login
    };

    const handleLogout = async () => {
        await axios.get("http://localhost:5000/auth/logout", { withCredentials: true });
        setUser(null);
    };

    // ✅ Handle username update
    const handleUpdateUsername = async () => {
        if (!newUsername.trim()) {
            setMessage("Username cannot be empty.");
            return;
        }
        if (newUsername === user?.username) {
            setMessage("This is already your username.");
            return;
        }

        try {
            setSaving(true);
            const res = await axios.put(
                "http://localhost:5000/auth/update-username",
                { username: newUsername },
                { withCredentials: true }
            );

            setMessage(res.data.message);
            fetchUser(); // Refresh user data after update
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Error updating username.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold">In Death Tournament</h1>
            <Link href="/tournaments">
                <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">View Tournaments</button>
            </Link>

            {user ? (
                <div className="mt-4 text-center">
                    <p className="text-lg">Welcome, <strong>{user.username}</strong>!</p>

                    {/* ✅ Avatar */}
                    <img src={user.avatar} alt="User Avatar" className="rounded-full w-20 h-20 mt-2 mx-auto" />

                    {/* ✅ Username Input + Save Button */}
                    {/* <div className="mt-4">
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border p-2 rounded w-64"
                            placeholder="Enter new username"
                        />
                        <button
                            onClick={handleUpdateUsername}
                            className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div> */}

                    {/* ✅ Success/Error Message */}
                    {message && <p className="mt-2 text-blue-500">{message}</p>}

                    {/* ✅ Logout Button */}
                    <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        Logout
                    </button>
                </div>
            ) : (
                <button onClick={handleLogin} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
                    Login with Google
                </button>
            )}
        </main>
    );
}

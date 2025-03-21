"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface User {
    _id: string;
    username: string;
    avatar: string;
    role: string;
}

export default function UserDropdown() {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    console.log("✅ UserDropdown component rendered!");

    // ✅ Fetch user data on mount
    useEffect(() => {
        axios
            .get("http://localhost:5000/auth/user", { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:5000/auth/logout", { withCredentials: true });
            setUser(null);
            window.location.reload(); // ✅ Forces UI update
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    const handleLogin = () => {
        window.location.href = "http://localhost:5000/auth/google";
    };

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            console.log("🖱 Click detected on:", event.target);

            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                console.log("❌ Closing dropdown");
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            console.log("🚀 Removing event listener");
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {user ? (
                <button
                    onClick={() => {
                        console.log("🔄 Toggling dropdown:", !isOpen);
                        setIsOpen((prev) => !prev);
                    }}
                    className="focus:outline-none"
                >
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full cursor-pointer"
                    />
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Login
                </button>
            )}

            {/* ✅ Dropdown Menu with Framer Motion Animation */}
            <AnimatePresence>
                {isOpen && user && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                        <p className="px-4 py-2 text-gray-700 font-semibold">{user.username}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

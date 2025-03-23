"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define User Type
interface User {
  _id: string;
  username: string;
  avatar: string;
  roles: string[];
}

// Create Context
const AuthContext = createContext<{ user: User | null, setUser: (user: User | null) => void }>({
  user: null,
  setUser: () => {}
});

// ✅ Provide AuthContext in `AuthWrapper.tsx`
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user`,
                    { withCredentials: true }
                );
                setUser(res.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

// ✅ Custom Hook to Use Auth
export function useAuth() {
  return useContext(AuthContext);
}

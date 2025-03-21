"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/auth/user", { withCredentials: true });

                if (res.data.roles.includes("admin") || res.data.roles.includes("creator")) {
                    setUser(res.data);
                } else {
                    router.push("/"); // Redirect non-admins
                }
            } catch (error) {
                router.push("/"); // Redirect if not logged in
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Tournament {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    rules: string;
    createdBy: { _id: string; username: string };
}

export default function EditTournament() {
    const { id } = useParams();
    const router = useRouter();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [user, setUser] = useState<{ _id: string; username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        type: "",
        rules: ""
    });

    useEffect(() => {
        if (!id) return;

        // ✅ Fetch Tournament
        axios.get(`http://localhost:5000/api/tournaments/${id}`)
            .then(res => {
                setTournament(res.data);
                setFormData({
                    name: res.data.name,
                    description: res.data.description,
                    startDate: res.data.startDate.split("T")[0],
                    endDate: res.data.endDate.split("T")[0],
                    type: res.data.type,
                    rules: res.data.rules
                });
            })
            .catch(() => setError("Tournament not found"))
            .finally(() => setLoading(false));

        // ✅ Fetch User
        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, [id]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/tournaments/${id}`, formData, { withCredentials: true });
            alert("Tournament updated successfully!");
            router.push(`/tournaments/${id}`);
        } catch (err) {
            alert("Failed to update tournament.");
        }
    };

    if (loading) return <p>Loading tournament...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!tournament) return null;

    // ✅ Restrict Editing to Admins or the Tournament Creator
    if (!user || !tournament?.createdBy || (user._id !== tournament.createdBy._id && user.role !== "admin")) {
        return <p className="text-red-500">Access denied. You cannot edit this tournament.</p>;
    }

    return (
        <main className="flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold">Edit Tournament</h1>
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <label className="block">Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full" required />

                <label className="block mt-2">Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full" required />

                <label className="block mt-2">Start Date:</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border p-2 w-full" required />

                <label className="block mt-2">End Date:</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border p-2 w-full" required />

                <label className="block mt-2">Type:</label>
                <input type="text" name="type" value={formData.type} onChange={handleChange} className="border p-2 w-full" required />

                <label className="block mt-2">Rules:</label>
                <textarea name="rules" value={formData.rules} onChange={handleChange} className="border p-2 w-full" required />

                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Update Tournament
                </button>
            </form>
        </main>
    );
}

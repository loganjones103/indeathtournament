"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditTournament() {
    const params = useParams(); // ✅ Fetch dynamic ID
    const router = useRouter();
    const id = params.id as string; // Ensure it's a string

    const [tournament, setTournament] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        type: "high-score",
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
    if (!user || !tournament?.createdBy || (!user.roles.includes("admin") && user._id !== tournament.createdBy._id)) {
        return <p className="text-red-500">Access denied. You cannot edit this tournament.</p>;
    }

    return (
        <main className="flex flex-col items-center p-10 bg-[#0d1017] min-h-screen">
            <h1 className="text-3xl font-bold text-white">Edit Tournament</h1>
            <form className="w-full max-w-lg bg-[#161b22] p-6 shadow-lg rounded-lg border border-gray-700" onSubmit={handleSubmit}>
                <label className="text-white block">Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full bg-[#0d1017] text-white" required />

                <label className="text-white block mt-2">Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full bg-[#0d1017] text-white" required />

                <label className="text-white block mt-2">Start Date:</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border p-2 w-full bg-[#0d1017] text-white" required />

                <label className="text-white block mt-2">End Date:</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border p-2 w-full bg-[#0d1017] text-white" required />

                <label className="text-white block mt-2">Type:</label>
                <select name="type" value={formData.type} onChange={handleChange} className="border p-2 w-full bg-[#0d1017] text-white">
                    <option value="high-score">High Score</option>
                    <option value="elimination">Elimination</option>
                </select>

                <label className="text-white block mt-2">Rules:</label>
                <textarea name="rules" value={formData.rules} onChange={handleChange} className="border p-2 w-full bg-[#0d1017] text-white" required />

                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Update Tournament
                </button>
            </form>
        </main>
    );
}

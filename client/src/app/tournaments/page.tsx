"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Tournament {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    rules: string;
    createdBy?: { username: string };
    participants?: { userId: string; username: string }[];
}

export default function TournamentList() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState<{ _id: string; username: string } | null>(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/tournaments")
            .then(res => setTournaments(res.data))
            .catch(() => setError("Failed to load tournaments"))
            .finally(() => setLoading(false));

        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const handleJoin = async (tournamentId: string) => {
        if (!user) {
            alert("You must be logged in to join a tournament!");
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:5000/api/tournaments/${tournamentId}/join`,
                {},
                { withCredentials: true }
            );
            alert(res.data.message);

            setTournaments(prev =>
                prev.map(t =>
                    t._id === tournamentId
                        ? {
                            ...t,
                            participants: [
                                ...(t.participants || []),
                                { userId: user._id, username: user.username }
                            ]
                        }
                        : t
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to join tournament.");
        }
    };

    if (loading) return <p>Loading tournaments...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <main className="flex flex-col items-center p-10">
            <div className="relative w-full max-w-3xl mt-6 mb-6">
                <Link href="/">
                    <p className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer hover:underline">
                        Back
                    </p>
                </Link>
                <h1 className="text-3xl font-bold text-center">Tournaments</h1>
            </div>

            <div className="w-full max-w-3xl">
                {tournaments.length > 0 ? (
                    tournaments.map(tournament => (
                        <div key={tournament._id} className="p-4 mb-4 border rounded shadow blue-border">
                            <h2 className="text-xl font-bold">
                                <Link
                                    href={`/tournaments/${tournament._id}`}
                                    className="text-blue-500 underline"
                                >
                                    {tournament.name}
                                </Link>
                            </h2>
                            <p className="text-gray-600">{tournament.description}</p>
                            <p className="text-sm">
                                <strong>Start:</strong> {new Date(tournament.startDate).toLocaleDateString()} |
                                <strong> End:</strong> {new Date(tournament.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm"><strong>Type:</strong> {tournament.type}</p>
                            <p className="text-sm"><strong>Rules:</strong> {tournament.rules}</p>
                            {tournament.createdBy && (
                                <p className="text-sm text-gray-500">
                                    Created by: {tournament.createdBy.username}
                                </p>
                            )}
                            <p className="text-sm">
                                <strong>Participants:</strong> {tournament.participants?.length || 0}
                            </p>

                            {user && !tournament.participants?.some(p => p.userId === user._id) && (
                                <button
                                    onClick={() => handleJoin(tournament._id)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Join Tournament
                                </button>
                            )}

                            {user && tournament.participants?.some(p => p.userId === user._id) && (
                                <p className="text-green-500 mt-2">✔ You have joined this tournament</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No tournaments available.</p>
                )}
            </div>
        </main>
    );
}

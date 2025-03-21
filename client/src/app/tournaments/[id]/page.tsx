"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ScoreSubmission from "../../../components/ScoreSubmission";

interface Tournament {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    rules: string;
    createdBy: { _id: string; username: string };
    participants: { userId: string; username: string; score: number; proof: string }[];
}

export default function TournamentDetails() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [user, setUser] = useState<{ _id: string; username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        // ✅ Fetch tournament data
        axios.get(`http://localhost:5000/api/tournaments/${id}`)
            .then(res => setTournament(res.data))
            .catch(() => setError("Tournament not found"))
            .finally(() => setLoading(false));

        // ✅ Fetch user data
        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this tournament?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/tournaments/${id}`, { withCredentials: true });
            alert("Tournament deleted!");
            router.push("/tournaments");
        } catch (err) {
            alert("Failed to delete tournament.");
        }
    };

    const fetchTournament = () => {
        axios.get(`http://localhost:5000/api/tournaments/${id}`)
            .then(res => setTournament(res.data))
            .catch(() => setError("Tournament not found"));
    };

    if (loading) return <p>Loading tournament...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!tournament) return null;

    return (
        <main className="flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold">{tournament?.name}</h1>
            <p className="text-lg">{tournament?.description}</p>

            <div className="relative w-full max-w-2xl mt-6">
                <Link href="/tournaments">
                    <p className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer hover:underline">Back</p>
                </Link>
                <h2 className="text-xl font-bold text-center">Leaderboard</h2>
                {user && (user._id === tournament.createdBy._id || user.role === "admin") && (
                    <span onClick={handleDelete} className="absolute right-0 top-1/2 -translate-y-1/2 text-red-600 cursor-pointer hover:underline">
                        Delete
                    </span>
                )}
            </div>

            <table className="w-full max-w-2xl mt-4 border">
                <thead>
                    <tr className="bg-gray-200 lb-header">
                        <th className="p-2">Rank</th>
                        <th className="p-2">Player</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Proof</th>
                    </tr>
                </thead>
                <tbody className="lb-body">
                    {(tournament?.participants ?? [])
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => {
                            return (
                                <tr key={player.userId || `${index}-${player.username}`}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{player.username}</td>
                                    <td className="p-2">{player.score ?? "N/A"}</td>
                                    <td className="p-2">
                                        {player.proof ? (
                                            <a href={player.proof} target="_blank" className="text-blue-500 underline">
                                                View Proof
                                            </a>
                                        ) : (
                                            "No Proof"
                                        )}
                                    </td>
                                </tr>
                            );
                        }
                        )}
                </tbody>

            </table>

            {/* ✅ Score Submission Form (Only show if logged in) */}
            {user && <ScoreSubmission tournamentId={id} userId={user._id} onScoreSubmit={fetchTournament} />}
        </main>
    );
}

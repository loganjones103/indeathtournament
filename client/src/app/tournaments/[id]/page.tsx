"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ScoreSubmission from "../../../components/ScoreSubmission";
import { motion, AnimatePresence } from "framer-motion";

interface Tournament {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
    weaponType?: string;
    rules: string;
    createdBy: { _id: string; username: string };
    participants: { userId: string; username: string; score: number; proof: string }[];
}

export default function TournamentDetails() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [user, setUser] = useState<{ _id: string; username: string; roles: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalImage, setModalImage] = useState<string | null>(null);

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    const listVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    useEffect(() => {
        if (!id) return;

        axios.get(`http://localhost:5000/api/tournaments/${id}`)
            .then(res => setTournament(res.data))
            .catch(() => setError("Tournament not found"))
            .finally(() => setLoading(false));

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
        <main className="flex flex-col items-center p-10 relative">
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold"
            >
                {tournament.name}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg mt-2 text-center max-w-2xl"
            >
                {tournament.description}
            </motion.p>

            <div className="text-sm text-gray-400 mt-2 space-y-1 text-center">
                <p><strong>Type:</strong> {tournament.type}</p>
                <p><strong>Weapon Type:</strong> {tournament.weaponType || "Any"}</p>
                <p><strong>Rules:</strong> {tournament.rules}</p>
                <p><strong>Start:</strong> {new Date(tournament.startDate).toLocaleDateString()} | <strong>End:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                <p><strong>Created by:</strong> {tournament.createdBy.username}</p>
            </div>

            <div className="relative w-full max-w-2xl mt-6">
                <Link href="/tournaments">
                    <p className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer hover:underline">
                        Back
                    </p>
                </Link>
                <h2 className="text-xl font-bold text-center">Leaderboard</h2>
                {user && (user._id === tournament.createdBy._id || user.roles.includes("admin")) && (
                    <>
                        <span
                            onClick={handleDelete}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-red-600 cursor-pointer hover:underline"
                        >
                            Delete
                        </span>
                        <Link href={`/tournaments/${id}/edit`}>
                            <p className="absolute right-24 top-1/2 -translate-y-1/2 text-blue-500 cursor-pointer hover:underline">
                                Edit
                            </p>
                        </Link>
                    </>
                )}
            </div>

            <motion.table
                className="w-full max-w-2xl mt-4 border"
                variants={listVariants}
                initial="hidden"
                animate="show"
            >
                <thead>
                    <tr className="bg-gray-200 lb-header">
                        <th className="p-2">Rank</th>
                        <th className="p-2">Player</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Proof</th>
                    </tr>
                </thead>
                <motion.tbody className="lb-body">
                    {(tournament.participants ?? [])
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => (
                            <motion.tr key={player.userId || `${index}-${player.username}`} variants={rowVariants}>
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{player.username}</td>
                                <td className="p-2">{player.score ?? "N/A"}</td>
                                <td className="p-2">
                                    {player.proof ? (
                                        <img
                                            src={`http://localhost:5000${player.proof}`}
                                            alt="Proof"
                                            className="w-20 h-20 rounded center-img cursor-pointer hover:opacity-80"
                                            onClick={() => setModalImage(`http://localhost:5000${player.proof}`)}
                                        />
                                    ) : (
                                        "No Proof"
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                </motion.tbody>
            </motion.table>

            {user && (
                <ScoreSubmission tournamentId={id} userId={user._id} onScoreSubmit={fetchTournament} />
            )}

            <AnimatePresence>
                {modalImage && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                        onClick={() => setModalImage(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.img
                            src={modalImage}
                            alt="Proof Full Size"
                            className="max-w-[90%] max-h-[90%] rounded-lg border-4 border-white"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

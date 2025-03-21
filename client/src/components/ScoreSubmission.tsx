"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
    tournamentId: string;
    userId: string;
    onScoreSubmit: () => void; // ✅ Callback to refresh leaderboard
}

export default function ScoreSubmission({ tournamentId, userId, onScoreSubmit }: Props) {
    const [score, setScore] = useState("");
    const [proof, setProof] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post(`http://localhost:5000/api/tournaments/${tournamentId}/submit-score`, 
                { score, proof }, 
                { withCredentials: true }
            );

            setMessage(res.data.message);
            setScore("");  // ✅ Clear input field
            setProof("");   // ✅ Clear input field
            onScoreSubmit(); // ✅ Refresh leaderboard
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Error submitting score.");
        }
    };

    return (
        <div className="mt-4 p-4 border rounded shadow">
            <h3 className="text-lg font-bold">Submit Your Score</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="number" 
                    value={score} 
                    onChange={(e) => setScore(e.target.value)} 
                    placeholder="Your Score"
                    className="border p-2 rounded w-full mt-2"
                    required
                />
                <input 
                    type="text" 
                    value={proof} 
                    onChange={(e) => setProof(e.target.value)} 
                    placeholder="Screenshot URL (Proof)"
                    className="border p-2 rounded w-full mt-2"
                    required
                />
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Submit Score
                </button>
            </form>
            {message && <p className="mt-2 text-green-500">{message}</p>}
        </div>
    );
}

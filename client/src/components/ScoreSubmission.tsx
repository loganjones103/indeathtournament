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
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]); // ✅ Store selected file
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            setMessage("Please upload an image as proof.");
            return;
        }

        const formData = new FormData();
        formData.append("score", score);
        formData.append("proof", image); // ✅ Append image file

        try {
            const res = await axios.post(
                `http://localhost:5000/api/tournaments/${tournamentId}/submit-score`, 
                formData, 
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            setMessage(res.data.message);
            setScore("");  // ✅ Clear input field
            setImage(null); // ✅ Reset file input
            onScoreSubmit(); // ✅ Refresh leaderboard
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Error submitting score.");
        }
    };

    return (
        <div className="mt-4 p-4 border rounded shadow blue-border">
            <h3 className="text-lg font-bold">Submit Your Score</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input 
                    type="number" 
                    value={score} 
                    onChange={(e) => setScore(e.target.value)} 
                    placeholder="Your Score"
                    className="border p-2 rounded w-full mt-2"
                    required
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
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

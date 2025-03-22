"use client";

import { useState, useRef } from "react";
import axios from "axios";

interface Props {
    tournamentId: string;
    userId: string;
    onScoreSubmit: () => void;
}

export default function ScoreSubmission({ tournamentId, userId, onScoreSubmit }: Props) {
    const [score, setScore] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
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
        formData.append("proof", image);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tournaments/${tournamentId}/submit-score`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMessage(res.data.message);
            setScore("");
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            onScoreSubmit();
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Error submitting score.");
        }
    };

    return (
        <div className="mt-4 p-4 max-w-2xl border rounded shadow blue-border">
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
                    ref={fileInputRef}
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

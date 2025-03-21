"use client";

import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-bold text-center">Welcome to In Death Tournament</h1>
            <p className="text-lg text-gray-400 mt-2">
                Compete in tournaments, climb the leaderboard, and prove your skills.
            </p>

            <div className="mt-6 flex gap-4">
                <Link href="/tournaments">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow hover:bg-blue-600 transition">
                        View Tournaments
                    </button>
                </Link>

                <Link href="/create-tournament">
                    <button className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg shadow hover:bg-green-600 transition">
                        Create a Tournament
                    </button>
                </Link>
            </div>
        </main>
    );
}

// ✅ Updated TournamentForm.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InputField from "./InputField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function TournamentForm() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        type: "high-score",
        weaponType: "Any",
        rules: ""
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (startDateRef.current) {
            flatpickr(startDateRef.current, {
                dateFormat: "Y-m-d",
                allowInput: true,
                onChange: (selectedDates) => {
                    if (selectedDates.length > 0) {
                        setFormData((prev) => ({ ...prev, startDate: selectedDates[0].toISOString().split("T")[0] }));
                    }
                },
            });
        }

        if (endDateRef.current) {
            flatpickr(endDateRef.current, {
                dateFormat: "Y-m-d",
                allowInput: true,
                onChange: (selectedDates) => {
                    if (selectedDates.length > 0) {
                        setFormData((prev) => ({ ...prev, endDate: selectedDates[0].toISOString().split("T")[0] }));
                    }
                },
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await axios.post("http://localhost:5000/api/tournaments", formData, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
            setMessage("Tournament created successfully!");
            setFormData({
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                type: "high-score",
                weaponType: "Any",
                rules: ""
            });
            router.push("/tournaments");
        } catch (err: any) {
            setMessage("Error: " + (err.response?.data?.message || "Failed to create tournament."));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1017]">
            <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-[#161b22] shadow-lg rounded-lg border border-gray-700 create-form">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Create a Tournament</h2>

                <InputField label="Tournament Name" name="name" value={formData.name} onChange={handleChange} />
                <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} />

                <div className="mb-4">
                    <label className="text-gray-700 custom-date">Start Date</label>
                    <input ref={startDateRef} name="startDate" className="mt-1 p-2 border rounded w-full" readOnly />
                </div>

                <div className="mb-4">
                    <label className="text-gray-700 mt-4 custom-date">End Date</label>
                    <input ref={endDateRef} name="endDate" className="mt-1 p-2 border rounded w-full" readOnly />
                </div>

                <SelectField
                    label="Tournament Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={[{ value: "high-score", label: "High Score" }]}
                />

                <SelectField
                    label="Weapon Type"
                    name="weaponType"
                    value={formData.weaponType}
                    onChange={handleChange}
                    options={[
                        { value: "Bow", label: "Bow" },
                        { value: "Crossbow", label: "Crossbow" },
                        { value: "Any", label: "Any" }
                    ]}
                />

                <TextAreaField label="Rules" name="rules" value={formData.rules} onChange={handleChange} />

                <button type="submit" className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
                    Create Tournament
                </button>

                {message && <p className="mt-4 text-center text-white">{message}</p>}
            </form>
        </div>
    );
}

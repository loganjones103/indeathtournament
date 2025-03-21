"use client";

import { useState } from "react";
import axios from "axios";
import InputField from "./InputField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";

export default function TournamentForm() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        type: "high-score",
        rules: ""
    });
    const [message, setMessage] = useState("");

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
            setFormData({ name: "", description: "", startDate: "", endDate: "", type: "high-score", rules: "" });
        } catch (err: any) {
            setMessage("Error: " + err.response?.data?.message || "Failed to create tournament.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Create a Tournament</h2>

            <InputField label="Tournament Name" name="name" value={formData.name} onChange={handleChange} />
            <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} />
            <InputField label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            <InputField label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />

            <SelectField
                label="Tournament Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                    { value: "high-score", label: "High Score" },
                    { value: "elimination", label: "Elimination" }
                ]}
            />

            <TextAreaField label="Rules" name="rules" value={formData.rules} onChange={handleChange} />

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Create Tournament</button>
            
            {message && <p className="mt-4 text-center">{message}</p>}
        </form>
    );
}

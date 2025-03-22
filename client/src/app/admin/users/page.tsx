"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
    type User = {
        _id: string;
        username: string;
        email: string;
        roles: string[];
    };

    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState("");

    const API = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        axios
            .get(`${API}/api/users`, { withCredentials: true })
            .then(res => setUsers(res.data))
            .catch(() => setMessage("Failed to load users"));
    }, []);

    const handleRoleToggle = async (userId: string, role: string) => {
        const updatedUsers = users.map(user =>
            user._id === userId
                ? {
                    ...user,
                    roles: user.roles.includes(role)
                        ? user.roles.filter(r => r !== role)
                        : [...user.roles, role],
                }
                : user
        );

        setUsers(updatedUsers);

        const updatedUser = updatedUsers.find(user => user._id === userId);
        try {
            await axios.put(
                `${API}/api/users/${userId}/roles`,
                { roles: updatedUser?.roles || [] },
                { withCredentials: true }
            );
            setMessage("Roles updated!");
        } catch {
            setMessage("Failed to update roles");
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl mb-4">Manage Users</h1>
            {message && <p className="mb-4">{message}</p>}

            <table className="w-full bg-[#161b22] rounded border border-gray-600">
                <thead>
                    <tr className="bg-gray-800 text-left">
                        <th className="p-2">Username</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="border-t border-gray-700">
                            <td className="p-2">{user.username}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                                {["admin", "creator", "player"].map(role => (
                                    <label key={role} className="mr-4">
                                        <input
                                            type="checkbox"
                                            checked={user.roles.includes(role)}
                                            onChange={() => handleRoleToggle(user._id, role)}
                                            className="mr-1"
                                        />
                                        {role}
                                    </label>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

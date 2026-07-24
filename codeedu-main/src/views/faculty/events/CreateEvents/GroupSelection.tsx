import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

interface User {
    name: string;
    email: string;
}

interface GroupSelectionProps {
    formData: {
        groupName: string;
        groupCSV?: File | null;
        groupMembers: User[];
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const sampleUsers: User[] = [
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Smith", email: "bob@example.com" },
    { name: "Charlie Brown", email: "charlie@example.com" },
    { name: "Diana Prince", email: "diana@example.com" },
    { name: "Ethan Hunt", email: "ethan@example.com" },
];

const GroupSelection: React.FC<GroupSelectionProps> = ({
    formData,
    handleChange,
    // handleNext,
    handleBack,
}) => {
    const [mode, setMode] = useState<"select" | "csv">("select");
    const [newGroupName, setNewGroupName] = useState(formData.groupName || "");
    const [selectedUsers, setSelectedUsers] = useState<User[]>(formData.groupMembers || []);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewGroupName(e.target.value);
        handleChange(e);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse<User>(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<User>) => {
                    const parsedUsers: User[] = results.data.filter(
                        (user: Partial<User>): user is User => !!user.email && !!user.name
                    );

                    const uniqueUsers: User[] = parsedUsers.filter(
                        (newUser: User) => !selectedUsers.some((u: User) => u.email === newUser.email)
                    );

                    setSelectedUsers([...selectedUsers, ...uniqueUsers]);
                },
                error: (error: Papa.ParseError) => {
                    console.error("Error parsing CSV:", error);
                }
            });
        }

        handleChange(e);
    };

    const handleAddUser = (user: User) => {
        if (!selectedUsers.some(u => u.email === user.email)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (email: string) => {
        setSelectedUsers(selectedUsers.filter(u => u.email !== email));
    };

    const filteredUsers = sampleUsers.filter(
        u =>
            (u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())) &&
            !selectedUsers.some(su => su.email === u.email)
    );

    const handleCreateGroup = () => {
        navigate("/manage-events/5618/activity");
    };

    return (
        <form className="bg-white shadow-lg rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Group</h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                    How do you want to create the group?
                </label>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${mode === "select" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setMode("select")}
                    >
                        Select Users
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${mode === "csv" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setMode("csv")}
                    >
                        Upload CSV
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Group Name</label>
                <input
                    type="text"
                    name="groupName"
                    value={newGroupName}
                    placeholder="Enter group name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleGroupNameChange}
                />
            </div>

            <div className="flex w-full space-x-4">
                <div className="w-1/2">
                    {mode === "select" && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Add Members</label>
                            <input
                                type="text"
                                placeholder="Search users by name or email"
                                value={search}
                                className="w-full px-4 py-2 border rounded-lg mb-2"
                                onChange={e => setSearch(e.target.value)}
                            />
                            <div className="max-h-32 overflow-y-auto border rounded mb-2">
                                {filteredUsers.length === 0 && (
                                    <div className="p-2 text-gray-500">No users found</div>
                                )}
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.email}
                                        className="flex justify-between items-center px-2 py-1 hover:bg-blue-50 cursor-pointer"
                                        onClick={() => handleAddUser(user)}
                                    >
                                        <span>{user.name} <span className="text-xs text-gray-500">({user.email})</span></span>
                                        <button className="text-primary text-sm">Add</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {mode === "csv" && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Upload CSV</label>
                            <input
                                type="file"
                                name="groupCSV"
                                accept=".csv"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>
                <div className="w-1/2">
                    {selectedUsers.length > 0 && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Added Members</label>
                            <ul className="max-h-48 overflow-y-auto">
                                {selectedUsers.map(user => (
                                    <li
                                        key={user.email}
                                        className="flex items-center justify-between bg-gray-100 rounded px-2 py-1 mb-1"
                                    >
                                        <span>{user.name} <span className="text-xs text-gray-500">({user.email})</span></span>
                                        <button
                                            type="button"
                                            className="text-red-500 text-sm"
                                            onClick={() => handleRemoveUser(user.email)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                    onClick={handleBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-deep font-medium"
                    onClick={handleCreateGroup}
                >
                    Create Group
                </button>
            </div>
        </form>
    );
};

export default GroupSelection;

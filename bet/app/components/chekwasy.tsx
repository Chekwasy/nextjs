// components/PostXForm.tsx
"use client";

import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


// Define the structure of the data to be sent
interface PostXData {
    db: string[]; // Array of selected checkbox values
    openBalance: number;
    todayStake: number;
    totalOdd: number;
    expectedBalance: number;
    code: string;

}

export default function PostXForm() {

    const [selectedDbs, setSelectedDbs] = useState<string[]>([]);
    const [openBalance, setOpenBalance] = useState<string>('');
    const [todayStake, setTodayStake] = useState<string>('');
    const [totalOdd, setTotalOdd] = useState<string>('');
    const [expectedBalance, setExpectedBalance] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);

    const dbOptions = ['two2win', 'three2win', 'threepro', 'sevenpro'];

    // Handle checkbox change
    const handleDbChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedDbs(prev =>
            checked ? [...prev, value] : prev.filter(db => db !== value)
        );
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setMessage(null);
        setIsError(false);

        // Basic validation
        if (selectedDbs.length === 0) {
            setMessage('Please select at least one database option.');
            setIsError(true);
            return;
        }

        const dataToSend: PostXData = {
            db: selectedDbs,
            openBalance: parseFloat(openBalance || '0'),
            todayStake: parseFloat(todayStake || '0'),
            totalOdd: parseFloat(totalOdd || '0'),
            expectedBalance: parseFloat(expectedBalance || '0'),
            code: code,
        };

        try {
            const response = await axios.post('/api/postx', {}, {
                headers: {
                'tok': Cookies.get('trybet_tok') || '',
                'Content-Type': 'application/json',
                saved: JSON.stringify(dataToSend),
                },
            });
            setMessage('Data successfully sent!');
            setIsError(false);
            console.log('Success:', response.data);
            // Optionally clear form fields after successful submission
            setSelectedDbs([]);
            setOpenBalance('');
            setTodayStake('');
            setTotalOdd('');
            setExpectedBalance('');
            setCode('');
        } catch (error) {
            console.error('Error sending data:', error);
            setMessage('Failed to send data. Please try again.');
            setIsError(true);
        }
    };

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                Enter Bet Data
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* DB Checkboxes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Database(s):</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {dbOptions.map(option => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={option}
                                    name="db"
                                    type="checkbox"
                                    value={option}
                                    checked={selectedDbs.includes(option)}
                                    onChange={handleDbChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={option} className="ml-2 block text-sm font-medium text-gray-900 capitalize">
                                    {option.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* General Bet Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="openBalance" className="form-label">Open Balance</label>
                        <input
                            type="number"
                            id="openBalance"
                            className="form-input"
                            value={openBalance}
                            onChange={(e) => setOpenBalance(e.target.value)}
                            placeholder="e.g., 10000"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="todayStake" className="form-label">Stake</label>
                        <input
                            type="number"
                            id="todayStake"
                            className="form-input"
                            value={todayStake}
                            onChange={(e) => setTodayStake(e.target.value)}
                            placeholder="e.g., 500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="totalOdd" className="form-label">Total Odd</label>
                        <input
                            type="number"
                            id="totalOdd"
                            className="form-input"
                            step="0.01"
                            value={totalOdd}
                            onChange={(e) => setTotalOdd(e.target.value)}
                            placeholder="e.g., 2.50"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="expectedBalance" className="form-label">Expected Balance</label>
                        <input
                            type="number"
                            id="expectedBalance"
                            className="form-input"
                            value={expectedBalance}
                            onChange={(e) => setExpectedBalance(e.target.value)}
                            placeholder="e.g., 12500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="code" className="form-label">Bet Code</label>
                    <input
                        type="text"
                        id="code"
                        className="form-input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g., AZX12345"
                        required
                    />
                </div>

                {/* Submission Message */}
                {message && (
                    <div className={`p-3 rounded-md text-center text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Submit Bet Data
                </button>
            </form>
        </div>
    </div>
    );
}
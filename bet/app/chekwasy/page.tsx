// components/PostXForm.tsx
"use client";

import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { StoreState } from '../tools/s_interface';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

// Define an interface for a single game entry
interface GameInput {
    hometeam: string;
    awayteam: string;
    selection: string;
    odd: string;
}

// Define the structure of the data to be sent
interface PostXData {
    db: string[]; // Array of selected checkbox values
    openBalance: number;
    todayStake: number;
    totalOdd: number;
    expectedBalance: number;
    code: string;
    gamesNumber: number;
    games: GameInput[]; // Array of game objects
}

export default function PostXForm() {
    //useSelector to extract what is in the store
    const storeItems: StoreState = useSelector((state) => state) as StoreState;
    const [selectedDbs, setSelectedDbs] = useState<string[]>([]);
    const [openBalance, setOpenBalance] = useState<string>('');
    const [todayStake, setTodayStake] = useState<string>('');
    const [totalOdd, setTotalOdd] = useState<string>('');
    const [expectedBalance, setExpectedBalance] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [gamesNumber, setGamesNumber] = useState<number>(0);
    const [games, setGames] = useState<GameInput[]>([]);

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

    // Handle change for games number input
    const handleGamesNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseInt(event.target.value, 10);
        if (!isNaN(num) && num >= 0) {
            setGamesNumber(num);
            // Initialize or resize the games array based on the new number
            setGames(prevGames => {
                const newGames = [...prevGames];
                while (newGames.length < num) {
                    newGames.push({ hometeam: '', awayteam: '', selection: '', odd: '' });
                }
                return newGames.slice(0, num);
            });
        } else {
            setGamesNumber(0);
            setGames([]);
        }
    };

    // Handle changes for individual game inputs (hometeam, awayteam, etc.)
    const handleGameInputChange = (
        index: number,
        field: keyof GameInput,
        value: string
    ) => {
        setGames(prevGames => {
            const newGames = [...prevGames];
            newGames[index] = {
                ...newGames[index],
                [field]: value
            };
            return newGames;
        });
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
        if (gamesNumber > 0 && games.some(game => !game.hometeam || !game.awayteam || !game.selection || !game.odd)) {
            setMessage('Please fill in all game details.');
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
            gamesNumber: gamesNumber,
            games: games,
        };

        try {
            const response = await axios.post('/api/postx', dataToSend, {
                headers: {
                'tok': Cookies.get('trybet_tok') || '',
                'Content-Type': 'application/json',
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
            setGamesNumber(0);
            setGames([]);
        } catch (error) {
            console.error('Error sending data:', error);
            setMessage('Failed to send data. Please try again.');
            setIsError(true);
        }
    };

    // Generate game input fields dynamically
    const renderGameInputs = () => {
        return Array.from({ length: gamesNumber }).map((_, index) => (
            <div key={index} className="border p-4 rounded-md bg-gray-50 shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Game {index + 1} Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Home Team"
                        className="form-input"
                        value={games[index]?.hometeam || ''}
                        onChange={(e) => handleGameInputChange(index, 'hometeam', e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Away Team"
                        className="form-input"
                        value={games[index]?.awayteam || ''}
                        onChange={(e) => handleGameInputChange(index, 'awayteam', e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Selection (e.g., Home Win, Over 2.5)"
                        className="form-input"
                        value={games[index]?.selection || ''}
                        onChange={(e) => handleGameInputChange(index, 'selection', e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Odd (e.g., 1.85)"
                        className="form-input"
                        value={games[index]?.odd || ''}
                        onChange={(e) => handleGameInputChange(index, 'odd', e.target.value)}
                        required
                    />
                </div>
            </div>
        ));
    };

    if (storeItems?.mainSlice.me.email === 'richardchekwas@gmail.com') {
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
                            <label htmlFor="todayStake" className="form-label">{`Today's`} Stake</label>
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

                    {/* Games Number Input */}
                    <div>
                        <label htmlFor="gamesNumber" className="form-label">Number of Games</label>
                        <input
                            type="number"
                            id="gamesNumber"
                            className="form-input"
                            min="0"
                            value={gamesNumber}
                            onChange={handleGamesNumberChange}
                            placeholder="e.g., 3"
                            required
                        />
                    </div>

                    {/* Dynamic Game Inputs */}
                    {renderGameInputs()}

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
    } else return (<div></div>)
}
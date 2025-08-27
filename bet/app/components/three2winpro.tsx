"use client";

import { useState, useEffect, MouseEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

// Local imports for types and utilities
import { StoreState } from '../tools/s_interface';
import { isDateInPast } from '../tools/dateitems';
import { monthL, weekL, getCalender } from '../tools/lists_dict';

// Define the interface for a single three2winpro entry
interface Three2WinProEntry {
    time: string;
    Sbal: string;
    stake: string;
    odd: string;
    Ebal: string;
    status: string;
    code: string;
}

export default function Three2WinPro() {
    const storeItems: StoreState = useSelector((state) => state) as StoreState;

    // State for betting data
    const [three2winpro, setThree2winpro] = useState<Three2WinProEntry[]>([{
        time: '',
        Sbal: '0',
        stake: '0',
        odd: '0',
        Ebal: '0',
        status: '',
        code: '',
    }]);

    // State for calendar and date selection
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [todayFormatted, setTodayFormatted] = useState('');
    const [calendar, setCalendar] = useState<Array<Array<string | number>>>([]);

    // State for UI elements like guide and messages
    const [showGuide, setShowGuide] = useState(false);
    const [message, setMessage] = useState('');
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    /**
     * Closes the message popup.
     */
    const handleCloseMessage = () => {
        setIsMessageOpen(false);
    };

    /**
     * Handles clicks on the overlay to close the message popup.
     * @param e The mouse event.
     */
    const handleOverlayClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
            handleCloseMessage();
        }
    };

    /**
     * Fetches betting data for a specific date and updates the state.
     * Displays messages for no data or errors.
     * @param day The day of the month.
     * @param month The month (e.g., "January", "February").
     * @param year The year.
     */
    const fetchThree2WinProData = (day: string, month: string, year: string) => {
        if (!day) return;

        const formattedDate = `${day.padStart(2, '0')}${month}${year}`;
        axios.get(`/api/getthree2winpro?date=${formattedDate}`, {
            headers: { tok: Cookies.get('trybet_tok') },
        })
        .then((response) => {
            if (response.data.game) {
                setThree2winpro(response.data.game);
                setSelectedDay(day);
                setIsCalendarOpen(false);
            } else {
                setMessage('No data available for the selected date.');
                setIsMessageOpen(true);
                setIsCalendarOpen(false);
            }
        })
        .catch(error => {
            console.error('Error fetching three2winpro data:', error.message);
            setMessage('Failed to retrieve game data. Please try again later.');
            setIsMessageOpen(true);
        });
    };

    // Effect to update the calendar whenever the selected month or year changes
    useEffect(() => {
        if (selectedYear && selectedMonth) {
            setCalendar(getCalender(parseInt(selectedYear), parseInt(selectedMonth.slice(-2))));
        }
    }, [selectedYear, selectedMonth]);

    // Effect to fetch initial date and betting data on component mount
    useEffect(() => {
        axios.get('/api/getdate', {
            headers: { tok: Cookies.get('trybet_tok') },
        })
        .then((response) => {
            const { day, month, year } = response.data;
            const monthName = monthL[month];

            setSelectedDay(day.toString());
            setSelectedMonth(monthName);
            setSelectedYear(year.toString());
            setTodayFormatted(`${day}${monthName}${year}`);
            setCalendar(getCalender(year, month + 1)); // month + 1 because getCalender expects 1-indexed month

            fetchThree2WinProData(day.toString(), monthName, year.toString());
        })
        .catch(error => {
            console.error('Error fetching current date:', error.message);
            setMessage('Could not load current date. Please check your connection.');
            setIsMessageOpen(true);
        });
    }, []);

    const hasSubscriptionExpired = isDateInPast(storeItems.mainSlice?.me.sub.slice(-8));

    return (
        <div className="flex flex-col items-center mt-16 min-h-screen bg-gray-100 py-8 px-4">
            {/* Subscription Activation Button */}
            {!showGuide && hasSubscriptionExpired && (
                <div className="w-full max-w-4xl mx-auto mb-6">
                    <Link href="/sub" className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 ease-in-out shadow-md">
                        Activate Your Subscription
                    </Link>
                </div>
            )}

            {/* Date Selection and Betting Data Display */}
            {!showGuide && (
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center rounded-lg bg-white p-4 shadow-md">
                        <Image
                            src="/icons/threepro.svg"
                            alt="Three2Win"
                            width={24}
                            height={24}
                            className="filter brightness-0 invert mr-3"
                        />
                        <h2 className="ml-2 text-xl font-semibold text-green-950">
                            Three2WinPRO
                        </h2>
                    </div>
                    <div
                        className="flex justify-center items-center p-4 mb-6 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        📅 Date: {selectedDay} / {selectedMonth.slice(0, -2)} / {selectedYear}
                    </div>

                    {three2winpro.length > 0 && three2winpro[0].time !== '' ? (
                        three2winpro.map((entry, idx) => (
                            <div key={idx} className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                                    <div className={`w-full sm:w-1/3 p-2 text-center rounded-lg font-bold text-white
                                        ${entry.status === 'Won' ? 'bg-green-600' :
                                        entry.status === 'Lost' ? 'bg-red-600' :
                                        'bg-blue-600'}`}
                                    >
                                        {entry.status}
                                    </div>
                                    <div className="w-full sm:w-2/3 p-2 text-center rounded-lg font-bold bg-purple-100 text-purple-800">
                                        ⏱️ {`${entry.time.substring(0, 2)}:${entry.time.substring(2, 4)}`}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3">
                                        <span className="text-gray-700">Principal / Starting Capital:</span>
                                        <span className="font-bold text-gray-900">{new Intl.NumberFormat().format(8000)}</span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3">
                                        <span className="text-gray-700">Opening Balance:</span>
                                        <span className="font-bold text-gray-900">{new Intl.NumberFormat().format(parseFloat(entry.Sbal))}</span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3">
                                        <span className="text-gray-700">Stake:</span>
                                        <span className="font-bold text-gray-900">{new Intl.NumberFormat().format(parseFloat(entry.stake))}</span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3">
                                        <span className="text-gray-700">Odd:</span>
                                        <span className="font-bold text-gray-900">{entry.odd}</span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3">
                                        <span className="text-gray-700">Expected Balance:</span>
                                        <span className="font-bold text-gray-900">{new Intl.NumberFormat().format(parseFloat(entry.Ebal))}</span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3">
                                        <span className="text-gray-700">Closing Balance:</span>
                                        <span className="font-bold text-gray-900">
                                            {entry.status === 'Pending' ? 'N/A' : (
                                                entry.status === 'Won' ?
                                                    new Intl.NumberFormat().format(parseFloat(entry.Sbal) + (parseFloat(entry.stake) * parseFloat(entry.odd))) :
                                                    new Intl.NumberFormat().format(parseFloat(entry.Sbal))
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3 col-span-full">
                                        <span className="text-gray-700">Current ROI:</span>
                                        <span className="font-bold text-lg text-green-700">{(((parseFloat(entry.Sbal) / 8000) * 100) - 100).toFixed(2)} %</span>
                                    </div>
                                    <div className="flex justify-between bg-lime-50 rounded-lg p-3 col-span-full">
                                        <span className="text-gray-700">SportyBet Code:</span>
                                        <span className="font-bold text-lg text-green-700">{entry.code}</span>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-600 text-lg">
                            No betting data available for this date. Please select another date.
                        </div>
                    )}
                </div>
            )}

            {/* Guide Button */}
            {!showGuide && (
                <div className="fixed bottom-6 right-6 z-10">
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => setShowGuide(true)}
                    >
                        ℹ️ Guide
                    </button>
                </div>
            )}

            {/* Message Popup */}
            {isMessageOpen && (
                <div
                    className="popup-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
                    onClick={handleOverlayClick}
                >
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={handleCloseMessage}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Notification</h2>
                        <p className="text-gray-700 text-center">{message}</p>
                    </div>
                </div>
            )}

            {/* Guide Content */}
            {showGuide && (
                <div className="bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-40 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-3xl w-full my-8 relative">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
                            📚 Guide on How to Use This Platform
                        </h2>
                        <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6">
                            <p>
                                <strong>Introduction to Our Betting System:</strong> We initiate our betting system with a Principal amount (Starting Capital) of ₦8,000 and a minimum stake of ₦20. This foundational amount can be adjusted proportionally to achieve varying returns.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                                <h3 className="font-bold text-blue-700 mb-2">💡 Tips for Success:</h3>
                                <ul className="list-disc list-inside text-blue-800 space-y-1">
                                    <li>Start with a capital of ₦8,000.</li>
                                    <li>Once your earnings reach 90% of this initial capital, you have the option to withdraw ₦3,200, leaving you with a balance of ₦4,000.</li>
                                    <li>Continue playing with this ₦4,000 balance until it reaches ₦8,000, at which point you should double your stake on the site.</li>
                                    <li>If your balance further increases to ₦12,000, you can triple your stake, and so on.</li>
                                    <li>You are free to manage your withdrawals as you see fit.</li>
                                    <li>Access to this feature requires a subscription of ₦250 weekly or ₦800 monthly. A 7-day free trial applies.</li>
                                </ul>
                            </div>
                            <p>
                                <strong>Key Terms and Definitions:</strong>
                                <ul className="list-disc list-inside space-y-2 mt-2">
                                    <li><strong>Opening Balance:</strong> The account balance at the start of the time indicated.</li>
                                    <li><strong>Stake:</strong> The amount allocated for staking on a particular time.</li>
                                    <li><strong>Odd:</strong> The total odd for the said time, reflected accurately from the betting platform at the time of update.</li>
                                    <li><strong>Expected Balance:</strong> The anticipated amount if the prediction results in a win.</li>
                                    <li><strong>Closing Balance:</strong> The account balance after event status update.</li>
                                    <li><strong>Current ROI:</strong> The percentage return on investment (ROI) from the principal amount to current.</li>
                                </ul>
                            </p>
                            <p>
                                <strong>Match Structure and Odds:</strong> A schedule comprises 2 matches, with a minimum total odd of 3. Each match involves:
                                <ul className="list-disc list-inside space-y-2 mt-2">
                                    <li><strong>Home Team and Away Team:</strong> Competing teams.</li>
                                    <li><strong>Selection:</strong> Our predicted outcome for the match.</li>
                                    <li><strong>Odd:</strong> The confirmed odd from the betting platform.</li>
                                </ul>
                            </p>
                            <p>
                                <strong>Recommendations for Getting Started:</strong> For optimal results, we advise commencing with a modest investment:
                                <ul className="list-disc list-inside space-y-2 mt-2">
                                    <li>₦4,000 with a ₦10 minimum stake</li>
                                    <li>₦8,000 with a ₦20 minimum stake</li>
                                    <li>₦40,000 with a ₦100 minimum stake</li>
                                    <li>₦400,000 with a ₦1,000 minimum stake</li>
                                </ul>
                            </p>
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                <h3 className="font-bold text-red-700 mb-2">⚠️ Performance Expectations and Risk Management:</h3>
                                <p className="text-red-800">
                                    Our strategy aims to deliver a minimum monthly percentage return of 60%. However, please note that this comes with a <strong>90% risk ratio</strong>, meaning that losses can be substantial. To mitigate this risk, we strongly advise starting with an amount you can comfortably afford to lose.
                                </p>
                            </div>
                            <p className="text-center text-gray-600">
                                For more information, reach out to us via Email at <a href="mailto:info@trybet.com.ng" className="text-green-500 hover:underline">info@trybet.com.ng</a>.
                            </p>
                        </div>
                        <button
                            className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={() => setShowGuide(false)}
                        >
                            Close Guide
                        </button>
                    </div>
                </div>
            )}

            {/* Calendar Popup */}
            {isCalendarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center p-4 z-30 overflow-y-auto"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).classList.contains('fixed')) {
                            setIsCalendarOpen(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mt-20 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setIsCalendarOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="flex-1 mr-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 font-semibold"
                                >
                                    {monthL.map((month, index) => (
                                        <option key={index} value={month}>
                                            {month.slice(0, -2)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="flex-1 ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 font-semibold"
                                >
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-sm font-medium text-gray-600 mb-2">
                                {weekL.map((item, index) => (
                                    <div key={index} className={`text-center py-1 ${item === 'Sun' ? 'text-red-500' : ''}`}>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {calendar.map((week, index) => (
                                    <div key={index} className="contents">
                                        {week.map((day, idx) => (
                                            <button
                                                key={idx}
                                                className={`text-center py-2 rounded-md transition-colors duration-200
                                                    ${day === '' ? 'cursor-default bg-gray-100' : 'cursor-pointer hover:bg-blue-100'}
                                                    ${selectedDay === day.toString() && (day.toString() + selectedMonth + selectedYear) === todayFormatted
                                                        ? 'bg-green-200 text-green-800 font-bold'
                                                        : 'text-gray-800'
                                                    }`}
                                                onClick={() => {
                                                    if (day !== '') {
                                                        fetchThree2WinProData(day.toString(), selectedMonth, selectedYear);
                                                    }
                                                }}
                                                disabled={day === ''}
                                            >
                                                {day === '' ? '' : day}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

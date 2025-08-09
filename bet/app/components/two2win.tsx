"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { StoreState } from '../tools/s_interface';
import Cookies from 'js-cookie';
import { isDateInPast } from '../tools/dateitems'; // Helper for date checking
import { monthL, weekL, getCalender } from '../tools/lists_dict'; // Calendar helpers

// Define a type for the game structure to ensure type safety
interface Two2WinGame {
  hometeam: string;
  awayteam: string;
  selection: string;
  odd: string;
}

// Define a type for the main Two2Win data
interface Two2WinData {
  date: string;
  Sbal: string;
  Tstake: string;
  Todd: string;
  Ebal: string;
  status: 'Won' | 'Lost' | 'Pending' | '';
  games: Two2WinGame[];
}

// Initial state for the Two2Win data
const initialTwo2WinState: Two2WinData = {
  date: '-----------',
  Sbal: '0',
  Tstake: '0',
  Todd: '0',
  Ebal: '0',
  status: '',
  games: [], // Initialize as an empty array
};

// --- Popup Component ---
interface PopupProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

const Popup = ({ message, onClose, isOpen }: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform scale-95 animate-pop-in relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
          onClick={onClose}
          aria-label="Close message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800 text-center mt-4">{message}</h2>
      </div>
    </div>
  );
};

// --- Calendar Component ---
interface CalendarProps {
  selectedDay: string;
  selectedMonth: string;
  selectedYear: string;
  todayString: string;
  calendarData: (string | number)[][];
  onDaySelect: (day: string, month: string, year: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onClose: () => void;
}

const CalendarModal = ({
  selectedDay, selectedMonth, selectedYear, todayString, calendarData,
  onDaySelect, onMonthChange, onYearChange, onClose
}: CalendarProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform scale-95 animate-pop-in overflow-y-auto max-h-[80vh] relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Close calendar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Select Date</h3>

        <div className="flex justify-around mb-4">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-gray-700 font-semibold"
            aria-label="Select month"
          >
            {monthL.map((month, index) => (
              <option key={index} value={month}>
                {month.slice(0, -2)}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-gray-700 font-semibold"
            aria-label="Select year"
          >
            {[2024, 2025, 2026, 2027].map((year) => ( // Example range, adjust as needed
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm font-semibold text-center mb-2">
          {weekL.map((dayName, index) => (
            <div key={index} className={`${dayName === 'Sun' ? 'text-red-500' : 'text-gray-600'}`}>
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="contents">
              {week.map((day, dayIndex) => (
                <button
                  key={`${weekIndex}-${dayIndex}`}
                  className={`p-2 rounded-md transition-colors duration-200 text-gray-800
                    ${day === '' ? 'cursor-not-allowed text-gray-400' : 'hover:bg-green-100 cursor-pointer'}
                    ${day !== '' && `${day.toString()}${selectedMonth}${selectedYear}` === todayString ? 'bg-green-300 font-bold' : ''}
                    ${day !== '' && selectedDay === day.toString() && `${day.toString()}${selectedMonth}${selectedYear}` !== todayString ? 'bg-green-500 text-white font-bold' : ''}
                  `}
                  onClick={() => day !== '' && onDaySelect(day.toString(), selectedMonth, selectedYear)}
                  disabled={day === ''}
                >
                  {day}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Guide Modal Component ---
interface GuideModalProps {
  onClose: () => void;
}

const GuideModal = ({ onClose }: GuideModalProps) => {
  return (
    <div className="bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl transform scale-95 animate-pop-in overflow-y-auto max-h-[90vh] relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Close guide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Understanding Two2Win</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed text-base md:text-lg">
          <p>
            Welcome to the Two2Win daily betting system! We start with a **Principal amount (Starting Capital) of ₦10,000** and a minimum daily stake of ₦100. This foundational amount can be adjusted proportionally to achieve varying returns.
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Tips for Success:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Start with a capital of ₦10,000.</li>
            <li>When your earnings reach 80% of your initial capital, you can withdraw ₦10,000, leaving ₦8,000 to continue.</li>
            <li>If your balance grows to ₦16,000, consider doubling your daily stake. At ₦24,000, you can triple it, and so on.</li>
            <li>You have full control over your withdrawals.</li>
            <li>Access to this feature requires a subscription: ₦250 weekly or ₦800 monthly. A 7days free trial applies</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Key Terms & Definitions:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Opening Balance:</strong> Your account balance at the start of the day.</li>
            <li><strong>{`Today's`} Stake:</strong> The amount allocated for betting on a particular day.</li>
            <li><strong>{`Today's`} Odd:</strong> The total odds for the {`day's`} selected games, confirmed from the betting platform.</li>
            <li><strong>Expected Balance:</strong> The anticipated account balance if the daily prediction wins.</li>
            <li><strong>Closing Balance:</strong> Your account balance after all games for the day have concluded.</li>
            <li><strong>Current ROI:</strong> The percentage return on investment (ROI) from your initial principal amount to date.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Match Structure and Odds:</h3>
          <p>
            A typical {`day's`} schedule includes 1 to 3 matches, with a **minimum total odd of 2.00**. Each match entry provides:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Home Team & Away Team:</strong> The two competing teams.</li>
            <li><strong>Selection:</strong> Our carefully predicted outcome for the match.</li>
            <li><strong>Odd:</strong> The confirmed odd for our selection from the betting platform.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Recommended Starting Investments:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>₦1,000 with a ₦10 minimum daily stake</li>
            <li>₦5,000 with a ₦50 minimum daily stake</li>
            <li>₦10,000 with a ₦100 minimum daily stake</li>
            <li>₦100,000 with a ₦1,000 minimum daily stake</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Performance Expectations & Risk Management:</h3>
          <p>
            Our strategy targets a **minimum monthly ROI of 40%**. However, {`it's`} crucial to understand that this comes with an **80% risk ratio**, meaning substantial losses are possible. We strongly advise starting with an amount you are genuinely comfortable losing. For example, with a ₦10,000 capital, one could recover a minimum of 20% if the strategy faces setbacks.
          </p>
          <p className="mt-4">
            For more information, reach out to us via TikTok: <a href="https://www.tiktok.com/@chekwasy_trybet" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">@chekwasy_trybet</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Two2Win Component ---
export default function Two2Win() {
  const storeItems: StoreState = useSelector((state) => state) as StoreState;

  const [two2winData, setTwo2winData] = useState<Two2WinData>(initialTwo2WinState); // Renamed for clarity
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Renamed for clarity
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // E.g., 'Jan11'
  const [selectedYear, setSelectedYear] = useState('');
  const [todayFormatted, setTodayFormatted] = useState(''); // Format: DDMMYYYY
  const [isGuideOpen, setIsGuideOpen] = useState(false); // Renamed showGuide

  // State for general popup messages
  const [message, setMessage] = useState('');
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const [calendarGrid, setCalendarGrid] = useState<(string | number)[][]>([]);

  // Memoized function to update calendar grid
  const updateCalendarGrid = useCallback((year: number, monthNum: number) => {
    setCalendarGrid(getCalender(year, monthNum));
  }, []);

  // Handler for closing the general message popup
  const handleCloseMessage = useCallback(() => {
    setIsMessageOpen(false);
    setMessage('');
  }, []);

  // Function to fetch Two2Win data for a specific date
  const fetchTwo2WinData = useCallback(async (day: string, month: string, year: string) => {
    if (!day || !month || !year) return;

    const formattedDate = `${day.padStart(2, '0')}${month}${year}`;
    try {
      const response = await axios.get(`/api/gettwo2win?date=${formattedDate}`, {
        headers: {
          tok: Cookies.get('trybet_tok') || '',
        },
      });
      if (response.data.game) {
        setTwo2winData(response.data.game);
        setSelectedDay(day.toString());
        setIsCalendarOpen(false);
      } else {
        setMessage('No game data found for the selected date.');
        setIsMessageOpen(true);
        // Optionally reset to a default state or previous data if no game
        setTwo2winData(initialTwo2WinState);
        setIsCalendarOpen(false);
      }
    } catch (error) {
      console.error("Error fetching Two2Win data:", error);
      setMessage('Failed to load game for this date. Please try again.');
      setIsMessageOpen(true);
      setTwo2winData(initialTwo2WinState);
    }
  }, []);

  // Effect to set initial date and fetch today's data on component mount
  useEffect(() => {
    const fetchInitialDate = async () => {
      try {
        const response = await axios.get('/api/getdate', {
          headers: {
            tok: Cookies.get('trybet_tok') || '',
          },
        });
        const ddd = response.data.day.toString();
        const mmm = monthL[response.data.month]; // e.g., 'Jan11'
        const yyy = response.data.year.toString();

        setSelectedDay(ddd);
        setSelectedMonth(mmm);
        setSelectedYear(yyy);
        setTodayFormatted(`${ddd}${mmm.slice(-2)}${yyy}`);
        updateCalendarGrid(response.data.year, response.data.month + 1); // month + 1 for 1-indexed
        fetchTwo2WinData(ddd.toString(), mmm, yyy);
      } catch (error) {
        console.error(`Error fetching initial date: ${error}`);
        setMessage('Could not load current date or game data. Please check your connection.');
        setIsMessageOpen(true);
      }
    };
    fetchInitialDate();
  }, [fetchTwo2WinData, updateCalendarGrid]); // Dependencies for useEffect

  // Effect to re-render calendar when selected month or year changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const monthNum = parseInt(selectedMonth.slice(-2));
      updateCalendarGrid(parseInt(selectedYear), monthNum);
    }
  }, [selectedYear, selectedMonth, updateCalendarGrid]);

  // Helper to get status color
  const getStatusColor = (status: Two2WinData['status']) => {
    switch (status) {
      case 'Won':
        return 'bg-green-600 text-white';
      case 'Lost':
        return 'bg-red-600 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-gray-900';
      default:
        return 'bg-gray-400 text-white'; // Default for empty/initial state
    }
  };

  // Helper to format date string from API (e.g., '01Jan2025')
  const formatApiDate = (dateStr: string) => {
    if (!dateStr || dateStr.length < 11) return 'N/A'; // e.g. "01 Jan 2025"
    return `${dateStr.substring(0, 2)} ${dateStr.substring(2, 5)} ${dateStr.substring(7, 11)}`;
  };

  // Check if subscription is active
  const isSubscriptionActive = storeItems.mainSlice?.me?.sub
    ? !isDateInPast(storeItems.mainSlice.me.sub.slice(-8))
    : false;

  const showTwo2WinContent = !isGuideOpen && two2winData.status !== '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 mt-16">
      {/* Subscription Call to Action */}
      {!isGuideOpen && !isSubscriptionActive && (
        <div className="w-full max-w-md mb-6">
          <Link href="/sub" className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center shadow-md transition-colors duration-300">
            Activate Your Subscription Today!
          </Link>
        </div>
      )}

      {/* Date Selector */}
      {!isGuideOpen && (
        <div className="w-full max-w-md mb-6">
          <button
            className="flex items-center justify-center w-full p-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300"
            onClick={() => setIsCalendarOpen(true)}
            aria-label="Select date for 2 to Win game"
          >
            🗓️ Date: {selectedDay || 'DD'} / {selectedMonth.slice(0, 3) || 'MMM'} / {selectedYear || 'YYYY'}
          </button>
        </div>
      )}

      {/* Main Two2Win Content Display */}
      {showTwo2WinContent && (
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl animate-fade-in mb-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div className={`text-2xl font-extrabold px-4 py-2 rounded-full ${getStatusColor(two2winData.status)}`}>
              {two2winData.status || 'N/A'}
            </div>
            <div className="text-gray-600 text-base font-semibold">
              Date: {formatApiDate(two2winData.date)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600 text-sm">Principal / Starting Capital</span>
              <span className="text-lg font-bold text-gray-800">₦{new Intl.NumberFormat().format(10000)}</span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600 text-sm">Opening Balance</span>
              <span className="text-lg font-bold text-gray-800">₦{new Intl.NumberFormat().format(parseFloat(two2winData.Sbal))}</span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600 text-sm">{`Today's`} Stake</span>
              <span className="text-lg font-bold text-green-700">₦{new Intl.NumberFormat().format(parseFloat(two2winData.Tstake))}</span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600 text-sm">{`Today's`} Total Odd</span>
              <span className="text-lg font-bold text-purple-700">{two2winData.Todd}</span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600 text-sm">Expected Closing Balance</span>
              <span className="text-lg font-bold text-blue-700">₦{new Intl.NumberFormat().format(parseFloat(two2winData.Ebal))}</span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg col-span-1 sm:col-span-2">
              <span className="text-gray-600 text-sm">Actual Closing Balance</span>
              <span className="text-xl font-bold text-right">
                {two2winData.status === 'Pending' ? (
                  <span className="text-gray-500">Pending</span>
                ) : (
                  <span className={two2winData.status === 'Won' ? 'text-green-700' : 'text-red-700'}>
                    ₦{new Intl.NumberFormat().format(
                      two2winData.status === 'Won'
                        ? parseFloat(two2winData.Sbal) + (parseFloat(two2winData.Tstake) * parseFloat(two2winData.Todd))
                        : parseFloat(two2winData.Sbal)
                    )}
                  </span>
                )}
              </span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg col-span-1 sm:col-span-2">
              <span className="text-gray-600 text-sm">Current ROI (from Principal)</span>
              <span className="text-xl font-bold text-right text-indigo-700">
                {(((parseFloat(two2winData.Sbal) / 10000) * 100) - 100).toFixed(2)} %
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Daily Game Details:</h3>
          {two2winData.games.length > 0 ? (
            <div className="space-y-4">
              {two2winData.games.map((game, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-lg font-semibold text-gray-900 mb-2">{game.hometeam} vs {game.awayteam}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="font-medium">Our Selection:</div>
                    <div className="text-right font-semibold text-green-700">{game.selection}</div>
                    <div className="font-medium">Odd:</div>
                    <div className="text-right font-semibold">{game.odd}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-600">No specific game details available for this date.</div>
          )}
        </div>
      )}

      {/* "No Data" Placeholder */}
      {!isGuideOpen && two2winData.status === '' && (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
          <p className="text-xl text-gray-600 font-semibold mb-2">No game data available for the selected date.</p>
          <p className="text-gray-500">Please select another date or check back later.</p>
        </div>
      )}

      {/* Guide Button (Fixed bottom right) */}
      {!isGuideOpen && (
        <button
          className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 z-30"
          onClick={() => setIsGuideOpen(true)}
        >
          View Guide
        </button>
      )}

      {/* Modals */}
      {isCalendarOpen && (
        <CalendarModal
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          todayString={todayFormatted}
          calendarData={calendarGrid}
          onDaySelect={fetchTwo2WinData}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}

      {isGuideOpen && (
        <GuideModal onClose={() => setIsGuideOpen(false)} />
      )}

      {isMessageOpen && (
        <Popup message={message} onClose={handleCloseMessage} isOpen={isMessageOpen} />
      )}
    </div>
  );
}
"use client"

import { useState, useEffect } from 'react'; // Import useEffect
import axios from 'axios';
import Cookies from 'js-cookie';


export default function Sub() {
  const [selectedPlan, setSelectedPlan] = useState(''); // 'weekly' or 'monthly'
  const [PaystackPop, setPaystackPop] = useState(null); // State to hold the PaystackPop instance

  // Dynamically import PaystackPop only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window object exists (client-side)
      import('@paystack/inline-js')
        .then((module) => {
          setPaystackPop(new module.default()); // Store the PaystackPop instance in state
        })
        .catch((error) => {
          console.error("Failed to load PaystackPop:", error);
        });
    }
  }, []); // Empty dependency array means this runs once on component mount (client-side)


  const handleProceed = () => {
    if (selectedPlan) {
      alert(`Proceeding with ${selectedPlan} plan!`);

      axios.post('/api/postsavedgames', {}, {
        headers: {
          'tok': Cookies.get('trybet_tok'),
          'Content-Type': 'application/json',
          // Pass 'plan' as a string directly, no need for JSON.stringify here for a simple string
          'plan': selectedPlan,
        },
      })
      .then(async (response) => {
        if (PaystackPop) { // Ensure PaystackPop is loaded before using it
          PaystackPop.resumeTransaction(response.data.access_code);
        } else {
          console.error("PaystackPop is not loaded yet.");
          alert("Payment gateway not ready. Please try again.");
        }
      })
      .catch(error => {
        console.error("Error initiating transaction:", error.message); // Use console.error for errors
        alert("An error occurred. Please try again.");
      });

    } else {
      alert('Please select a subscription plan first.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-300 to-gray-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Choose Your Plan
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Weekly Option Card */}
          <div
            className={`flex-1 p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${selectedPlan === 'weekly' ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-gray-300 hover:border-indigo-400'}`
            }
            onClick={() => setSelectedPlan('weekly')}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Weekly</h3>
            <p className="text-4xl font-extrabold text-indigo-700 mb-2">
              N250<span className="text-lg font-medium text-gray-500">/week</span>
            </p>
            <p className="text-gray-600">Perfect for short-term access.</p>
          </div>

          {/* Monthly Option Card */}
          <div
            className={`flex-1 p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${selectedPlan === 'monthly' ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-gray-300 hover:border-indigo-400'}`
            }
            onClick={() => setSelectedPlan('monthly')}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Monthly</h3>
            <p className="text-4xl font-extrabold text-indigo-700 mb-2">
              N800<span className="text-lg font-medium text-gray-500">/month</span>
            </p>
            <p className="text-gray-600">Best value for continuous access.</p>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          disabled={!selectedPlan || !PaystackPop} // Disable if PaystackPop isn't loaded yet
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-300 ease-in-out
            ${selectedPlan && PaystackPop
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'}`
          }
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
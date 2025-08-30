import 'dotenv/config';
import Queue from 'bull/lib/queue.js';
import nodemailer from 'nodemailer';


//pass: 'ucblaybosshvkvwt'
//dobhplzccqrsxfco

const isDateInPast = (dateString) => {
  const dateParts = dateString.match(/(\d{2})(\d{2})(\d{4})/);
  if (!dateParts) return false;

  const day = parseInt(dateParts[1]);
  const month = parseInt(dateParts[2]) - 1; // Months are 0-based
  const year = parseInt(dateParts[3]);

  const inputDate = new Date(year, month, day);
  const currentDate = new Date();

  return inputDate.getTime() < currentDate.getTime();
};


const secretKey = process.env.MSK || '';

const transporter = nodemailer.createTransport({
    host: 'workplace.truehost.cloud',
    port: 587, // or 465
    secure: false, // true for 465, false for 587
    auth: {
        user: 'info@trybet.com.ng',
        pass: secretKey,
    },
    // logger: true,
    // debug: true,
    // tls: {
    // // set to false only if you have certificate issues; prefer leaving it default
    // rejectUnauthorized: true
    // }
});



//creating new queue with same queue name as in route file
const tokenQueue = new Queue('Send Trybet Token');


//job to send user token for password reset
tokenQueue.process(async (job, done) => {
	const email = job.data.email;
	const token = job.data.token;

	if (!email || !token) {
		throw new Error("Missing email or token");
	}
	console.log('Processing', email);
    if (secretKey === '') {
		throw new Error("Missing key");
	}

	//Data of email to be sent
	let mailOptions = {
		from: 'info@trybet.com.ng',
		to: email,
		subject: 'One Time Token (OTP) - TryBet',
		html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your TryBet One-Time Token (OTP)</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid #e0e0e0;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #1a73e8; /* A professional blue, or your brand's primary color */
            font-size: 28px;
            margin: 0;
        }
        .content {
            text-align: center;
            margin-bottom: 20px;
        }
        .content h2 {
            color: #333333;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .otp-code {
            display: inline-block;
            background-color: #e6f3ff; /* Light blue background for OTP */
            color: #1a73e8;
            font-size: 32px;
            font-weight: bold;
            padding: 15px 25px;
            border-radius: 8px;
            letter-spacing: 3px;
            margin: 25px 0;
            border: 1px dashed #a3d4ff;
        }
        .instructions {
            text-align: left;
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #1a73e8;
            border-radius: 4px;
        }
        .instructions p {
            margin: 5px 0;
            font-size: 15px;
            color: #555555;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            font-size: 12px;
            color: #888888;
        }
        .footer p {
            margin: 5px 0;
        }
        .button {
            display: inline-block;
            background-color: #1a73e8;
            color: #ffffff !important; /* !important to override mail client styles */
            padding: 12px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }
        .small-text {
            font-size: 0.85em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TryBet</h1>
            <p class="small-text">Bet with confidence</p>
        </div>
        <div class="content">
            <h2>Your One-Time Password (OTP)</h2>
            <p>Please use the following code to complete your action:</p>
            <div class="otp-code">${token.token}</div>
            <p>For your security, this token is essential for verifying your request.</p>

            <div class="instructions">
                <p><strong>Important Information:</strong></p>
                <ul>
                    <li>This token will expire in **10 minutes**.</li>
                    <li>For security, this token will expire in **5 minutes** after your second attempt.</li>
                    <li>This token will become invalid after **4 incorrect attempts**.</li>
                    <li>Please do not share this code with anyone. TryBet will never ask for this code over the phone or email.</li>
                </ul>
            </div>

            <p style="margin-top: 25px;">If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TryBet. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>`
	}
	let mailOptions2 = {
		                from: 'info@trybet.com.ng',
				to: 'richardchekwas@gmail.com',
		                subject: 'Problem Email',
		                html: `<div>
		                <h2>Problem email ${email},</h2>
		                <h2>TryBet</h2>
		                </div>`
		        }
	transporter.sendMail(mailOptions, (err, info) => {
		if(err) {
			console.log(err);
			transporter.sendMail(mailOptions2, (er, info2) => {
				if(er) {
					console.log(err);} else {
					console.log(info2.response);
					}
			});
		} else {
			console.log(info.response);
 		}
	});
	done();
});


//creating new queue with same queue name as in route file
const notifyQueue = new Queue('Notify');

//job to send users notifications
notifyQueue.process(async (job, done) => {
	const option = job.data.option;
	const time = job.data.time;
    const Sbal = job.data.Sbal;
    const stake = job.data.stake;
    const odd = job.data.odd;
    const Ebal = job.data.Ebal;
    const status = job.data.status;
    const code = job.data.code;
    const usr = job.data.usr;

	if (!option || !time || !Sbal  || !stake || !odd  || !Ebal  || !status || !code || !usr) {
		throw new Error("Missing information");
	}
    if (secretKey === '') {
		throw new Error("Missing key");
	}

    const len = usr.length;
    for (let i = 0; i < len; i++) {
        const email = usr[i].email;
        const subs = usr[i].sub;
        const chk = isDateInPast(subs.slice(-8));
        
        if (!chk && subs.slice(0, 4) !== 'free') {
            //Data of email to be sent
            console.log(`notify email: ${email}`);
            let mailOptions = {
                from: 'info@trybet.com.ng',
                to: email,
                subject: `Event Update for ${option} - TryBet`,
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bet Details Slip</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #e2e8f0; /* Lighter background for better contrast */
            color: #1a202c;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            max-width: 28rem;
        }
        @media (min-width: 640px) {
            .container {
                max-width: 36rem;
            }
        }
    </style>
</head>
<body class="bg-slate-100 flex items-center justify-center p-4 min-h-screen">

    <!-- Bet Details Container -->
    <div class="container bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        <!-- Header Section with Gradient -->
        <div class="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-8 sm:p-10 text-center rounded-t-3xl">
            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">Trybet</h1>
            <p class="mt-2 text-sm opacity-80">Confirmation and details of your recent bet.</p>
        </div>

        <!-- Content Section -->
        <div class="p-6 sm:p-8">
            <div id="status-message" class="text-center text-xl font-bold mb-6">Your bet is **${status}**.</div>
            
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner space-y-4">
                
                <!-- Detail Item: Option -->
                <div class="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 9.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414l2-2a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-600 flex-1">Option:</span>
                    <span id="option" class="font-bold text-gray-800 text-base">${option}</span>
                </div>

                <!-- Detail Item: Time -->
                <div class="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-600 flex-1">Time:</span>
                    <span id="time" class="font-bold text-gray-800 text-base">${time}</span>
                </div>

                <!-- Detail Item: Starting Balance -->
                <div class="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4z"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-600 flex-1">Starting Balance:</span>
                    <span id="Sbal" class="font-bold text-gray-800 text-base">₦${Sbal}</span>
                </div>

                <!-- Detail Item: Stake -->
                <div class="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-600 flex-1">Stake:</span>
                    <span id="stake" class="font-bold text-gray-800 text-base">₦${stake}</span>
                </div>

                <!-- Detail Item: Odd -->
                <div class="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 16a6 6 0 01-12 0h12zM17 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-600 flex-1">Odd:</span>
                    <span id="odd" class="font-bold text-gray-800 text-base">${odd}</span>
                </div>

                <!-- Detail Item: Expected Balance -->
                <div class="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 100 2h4a1 1 0 100-2H8z"></path>
                    </svg>
                    <span class="text-sm font-medium text-gray-600 flex-1">Expected Balance:</span>
                    <span id="Ebal" class="font-bold text-gray-800 text-base">₦${Ebal}</span>
                </div>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="bg-slate-200 p-6 sm:p-8 text-center text-xs text-slate-600 rounded-b-3xl">
            <p>Thank you for choosing Trybet. Good luck with your bets!</p>
            <div class="mt-4 flex justify-center space-x-4">
                <a href="#" class="text-emerald-700 hover:underline font-medium">trybet.com.ng</a>
                <span class="text-slate-400">|</span>
                <a href="mailto:info@trybet.com.ng" class="text-emerald-700 hover:underline font-medium">info@trybet.com.ng</a>
            </div>
            <p class="mt-2 text-slate-500">&copy; 2024 TryBet. All rights reserved.</p>
            <p class="mt-1 text-slate-500">This is an automated message.</p>
        </div>
    </div>
</body>
</html>
`

                }
            let mailOptions2 = {
                from: 'info@trybet.com.ng',
                to: 'richardchekwas@gmail.com',
                subject: 'Problem Email',
                html: `<div>
                    <h2>Problem email ${email},</h2>
                    <h2>TryBet</h2>
                    </div>`
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if(err) {
                    console.log(err);
                    transporter.sendMail(mailOptions2, (er, info2) => {
                        if(er) {
                            console.log(err);} else {
                            console.log(info2.response);
                            }
                    });
                } else {
                    console.log(info.response);
                }
            });
        }
    }
	    done();

});

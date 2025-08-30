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
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                            body {
                                font-family: 'Inter', sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #f0f2f5;
                            }
                            .container {
                                max-width: 600px;
                                margin: 30px auto;
                                background-color: #ffffff;
                                border-radius: 16px;
                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                                overflow: hidden;
                            }
                            .header {
                                background-color: #1b5e20; /* Dark green for Trybet */
                                color: #ffffff;
                                padding: 30px 20px;
                                text-align: center;
                            }
                            .header h1 {
                                font-size: 28px;
                                font-weight: 700;
                                margin: 0;
                            }
                            .header p {
                                font-size: 14px;
                                margin: 5px 0 0;
                                color: rgba(255, 255, 255, 0.8);
                            }
                            .content {
                                padding: 20px 30px;
                            }
                            .message {
                                text-align: center;
                                font-size: 18px;
                                font-weight: 600;
                                margin-bottom: 25px;
                                line-height: 1.5;
                            }
                            .message-success { color: #2e7d32; }
                            .message-fail { color: #d32f2f; }
                            .message-info { color: #1976d2; }
                            .bet-details {
                                display: flex;
                                flex-direction: column;
                                gap: 12px;
                                background-color: #f7f9fc;
                                padding: 20px;
                                border-radius: 12px;
                                border: 1px solid #e0e6ed;
                            }
                            .detail-item {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                border-bottom: 1px dashed #d1d5db;
                                padding-bottom: 12px;
                            }
                            .detail-item:last-child {
                                border-bottom: none;
                                padding-bottom: 0;
                            }
                            .detail-label {
                                font-weight: 500;
                                color: #4a5568;
                                font-size: 14px;
                            }
                            .detail-value {
                                font-weight: 600;
                                color: #2d3748;
                                font-size: 14px;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #e0e6ed;
                                font-size: 12px;
                                color: #718096;
                            }
                            .footer-links {
                                margin-top: 10px;
                            }
                            .footer-links a {
                                color: #1b5e20;
                                text-decoration: none;
                                font-weight: 600;
                            }
                            .status-badge {
                                font-weight: 700;
                                padding: 5px 12px;
                                border-radius: 50px;
                                text-transform: uppercase;
                                font-size: 10px;
                                letter-spacing: 0.5px;
                            }
                            .status-badge.pending { background-color: #fff3e0; color: #ff9800; }
                            .status-badge.won { background-color: #e8f5e9; color: #4caf50; }
                            .status-badge.lost { background-color: #ffebee; color: #f44336; }
                            .status-badge.cashed-out { background-color: #e3f2fd; color: #2196f3; }
                        </style>
                    </head>
                    <body>

                        <div class="container">
                            <div class="header">
                                <h1>Trybet</h1>
                                <p>Confirmation and details of your recent bet.</p>
                            </div>
                            
                            <div class="content">
                                <!-- Logic for status-based message -->
                                <div class="message" id="status-message"></div>

                                <div class="bet-details">
                                    <div class="detail-item">
                                        <span class="detail-label">Option</span>
                                        <span class="detail-value" id="option">${option}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Time</span>
                                        <span class="detail-value" id="time">${time}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Starting Balance</span>
                                        <span class="detail-value" id="Sbal">₦${Sbal}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Stake</span>
                                        <span class="detail-value" id="stake">₦${stake}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Odd</span>
                                        <span class="detail-value" id="odd">${odd}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Expected Balance</span>
                                        <span class="detail-value" id="Ebal">₦${Ebal}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Status</span>
                                        <span class="detail-value">
                                            <span class="status-badge" id="status-badge">${status}</span>
                                        </span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">SportyBet Code</span>
                                        <span class="detail-value" id="code">${code}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="footer">
                                <p>Thank you for choosing Trybet. Good luck with your bets!</p>
                                <div class="footer-links">
                                    <a href="https://trybet.com.ng">trybet.com.ng</a> | <a href="mailto:info@trybet.com.ng">info@trybet.com.ng</a>
                                </div>
                                <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} TryBet. All rights reserved.</p>
                                <p>This is an automated email, please do not reply.</p>
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

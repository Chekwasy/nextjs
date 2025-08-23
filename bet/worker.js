import 'dotenv/config';
import Queue from 'bull/lib/queue.js';
import nodemailer from 'nodemailer';

//pass: 'ucblaybosshvkvwt'
//dobhplzccqrsxfco


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


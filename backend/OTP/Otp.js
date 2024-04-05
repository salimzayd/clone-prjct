import twilio from 'twilio';
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.Account_SID;
const authToken = process.env.Auth_Token;
const client = twilio(accountSid, authToken);

export const sendOTP = async (req, res) => {
    const { phonenumber } = req.body;
    console.log(req.body);

    try {
        await client.verify.v2.services("VAca78c67608a333c094aa9a345698f78f")
            .verifications.create({
                to: "+91" + phonenumber,
                channel: "sms"
            });

        console.log("OTP sent to the registered mobile number");
        res.json({
            success: true,
            message: "OTP request sent successfully"
        });
    } catch (error) {
        console.error("Error sending OTP", error);
        res.status(500).json({
            success: false,
            message: "Error sending OTP",
            error: error.message
        });
    }
};

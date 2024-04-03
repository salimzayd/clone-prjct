import twilio from 'twilio';

const accountSid = "AC1b9b53ad095e6c679af1128623dccf9c";
const authToken = "9a04b11aced20972774c49f494f842a5";
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

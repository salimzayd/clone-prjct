import twilio from 'twilio';
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.Account_SID;
const authToken = process.env.Auth_Token;
const client = twilio(accountSid, authToken);

export const sendOTP = async (req, res) => {
    const { phonenumber } = req.body;
    try {
        await client.verify.v2.services("VAac58cb858a70083ca23aa10fa28d308d") 
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


export const verifyOtp = async (req, res) =>{
    const {phonenumber, otp} = req.body
    console.log(req.body);
    try{
        const verificationCheck = await client.verify.v2.services("VAac58cb858a70083ca23aa10fa28d308d").verificationChecks.create({
            to:"+91" + phonenumber,
            code:otp
        });

        console.log(" otp verification result", verificationCheck.status);
        if(verificationCheck.status === "approved"){
            res.json({
                success:true,
                message:"otp verified successfully"
            })
        }else{
            res.status(400).json({
                success:false,
                message:"invalid otp "
            })
        }
    }catch(error){
        console.error("Error verifying otp",error);
        res.status(500).json({
            succes:false,
            message:"Error verifying otp",
            error:error.message
        })
    }
} 

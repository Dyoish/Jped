import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js';

//function ng signup
export const signup = async (req, res) => {
    const {email,password,name} = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required"); //eto lalabas pag walang nilagay sa mga yan
        }

        const userAlreadyExists = await User.findOne({email});
        console.log("userAlreadyExists", userAlreadyExists);
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"}); //eto lalabas pag may existing acc na
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() *900000).toString(); //for hash password
        
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000 //24 hours yong expiration

        });

        await user.save(); //masasave siya sa database

        //jwt (JSON Web Token)
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({success:false, message: error.message});

    }
    
};

//function ng verify email
export const verifyEmail = async (req, res) => {
    //dito magpapakita yong code sa email, ex. Code:1-2-3-4-5-6.
    const {code} = req.body;
    try {
        const user = await User.findOne( {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        }); //chinicheck lng if mag eexpire na yong token(code) or hindi pa.

        if(!user) {
            return res.status(400).json ({success: false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save(); //para ma save and ma update yong mga values

        await sendWelcomeEmail(user.email, user.name); //sesent lng ng welcome message

        res.status(200).json({
            success: true,
            message: "Email verified successfully", 
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    }   catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({ message: "Server Error" });

    }
};

//function ng login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials"}); //pag mali yong mga nilagay
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials"});
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date(); //yong date ng pag login ng user
        await user.save(); //masasave

        res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
		console.log("Error in login ", error); //pag error
		res.status(400).json({ success: false, message: error.message });
	}
};

//function ng logout
export const logout = async (req, res) => {
    res.clearCookie("token"); //iclclear niya yong cookie ng account pag nilogout
    res.status(200).json({ success: true, message: "Logged out successfully"});
};

//function ng forgot password 
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne ({ email });

        if(!user){
            return res.status(400).json({ success: false, message: "User not found"});
        }

        //gegenerate ng random token/code
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour mag rereset yong token)

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save(); //para ma save sa database

        // send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json ({ success: true, message: "Password reset link sent to your email" });

    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(400).json ({ success: false, message: error.message });
    }
};

//function ng reset password 
export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params; //tinawag yong "token" variable doon sa auth.route.js
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() }, //para malaman if hindi pa expired yong token
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" }); //pag mali or expired na yong token/code
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10); //icoconvert na naka hash na password

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save(); //masasave sa database

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });//message pag nag successful reset yong password
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

//function ng check Auth
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password"); //ifefetch niya yong user from database and isesent niya as a response
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


    




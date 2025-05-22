import Admin from '../models/admin.js';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/tokenUtils.js';
dotenv.config();


export const login = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        const admin = await Admin.findOne({ phoneNumber });

        if (!admin) {
            return res.status(404).json({ message: 'Not found!!!' });
        }

        // Check if sub-admin is blocked
        if (admin.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
        }

        if (admin.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        const tokenPayload = {
            id: admin._id,
            phoneNumber: admin.phoneNumber,
            role: admin.role
        };

        const token = generateToken(tokenPayload);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: tokenPayload
        });

    } catch (error) {
        console.error('Sub-admin login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const initializeAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ phoneNumber: '8888888888' });
        if (!existingAdmin) {
            const newAdmin = new Admin({
                phoneNumber: '8888888888',
                email:"admin@gmail.com",
                otp: '1234',
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin credentials initialized.');
        } else {
            console.log('Admin credentials already exist.');
        }
    } catch (error) {
        console.error('Error initializing admin credentials:', error);
    }
};
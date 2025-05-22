// const SubAdmin = require('../models/subAdmin');
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Admin from '../../models/admin.js';
import NavItem from '../../models/navItems.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

export const createSubAdmin = async (req, res) => {
    try {
        const { subadminName, email, phoneNumber, address, role, navItems } = req.body;

        if (!subadminName || !email || !phoneNumber || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if phone number already exists
        const existingSubAdmin = await Admin.findOne({ phoneNumber });
        if (existingSubAdmin) {
            return res.status(400).json({ message: 'Sub-admin with this phone number already exists' });
        }

        // Generate 4-digit OTP
        const otp = generateOtp();

        if (navItems && !Array.isArray(navItems)) {
            return res.status(400).json({ message: 'navItems must be an array of IDs' });
        }

        // Create new sub-admin
        const newSubAdmin = new Admin({
            subadminName,
            email,
            phoneNumber,
            otp,
            address,
            role,
            navItems
        });

        await newSubAdmin.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Sub-Admin Account Created',
            text: `Hello ${subadminName},\n\nYour sub-admin account has been created.\n\nPhone Number: ${phoneNumber}\nOTP: ${otp}\n\nPlease log in and change your OTP immediately.`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Sub-admin created and credentials sent to email' });

    } catch (error) {
        console.error('Error creating sub-admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSubAdmin = async (req, res) => {
    try {
        const { subadminName, email, phoneNumber, address, navItems } = req.body;
        const subAdminId = req.params.id;
        const userId = req.user.id;

        if (!subAdminId) {
            return res.status(400).json({ message: 'Sub-admin ID is required' });
        }

        const user = await Admin.findById(userId).populate('navItems.navItem');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hasPermission = user.navItems?.some(item =>
            item.navItem?.label === 'Sub-Admins' && item.permissions.includes('edit')
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const subAdmin = await Admin.findById(subAdminId);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }

        if (phoneNumber) {
            const existing = await Admin.findOne({
                phoneNumber,
                _id: { $ne: subAdminId },
            });

            if (existing) {
                return res.status(400).json({
                    message: 'Sub-admin with this phone number already exists',
                });
            }
        }

        // Update base fields
        if (subadminName) subAdmin.subadminName = subadminName;
        if (email) subAdmin.email = email;
        if (phoneNumber) subAdmin.phoneNumber = phoneNumber;
        if (address) subAdmin.address = address;

        // Update navItems if provided
        if (Array.isArray(navItems)) {
            subAdmin.navItems = navItems.map(item => ({
                navItem: item.navItem,
                permissions: item.permissions,
            }));
        }

        subAdmin.updatedAt = Date.now();
        await subAdmin.save();

        return res.status(200).json({
            message: 'Sub-admin updated successfully',
            subAdmin,
        });

    } catch (error) {
        console.error('Error updating sub-admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getSubAdminById = async (req, res) => {
    try {
        const subAdminId = req.params.id;

        if (!subAdminId) {
            return res.status(400).json({ message: 'Sub-admin ID is required' });
        }

        // Find sub-admin and populate navItems.navItem
        const subAdmin = await Admin.findById(subAdminId).populate('navItems.navItem');

        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }

        return res.status(200).json({
            message: 'Sub-admin retrieved successfully',
            subAdmin,
        });

    } catch (error) {
        console.error('Error retrieving sub-admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getAllSubAdmins = async (req, res) => {
    try {
        // Set default values for page and limit
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Build the filter: sub-admins created within the last 24 hours
        const filter = {
            role: 'sub-admin',
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        };

        // Fetch the sub-admins
        const subAdmins = await Admin.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count for pagination
        const totalCount = await Admin.countDocuments(filter);

        return res.status(200).json({
            message: 'Sub-admins retrieved successfully',
            subAdmins,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                perPage: limit
            }
        });
    } catch (error) {
        console.error('Error retrieving sub-admins:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSubAdmin = async (req, res) => {
    try {
        const subAdminId = req.params.id;
        const userId = req.user.id;

        if (!subAdminId) {
            return res.status(400).json({ message: 'Sub-admin ID is required' });
        }

        const user = await Admin.findById(userId).populate('navItems.navItem');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Check Permission
        const hasPermission = user.navItems?.some(item =>
            item.navItem?.label === 'Sub-Admins' && item.permissions.includes('delete')
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'You have not access to delete sub admin' });
        }

        // Check if the sub-admin exists
        const subAdmin = await Admin.findById(subAdminId);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }

        // Delete the sub-admin
        await Admin.findByIdAndDelete(subAdminId);

        return res.status(200).json({ message: 'Sub-admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting sub-admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const blockAndUnblockSubAdmin = async (req, res) => {
    try {
        const subAdminId = req.params.id;

        if (!subAdminId) {
            return res.status(400).json({ message: 'Sub-admin ID is required' });
        }

        // Check if the sub-admin exists
        const subAdmin = await Admin.findById(subAdminId);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }

        // Toggle the block/unblock status
        subAdmin.isBlocked = !subAdmin.isBlocked;
        await subAdmin.save();

        // Send appropriate response based on the new status
        const action = subAdmin.isBlocked ? 'blocked' : 'unblocked';
        return res.status(200).json({ message: `Sub-admin ${action} successfully` });

    } catch (error) {
        console.error('Error toggling block/unblock for sub-admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getNavItems = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('User ID:', userId);

        // Fetch user with navItems populated
        const user = await Admin.findById(userId).populate('navItems.navItem');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            // Admin sees all nav items
            const allNavItems = await NavItem.find();
            return res.status(200).json({ navItems: allNavItems });
        } else {
            // Sub-admin sees only assigned nav items
            return res.status(200).json({ navItems: user.navItems });
        }
    } catch (error) {
        console.error('Error fetching nav items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// exports.initializeAdmin = async () => {
//     try {
//         const existingAdmin = await Admin.findOne({ phoneNumber: '8888888888' });
//         if (!existingAdmin) {
//             const newAdmin = new Admin({
//                 phoneNumber: '8888888888',
//                 otp: '1234'
//             });
//             await newAdmin.save();
//             console.log('Admin credentials initialized.');
//         } else {
//             console.log('Admin credentials already exist.');
//         }
//     } catch (error) {
//         console.error('Error initializing admin credentials:', error);
//     }
// };
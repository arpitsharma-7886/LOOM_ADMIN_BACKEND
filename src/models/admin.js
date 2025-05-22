import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
    subadminName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    otp: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'sub-admin'],
        default: 'sub-admin'
    },
    navItems: [
        {
            navItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'NavItem',
                
            },
            permissions: [
                {
                    type: String,
                    enum: ['view', 'edit', 'delete'],
                }
            ]
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin

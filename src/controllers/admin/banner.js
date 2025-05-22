import Admin from '../../models/admin.js';
import BannerModel from '../../models/bannerModel.js';
import path from 'path';


export const createBanner = async (req, res) => {
    try {
        const { title, status } = req.body;

        if (!title || !req.files?.image) {
            return res.status(400).json({ message: "Title and image are required." });
        }

        // Grab the stored file paths
        const imgFile = req.files.image[0];
        const gifFile = req.files.gif?.[0] || null;

        // Extract just the filename
        const imageName = path.basename(imgFile.path);
        const gifName = gifFile ? path.basename(gifFile.path) : null;

        // Build full URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/banner/${imageName}`;
        const gifUrl = gifName ? `${baseUrl}/uploads/banner/${gifName}` : null;

        // Save relative URL (or full URL) in DB
        const newBanner = new BannerModel({
            title,
            status,
            image: imageUrl,
            gif: gifUrl,
        });

        const savedBanner = await newBanner.save();

        res.status(201).json({
            message: "Banner created successfully",
            data: savedBanner,
        });
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBanners = async (req, res) => {
    try {
        const banners = await BannerModel.find({});
        res.status(200).json({ success: true, message: 'Banners reterived successfully', banners })
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;

        const existingBanner = await BannerModel.findById(id);
        if (!existingBanner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        if (title) existingBanner.title = title;
        if (status !== undefined) existingBanner.status = status;

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (req.files?.image) {
            const imageName = path.basename(req.files.image[0].path);
            existingBanner.image = `${baseUrl}/uploads/banner/${imageName}`;
        }

        if (req.files?.gif) {
            const gifName = path.basename(req.files.gif[0].path);
            existingBanner.gif = `${baseUrl}/uploads/banner/${gifName}`;
        }

        const updatedBanner = await existingBanner.save();
        res.status(200).json({
            message: "Banner updated successfully",
            data: updatedBanner
        });
    } catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await BannerModel.findById(id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        await BannerModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const activeAndInactiveBanner = async (req, res) => {
    try {
        const bannerId = req.params.id;

        if (!bannerId) {
            return res.status(400).json({ message: 'Banner ID is required' });
        }

        // Check if the sub-admin exists
        const banner = await Admin.findById(bannerId);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Toggle the block/unblock status
        banner.Active = !subAdmin.Active;
        await banner.save();

        // Send appropriate response based on the new status
        const action = banner.Active ? 'Active' : 'InActive';
        return res.status(200).json({ message: `Banner ${action} successfully` });

    } catch (error) {
        console.error('Error toggling active/inactive for banner:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

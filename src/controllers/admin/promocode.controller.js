
import PromoCode from "../../models/promoCode.js";
import { sendErrorResponse, sendSuccessResponse } from "../../responses/response.js";
import { promoCodeSchema, updatePromoCodeSchema } from "../../validations/promocode.validation.js";

export const createPromoCode = async (req, res) => {
    try {
        // Validate request body using Joi
        const { error, value } = promoCodeSchema.validate(req.body);

        if (error) {
            return sendErrorResponse(res, [], error.details[0].message, 400);
        }

        const { code } = value;

        const existingCode = await PromoCode.findOne({ code });
        if (existingCode) {
            return sendErrorResponse(res, [], 'Code already exists', 400);
        }

        const newCode = new PromoCode(value);
        const saveCode = await newCode.save();

        return sendSuccessResponse(res, saveCode, 'Promo code created successfully');
    } catch (error) {
        console.log('error', error);
        return sendErrorResponse(res, [], 'Failed to create promo code', 500);
    }
};

export const updatePromoCode = async (req, res) => {
    try {
        // Validate request body using Joi
        const { error, value } = updatePromoCodeSchema.validate(req.body);

        if (error) {
            return sendErrorResponse(res, [], error.details[0].message, 400);
        }

        const { id } = req.params;

        // Check if promo code exists
        const existingPromoCode = await PromoCode.findById(id);
        if (!existingPromoCode) {
            return sendErrorResponse(res, [], 'Promo code not found', 404);
        }

        // If code is being updated, check for uniqueness
        if (value?.code && value?.code !== existingPromoCode.code) {
            const codeExists = await PromoCode.findOne({ code: value.code });
            if (codeExists) {
                return sendErrorResponse(res, [], 'Promo code already exists', 400);
            }
        }

        // Update the promo code
        const updatedPromoCode = await PromoCode.findByIdAndUpdate(
            id,
            { $set: value },
            { new: true, runValidators: true }
        );

        return sendSuccessResponse(res, updatedPromoCode, 'Promo code updated successfully', 200);
    } catch (error) {
        console.log('error', error);
        return sendErrorResponse(res, [], 'Failed to update promo code', 500);
    }
};

export const getPromoCodes = async (req, res) => {
    try {
        const codes = await PromoCode.find({});

        if (!codes) {
            return sendSuccessResponse(res, [], 'No promo codes found')
        }

        return sendSuccessResponse(res, codes, 'Promo code fetched successfully')
    } catch (error) {
        console.log('error', error);
        return sendErrorResponse(res, [], 'Failed to fetch codes', 500)
    }
}

export const deleteCode = async (req, res) => {
    try {
        const promoCodeId = req.params.id;

        if (!promoCodeId) {
            return sendErrorResponse(res, [], 'Promo code id is required', 400);
        }

        const code = await PromoCode.findById(promoCodeId);

        if (!code) {
            return sendErrorResponse(res, [], 'Code not found with this id', 400);
        }

        await PromoCode.findByIdAndDelete(promoCodeId);

        return sendSuccessResponse(res, 'Promo Code deleted successfully', 200)
    } catch (error) {
        console.log("error", error);
        return sendErrorResponse(res, [], 'Failed to delete code', 500)
    }
}

export const applyCode = async (req, res) => {
    const {code, totalAmount} = req.body;
    try {
        
        if (!code || !totalAmount) {
            return sendErrorResponse(res, [], 'Code and total amount are required', 400);
        }

        const promo = await PromoCode.findOne({ code, isActive: true });
        if (!promo) {
            return sendErrorResponse(res, [], 'Invalid or inactive promo code', 400);
        }

        const now = new Date();
        if (promo.startDate && now < promo.startDate) {
            return sendErrorResponse(res, [], 'Promo code is not active yet', 400);
        }
        if (promo.expiryDate && now > promo.expiryDate) {
            return sendErrorResponse(res, [], 'Promo code has expired', 400);
        }

        if (promo.minimumPurchase && totalAmount < promo.minimumPurchase) {
            return sendErrorResponse(res, [], `Minimum purchase of ₹${promo.minimumPurchase} required`, 400);
        }

        let discount = 0;
        if (promo.discountType === 'percentage') {
            discount = (promo.discountValue / 100) * totalAmount;
        } else if (promo.discountType === 'flat') {
            discount = promo.discountValue;
        }

        const finalAmount = Math.max(totalAmount - discount, 0);
        return sendSuccessResponse(res, {
            originalAmount: totalAmount,
            discountAmount: discount,
            finalAmount,
            appliedCode: promo.code
        }, 'Promo code applied successfully');

    } catch (error) {
        console.error('Error applying promo code:', error.message);
        return sendErrorResponse(res, [], 'Failed to apply promo code', 500);
    }
};

export const activeInactive = async (req, res) => {
    try {
        const { id, isActive } = req.body;

        if (!id || typeof isActive !== 'boolean') {
            return sendErrorResponse(res, [], 'ID and valid isActive boolean are required', 400);
        }

        const promo = await PromoCode.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!promo) {
            return sendErrorResponse(res, [], 'Promo code not found', 404);
        }

        return sendSuccessResponse(res, promo, `Promo code has been ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
        console.error('Error updating isActive status:', error);
        return sendErrorResponse(res, [], 'Failed to update status', 500);
    }
};

const UserModel = require('../models/UserModel')
const BookingModel = require('../models/BookingModel')
const jwt = require('jsonwebtoken');

const getProvidersByCategory = async (req, res) => {
    const category = req.query.category;

    if (!category || category.length === 0) {
        res.status(400).json({ error: "Invalid category" });
        return;
    }

    try {
        const providers = await UserModel.find({
            userType: "PROVIDER",
            'services.category': category
        });

        res.json({ success: true, data: {providers} });
    } catch (err) {
        console.error("Error fetching providers:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const createBooking = async (req, res) => {
    const token = req.cookies.token;
    console.log(token);
    const {providerId, providerServiceId, date, startTime, endTime, address, paymentMode} = req.body;
    console.log(req.body);

    // validation to be added

    try {
        const tokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const clientUserDoc = await UserModel.findById(tokenInfo.id)
        const providerUserDoc = await UserModel.findById(providerId)
        const service = providerUserDoc.services.find(service => service._id.toString() === providerServiceId);

        const bookingDoc = await BookingModel.create({
            providerId: providerUserDoc._id,
            providerServiceId: service._id,
            clientId: clientUserDoc._id,
            status: "IN_PROGRESS",
            clientAddress: address,
            date: date,
            startTime: startTime,
            endTime: endTime,
            paymentMode: paymentMode
        })

        res.status(201).json(bookingDoc)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports = {getProvidersByCategory, createBooking}
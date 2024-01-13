const UserModel = require('../models/UserModel');
const BookingModel = require('../models/BookingModel');
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const {token} = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userDoc = await UserModel.findOne({_id: decoded.id});

    if (!userDoc) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = userDoc; // Attach the user object to the request for later use
    next(); // Move to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

const getProviderRequests = async (req, res) => {
  const {status} = req.query

  try {
    const bookings = await BookingModel.find({
      providerId: req.user._id,
      status: status
    })
    res.status(400).json({ data: bookings});
  } catch (e) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong!!!"});
    return;
  }
}

const updateProviderRequest = async (req, res) => {
  const {bookingId, status} = req.body;

  try {
    const bookingDoc = await BookingModel.findById(bookingId)
    bookingDoc.status = status
    const updatedBooking = await bookingDoc.save();
    res.status(200).json({ data: updatedBooking});
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong!!!"});
    return;
  }
}

const updateProviderAvailability = async (req, res) => {
  const {daysType, startDate, endDate, startTime, endTime} = req.body ;

  let startDateObj = null;
  let endDateObj = null;

  if (daysType == "DATE_RANGE") {
    if (!startDate || startDate.length == 0) {
      res.status(400).json({ error: "Invalid start date" });
      return;
    }
    if (!endDate || endDate.length == 0) {
      res.status(400).json({ error: "Invalid end date" });
      return;
    }
    startDateObj = new Date(startDate)
    endDateObj = new Date(endDate)
    if (startDateObj >= endDateObj) {
      res.status(400).json({ error: "Invalid Request: start date should be less than end date" });
      return;
    }
  } else if (daysType == "ALL_DAYS") {
  } else {
    res.status(400).json({ error: "Invalid day type" });
    return;
  }

  if (startTime.length == 0 || startTime == 'Invalid Date') {
    res.status(400).json({ error: "Invalid start time" });
    return;
  }
  if (endTime.length == 0 || endTime == 'Invalid Date') {
    res.status(400).json({ error: "Invalid end time" });
    return;
  }
  if (startTime > endTime) {
    res.status(400).json({ error: "Invalid Request: start time should be less than end time" });
    return;
  }

  try {
    const userDoc = await UserModel.findOne({_id: req.user._id});
    userDoc.availability.daysType = daysType
    userDoc.availability.startDate = (daysType == "ALL_DAYS" ? null : startDate)
    userDoc.availability.endDate = (daysType == "ALL_DAYS" ? null : endDate)
    userDoc.availability.startTime = startTime
    userDoc.availability.endTime = endTime
    userDoc.save();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong!!!"});
    return;
  }
  res.status(200).json({message: "User availability updated"});
};

const addProviderService = async (req, res) => {
  const { description, price, serviceType, title } = req.body;

  if (title.length == 0 || title.length >= 100) {
    res.status(400).json({ error: "Title should be less than 100 characters" });
    return;
  }
  if (price <= 0 || price > 5000) {
    res.status(400).json({ error: "Price should be less than 5000" });
    return;
  }
  if (description.length == 0 || description.length >= 500) {
    res
      .status(400)
      .json({ error: "description should be less than 500 characters" });
    return;
  }
  if (serviceType.length == 0) {
    res.status(400).json({ error: "Invalid service type" });
    return;
  }

  try {
    const userDoc = await UserModel.findOne({_id: req.user._id});
    const newService = {
        title: title,
        description: description,
        price: price,
        category: serviceType
    }
    userDoc.services.push(newService)
    userDoc.save();
    res.status(200).json({message: "Service added successfully"})
  } catch (err) {
    res.status(400).json({ error: "Something went wrong!!!" });
  }
};

// assignment - get provider service
// assignment - get provider availability

module.exports = {authenticateToken, updateProviderAvailability, addProviderService, getProviderRequests, updateProviderRequest };

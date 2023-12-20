const UserModel = require('../models/UserModel');
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

const updateProviderAvailability = (req, res) => {};

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
  } catch (err) {
    res.status(400).json({ error: "Something went wrong!!!" });
  }
  res.end();
};

// assignment - get provider service
// assignment - get provider availability

module.exports = {authenticateToken, updateProviderAvailability, addProviderService };

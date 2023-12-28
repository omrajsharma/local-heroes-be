const UserModel = require('../models/UserModel')

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

module.exports = {getProvidersByCategory}
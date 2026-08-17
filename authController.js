const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Merchant = require("../models/Merchant");


// Register
exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            businessName,
            category,
            description
        } = req.body;


        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "customer"
        });


        // Create merchant profile
        if (role === "merchant") {

            if (!businessName || !category) {

                await User.findByIdAndDelete(user._id);

                return res.status(400).json({
                    message:
                        "Business name and category are required"
                });

            }


            await Merchant.create({
                owner: user._id,
                businessName,
                category,
                description
            });

        }


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Login
exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await User.findOne({ email });


        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!validPassword) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
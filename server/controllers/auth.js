import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email});
        if (!existingUser) return res.status(400).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
        delete existingUser.password;
        res.status(200).json({ token, existingUser});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}
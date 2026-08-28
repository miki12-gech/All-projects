const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { fullName, email, passwordHash: hashedPassword }
        });

        res.json({ message: "User created!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ 
            message: "Login successful", 
            token, 
            name: user.fullName,
            role: user.role 
        });
        
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'student' }, 
            select: { 
                id: true, 
                fullName: true, 
                email: true, 
                createdAt: true,
                quizResults: {
                    select: {
                        score: true,
                        passed: true,
                        lesson: {
                            select: {
                                title: true,
                                course: { select: { title: true } }
                            }
                        }
                    }
                }
            }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        
        if (!user) return res.status(404).json({ error: "User not found" });

        const newRole = user.role === 'student' ? 'admin' : 'student';

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role: newRole }
        });

        res.json({ message: `User is now an ${newRole}`, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update role" });
    }
};
import dotenv from "dotenv";
import db from "../../database/db.js";
import bcryptjs from "bcryptjs";

dotenv.config();

export const addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const users = db.getUsers();

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        console.log(password)
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            role
        };
        users.push(newUser);
        db.saveUsers(users);
        
        return res.status(201).json({
            message: "User added successfully",
            user: newUser,
            status: 201,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

export const deleteUser = async (req, res) => {
    try {

        const { userId } = req.params;
        let users = db.getUsers();
        users = users.filter(user => user.id !== parseInt(userId));
        
        users = users.map((user, index) => ({
            ...user,
            id: index + 1
        }));
        
        db.saveUsers(users);
        
        return res.status(200).json({
            message: "User deleted successfully and IDs reordered",
            status: 200,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const allUsers = db.getUsers();
        const nonAdminUsers = allUsers.filter(user => user.role !== 'admin');
        
        return res.status(200).json({
            message: "Users retrieved successfully",
            users: nonAdminUsers,
            status: 200,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

export const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, role } = req.body;
        let users = db.getUsers();
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        
        if (userIndex === -1) {
            return res.status(404).json({
                error: "User not found",
                status: 404,
                ok: false
            });
        }
        
        users[userIndex] = {
            ...users[userIndex],
            username: username || users[userIndex].username,
            email: email || users[userIndex].email,
            role: role || users[userIndex].role
        };
        
        db.saveUsers(users);
        
        return res.status(200).json({
            message: "User updated successfully",
            user: users[userIndex],
            status: 200,
            ok: true
        });
    } catch (error) {
        return res.status(503).json({
            error: "Internal server error",
            message: error.message,
            status: 503,
            ok: false
        });
    }
};

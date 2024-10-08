 // Start of Selection
import db from "../../database/db.js";
import bcryptjs from "bcryptjs";

const register = async (req, res) => {
	try {
		let { username, password, email } = req.body;
		if (!username || !password || !email) {
			return res.status(400).json({
				message: "Invalid Request",
				ok: false,
				status: 400
			});
		}

		const users = db.getUsers();

		const emailExists = users.find(user => user.email === email);
		if (emailExists) {
			return res.status(400).json({
				message: "Email already taken",
				ok: false,
				status: 400
			});
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;

		const newUser = {
			id: newId,
			username,
			email,
			password: hashedPassword,
			role: 'shopper'
		};

		users.push(newUser);
		db.saveUsers(users);

		return res.status(201).json({
			message: "User Created",
			ok: true,
			status: 201
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Server Error",
			ok: false,
			status: 500
		});
	}
};

export default register;
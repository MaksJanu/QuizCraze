import jwt from 'jsonwebtoken';



const auth = async (req, res, next) => {
	try {
		const token = req.cookies.auth_token;

		if (!token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		req.token = token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
};


const isRoot = async (req, res, next) => {
	try {
		const token = req.cookies.auth_token;

		if (!token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (decoded.rootAccess !== 'root') {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.user = decoded;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
};


const isTokenValid = async (req) => {
	try {
		const token = req.cookies.auth_token;

		if (!token) {
			return false;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		return decoded;
	} catch {
		return false;
	}
};



export { auth, isTokenValid, isRoot };

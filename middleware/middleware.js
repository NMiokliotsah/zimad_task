const jwt = require('jsonwebtoken');

const withAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Unauthorized: No token provided' });
        } else {
            jwt.verify(token, process.env.SECRET_VALUE_ACCESS_TOKEN, (err, user) => {
                if (err) {
                    res.status(401).json({ message: 'Unauthorized: Invalid token' });
                } else {
                    req.id = user.id;
                    next();
                }
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = withAuth;
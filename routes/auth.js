const Router = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { validationResult } = require('express-validator');
const { loginValidators, registerValidators } = require('../validators/validators');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const {
    getUserByEmail,
    addRefreshToken,
    getRefreshToken,
    getRefreshTokenByUserId
} = require('../utils/databaseRequests');
const withAuth = require('../middleware/middleware');

const router = Router();

router.post('/signup', registerValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        const { email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const candidate = await User.create({
            email,
            password: hashPassword
        });
        const accessToken = createAccessToken(email);
        const refreshToken = createRefreshToken(email);

        await addRefreshToken(candidate.id, refreshToken);
        res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error registering' });
    }
});

router.post('/signin', loginValidators, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ message: 'Email or password is wrong' })
        }
        const { email, password } = req.body;
        const candidate = await getUserByEmail(email);

        if (!candidate) return res.status(500).json({ message: 'This user does not exist' });
        const uid = candidate.dataValues.id;

        if (uid) {
            const areSame = await bcrypt.compare(password, candidate.dataValues.password);

            if (areSame) {
                const accessToken = createAccessToken(uid);

                res.status(200).json({ accessToken });
            } else {
                res.status(401).json({ message: 'Password or email are incorrect' });
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signin/new_token', async (req, res) => {
    try {
        const token = req.body.token;

        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

        const tokenData = await getRefreshToken(token);

        if (!tokenData) return res.sendStatus(403);
        const refreshToken = tokenData.dataValues.refresh_token;

        jwt.verify(refreshToken, process.env.SECRET_VALUE_REFRESH_TOKEN, async (err, user) => {
            if (err) return res.sendStatus(403);
            req.id = user.id;
            const accessToken = createAccessToken(user.id);

            res.json({ accessToken: accessToken });
            tokenData.accesses_token = accessToken;
            await tokenData.save();
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/logout', withAuth, async (req, res) => {
    try {
        const user = await getUserByEmail(req.id);
        const token = await getRefreshTokenByUserId(user.dataValues.id)
        const refreshToken = createRefreshToken(user.dataValues.email);

        token.refresh_token = refreshToken;
        await token.save();
        res.status(200).json({ refreshToken });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
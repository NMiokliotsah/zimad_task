const { body } = require('express-validator');
const { getUserByEmail } = require('../utils/databaseRequests');

exports.registerValidators = [
    body('email', 'Enter a valid email')
        .isEmail()
        .custom(async email => {
            try {
                const user = await getUserByEmail(email)

                if (user) {
                    return Promise.reject("This user already exist")
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    body('password', 'Password must be 8 characters')
        .isLength({ min: 8, max: 56 })
        .isAlphanumeric()
        .trim(),
    body('repeatPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match')
            }
            return true;
        })
        .trim()
];

exports.loginValidators = [
    body('email', 'Something went wrong')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Something went wrong')
        .isLength({ min: 8, max: 56 })
        .trim()
]
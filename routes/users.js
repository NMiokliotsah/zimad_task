const Router = require('express');
const withAuth = require('../middleware/middleware');

const router = Router();

router.get('/info', withAuth, (req, res) => {
    return res.status(200).json(req.id);
});

module.exports = router;
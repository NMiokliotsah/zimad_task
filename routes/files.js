const Router = require('express');
const withAuth = require('../middleware/middleware');
const fs = require('fs');
const path = require('path');
const Files = require('../models/files');
const { getUserByEmail, getFileByName } = require('../utils/databaseRequests');

const router = Router();

router.post('/upload', withAuth, async (req, res) => {
    try {
        const files = req.files;

        if (!files) return res.status(500).json({ message: 'File does not exist' });
        const file = files.file;
        const user = await getUserByEmail(req.id);
        const isFile = await getFileByName(file.name);

        if (isFile) return res.status(500).json({ message: 'File with this name already exist' });
        await Files.create({
            user_id: user.id,
            name: file.name,
            ext: path.extname(file.name),
            mimetype: file.mimetype,
            size: file.size
        });
        await file.mv('./files/' + file.name);
        res.status(200).json({ message: 'File loaded' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/list', withAuth, async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const sizeLimit = +req.query.size_limit || 10;
        const startIndex = (page - 1) * sizeLimit;
        const user = await getUserByEmail(req.id);
        const files = await Files.findAll({
            limit: sizeLimit,
            offset: startIndex,
            where: {
                user_id: user.id
            }
        });

        res.status(200).json({ count: files.length, files });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete/:id', withAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserByEmail(req.id);
        const file = await Files.findByPk(id);

        if (!file) return res.status(500).json({ message: 'File does not exist' });
        if (file.user_id !== user.id) return res.status(403);

        await file.destroy();
        await fs.unlink(`files/${file.name}`, err => {
            if (err) {
                throw err;
            }
        })
        res.status(204).json({});
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const file = await Files.findByPk(id);
        const user = await getUserByEmail(req.id);

        if (!file) return res.status(500).json({ message: 'File does not exist' });
        if (file.user_id !== user.id) return res.status(403).json({ message: 'User does not have this file' });

        res.status(200).json(file.dataValues);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'File does not exist' });
    }
});

router.get('/download/:id', withAuth, async (req, res) => {
    try {
        const file = await Files.findByPk(req.params.id);
        const user = await getUserByEmail(req.id);

        if (!file) return res.status(500).json({ message: 'File does not exist' });
        if (file.user_id !== user.id) return res.status(403).json({ message: 'User does not have this file' });

        res.download(`files/${file.name}`);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update/:id', withAuth, async (req, res) => {
    try {
        const file = await Files.findByPk(req.params.id);
        const files = req.files;
        const user = await getUserByEmail(req.id);

        if (!files || !file) return res.status(500).json({ message: 'File does not exist' });
        if (file.user_id !== user.id) return res.status(403).json({ message: 'User does not have this file' });

        const newFile = files.file;
        const isFile = await getFileByName(newFile.name);

        if (isFile && isFile.id !== file.id) return res.status(500).json({ message: 'File with this name already exists' });

        await fs.unlink(`files/${file.name}`, err => {
            if (err) {
                throw err;
            }
        });

        file.name = newFile.name;
        file.ext = path.extname(newFile.name);
        file.mimetype = newFile.mimetype;
        file.size = newFile.size;
        await file.save();
        await newFile.mv('./files/' + file.name);
        res.status(200).json({ file });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
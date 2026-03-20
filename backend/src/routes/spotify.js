import express from 'express';
import { query, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { searchArtists } from '../controllers/spotifyController.js';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    next();
};

const validateSearch = [
    query('q').trim().notEmpty().withMessage('Search query required').escape(),
    handleValidationErrors
];

router.get('/search', authenticateToken, validateSearch, searchArtists);

export default router;

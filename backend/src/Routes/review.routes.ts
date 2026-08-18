import express from 'express';
import { protect } from '../Middlewares/auth.middleware';
import { createReview, getReviewsByBook, deleteReview } from '../Controllers/review.controller';

export const Reviewroutes = express.Router();

Reviewroutes.get('/:bookId', getReviewsByBook);
Reviewroutes.post('/', protect, createReview);
Reviewroutes.delete('/:reviewId', protect, deleteReview);

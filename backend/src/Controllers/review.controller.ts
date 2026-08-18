import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({ message: 'Book ID and rating are required' });
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_bookId: { userId, bookId },
      },
    });

    if (existingReview) {
      return res.status(409).json({ message: 'You have already reviewed this book' });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating: ratingNum,
        comment: comment?.trim() || null,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return res.status(201).json({ message: 'Review created', review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong creating the review',
      error: (error as Error).message,
    });
  }
};

export const getReviewsByBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId as string;

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : 0;

    return res.status(200).json({ reviews, averageRating, total: reviews.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong fetching reviews',
      error: (error as Error).message,
    });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId as string;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong deleting the review',
      error: (error as Error).message,
    });
  }
};

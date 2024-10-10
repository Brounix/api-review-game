import { ReviewDTO, CreateReviewDTO, UpdateReviewDTO } from "../dto/review.dto";
import { Review } from "../models/review.model";
import { Game } from "../models/game.model";
import { NotFoundError } from "../error/NotFoundError";

class ReviewService {
    public async getReviews(): Promise<ReviewDTO[]> {
        const reviews = await Review.findAll({
            include: [
                {
                    model: Game,
                    as: "game",
                },
            ],
        });

        return reviews.map(review => ({
            id: review.id,
            review_text: review.review_text,
            rating: review.rating,
            game_id: review.game_id,
            game: review.game ? {
                id: review.game.id,
                title: review.game.title,
                console: review.game.console,
            } : undefined,
        }));
    }

    public async getReviewById(id: number): Promise<ReviewDTO> {
        const review = await Review.findByPk(id, {
            include: [
                {
                    model: Game,
                    as: "game",
                },
            ],
        });

        if (!review) {
            throw new NotFoundError(`Review with ID ${id} not found`);
        }

        return {
            id: review.id,
            review_text: review.review_text,
            rating: review.rating,
            game_id: review.game_id,
            game: review.game ? {
                id: review.game.id,
                title: review.game.title,
                console: review.game.console,
            } : undefined,
        };
    }

    public async createReview(review_text: string, rating: number, gameId: number): Promise<ReviewDTO> {
        const existingGame = await Game.findByPk(gameId);

        if (!existingGame) {
            throw new NotFoundError(`Game with ID ${gameId} not found`);
        }

        const newReview = await Review.create({ review_text, rating, game_id: gameId });

        return {
            id: newReview.id,
            review_text: newReview.review_text,
            rating: newReview.rating,
            game_id: newReview.game_id,
            game: {
                id: existingGame.id,
                title: existingGame.title,
                console: existingGame.console,
            },
        };
    }

    public async deleteReview(id: number): Promise<void> {
        const review = await Review.findByPk(id);
        if (!review) {
            throw new NotFoundError(`Review with ID ${id} not found`);
        }

        await review.destroy();
    }

    public async updateReview(id: number, updatedAttributes: UpdateReviewDTO): Promise<ReviewDTO> {
        const review = await Review.findByPk(id);

        if (!review) {
            throw new NotFoundError(`Review with ID ${id} not found`);
        }

        if (updatedAttributes.review_text !== undefined) {
            review.review_text = updatedAttributes.review_text;
        }
        if (updatedAttributes.rating !== undefined) {
            review.rating = updatedAttributes.rating;
        }
        if (updatedAttributes.game_id !== undefined) {
            const existingGame = await Game.findByPk(updatedAttributes.game_id);
            if (!existingGame) {
                throw new NotFoundError(`Game with ID ${updatedAttributes.game_id} not found`);
            }
            review.game_id = updatedAttributes.game_id;
        }

        await review.save();

        const updatedReview = await Review.findByPk(id, {
            include: [
                {
                    model: Game,
                    as: "game",
                },
            ],
        });

        if (!updatedReview) {
            throw new NotFoundError(`Updated review with ID ${id} not found`);
        }

        return {
            id: updatedReview.id,
            review_text: updatedReview.review_text,
            rating: updatedReview.rating,
            game_id: updatedReview.game_id,
            game: updatedReview.game ? {
                id: updatedReview.game.id,
                title: updatedReview.game.title,
                console: updatedReview.game.console,
            } : undefined,
        };
    }
}

export const reviewService = new ReviewService();
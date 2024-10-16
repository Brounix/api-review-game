import {Body, Controller, Delete, Get, Patch, Path, Post, Route, Tags} from "tsoa";
import { ReviewDTO, CreateReviewDTO, UpdateReviewDTO } from "../dto/review.dto";
import { reviewService } from "../services/review.service";
import { notFound, NotFoundError } from "../error/NotFoundError";

@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {
    @Get("/")
    public async getAllReviews(): Promise<ReviewDTO[]> {
        return reviewService.getReviews();
    }

    @Get("{id}")
    public async getReviewById(@Path() id: number): Promise<ReviewDTO> {
        const review = await reviewService.getReviewById(id);
        if (!review) {
            notFound(`Review with ID ${id}`);
        }
        return review;
    }

    @Post("/")
    public async createReview(@Body() requestBody: CreateReviewDTO): Promise<ReviewDTO> {
        const { review_text, rating, game_id } = requestBody;
        return await reviewService.createReview(review_text, rating, game_id);
    }

    @Patch("{id}")
    public async updateReview(@Path() id: number, @Body() requestBody: UpdateReviewDTO): Promise<ReviewDTO> {
        const review = await reviewService.updateReview(id, requestBody);
        if (!review) {
            notFound(`Review with ID ${id}`);
        }
        return review;
    }

    @Delete("{id}")
    public async deleteReview(@Path() id: number): Promise<void> {
        try {
            await reviewService.deleteReview(id);
            this.setStatus(200);
        } catch (error) {
            this.setStatus(400);
            throw new NotFoundError(`Error deleting review with ID ${id}`);
        }
    }
}
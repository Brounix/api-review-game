import {Body, Controller, Delete, Get, Patch, Path, Post, Route, Tags} from "tsoa";
import { ReviewDTO, CreateReviewDTO, UpdateReviewDTO } from "../dto/review.dto";
import { reviewService } from "../services/review.service";
import { NotFoundError } from "../error/NotFoundError";

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
            this.setStatus(404);
            throw new NotFoundError(`Review with ID ${id} not found`);
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
        return await reviewService.updateReview(id, requestBody);
    }

    @Delete("{id}")
    public async deleteReview(@Path() id: number): Promise<void> {
        try {
            await reviewService.deleteReview(id);
            this.setStatus(200);
        } catch (error) {
            this.setStatus(404);
            throw new Error(`Error deleting review: ${error}`);
        }
    }
}
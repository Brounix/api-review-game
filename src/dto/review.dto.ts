import { GameDTO } from "./game.dto";

export interface ReviewDTO {
    id?: number;
    review_text: string;
    rating: number;
    game_id: number;
    game?: GameDTO;
}

export interface CreateReviewDTO {
    review_text: string;
    rating: number;
    game_id: number;
}

export interface UpdateReviewDTO {
    review_text?: string;
    rating?: number;
    game_id?: number;
}
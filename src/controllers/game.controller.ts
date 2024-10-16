import { Body, Controller, Get, Patch, Path, Post, Route, Delete, Tags } from "tsoa";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import {notFound, NotFoundError} from "../error/NotFoundError";
import {ReviewDTO} from "../dto/review.dto";

@Route("games")
@Tags("Games")
export class GameController extends Controller {
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }

  @Get("{id}")
  public async getGameById(@Path() id: number): Promise<GameDTO> {
    const game = await gameService.getGameById(id);
    if (!game) {
      notFound(`Game with ID ${id}`);
    }
    return game;
  }

  @Post("/")
  public async createGame(@Body() requestBody: GameDTO): Promise<GameDTO> {
    const { title, console } = requestBody;
    if (!console || !console.id) {
      this.setStatus(400);
      throw new NotFoundError("Console ID is required to create a game");
    }

    const newGame = await gameService.createGame(title, console.id);
    return {
      id: newGame.id,
      title: newGame.title,
      console: {
        id: newGame.console?.id,
        name: newGame.console?.name,
        manufacturer: newGame.console?.manufacturer,
      }
    };
  }

  @Patch("{id}")
  public async updateGame(@Path() id: number, @Body() requestBody: GameDTO): Promise<GameDTO> {
    const { title, console } = requestBody;

    let consoleId: number | undefined;
    if (console) {
      consoleId = console.id;
    }

    return await gameService.updateGame(id, title, consoleId);
  }

  @Delete("{id}")
  public async deleteGame(@Path() id: number): Promise<void> {
    try {
      await gameService.deleteGame(id);
      this.setStatus(200);
    } catch (error) {
      this.setStatus(400);
      throw new NotFoundError(`${error}`);
    }
  }

  @Get("{id}/reviews")
  public async getReviewsByGameId(@Path() id: number): Promise<ReviewDTO[]> {
    const reviews = await gameService.getReviewsByGameId(id);
    if (!reviews || reviews.length === 0) {
      notFound(`Review for the game ${id}`);
    }
    return reviews;
  }
}
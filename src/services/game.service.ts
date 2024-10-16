import { GameDTO } from "../dto/game.dto";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import {notFound, NotFoundError} from "../error/NotFoundError";
import {Review} from "../models/review.model";
import {ReviewDTO} from "../dto/review.dto";

export class GameService {
  public async getAllGames(): Promise<GameDTO[]> {
    return Game.findAll({
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  public async getGameById(id: number): Promise<Game | null> {
    return await Game.findByPk(id, {
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  public async createGame(title: string, consoleId: number): Promise<Game> {
    const existingConsole = await Console.findByPk(consoleId);

    if (!existingConsole) {
      notFound(`Console with ID ${consoleId}`);
    }

    const newGame = await Game.create({ title, console_id: consoleId });

    newGame.console = existingConsole;

    return newGame;
  }

  // Supprime un jeu par ID
  public async deleteGame(id: number): Promise<void> {
    const review = await Review.findOne({
      where: { game_id: id }
    });

    if (review) {
      throw new NotFoundError(`Cannot delete game with ID ${id} as it has associated reviews.`);
    }

    const game = await Game.findByPk(id);
    if (game) {
      await game.destroy();
    } else {
      notFound(`Game with ID ${id}`);
    }
  }

  public async updateGame(id: number, title?: string, consoleId?: number): Promise<GameDTO> {
    const game = await Game.findByPk(id, {
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });

    if (!game) {
      notFound(`Game with ID ${id}`);
    }

    if (consoleId) {
      const existingConsole = await Console.findByPk(consoleId);
      if (!existingConsole) {
        notFound(`Console with ID ${consoleId}`);
      }
      game.console_id = consoleId;
    }

    if (title) {
      game.title = title;
    }

    await game.save();

    const updatedGame = await Game.findByPk(id, {
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });

    if (!updatedGame) {
      notFound(`Updated game with ID ${id}`);
    }

    return {
      id: updatedGame.id,
      title: updatedGame.title,
      console: updatedGame.console ? {
        id: updatedGame.console.id,
        name: updatedGame.console.name,
        manufacturer: updatedGame.console.manufacturer,
      } : undefined,
    };
  }

  public async getReviewsByGameId(gameId: number): Promise<ReviewDTO[]> {
    const game = await Game.findByPk(gameId);

    if (!game) {
      notFound(`Game with ID ${gameId}`);
    }

    const reviews = await Review.findAll({
      where: { game_id: gameId }
    });

    return reviews.map((review) => ({
      id: review.id,
      review_text: review.review_text,
      rating: review.rating,
      game_id: review.game_id,
      game: {
        id: game.id,
        title: game.title,
        console: game.console,
      },
    }));
  }
}

export const gameService = new GameService();
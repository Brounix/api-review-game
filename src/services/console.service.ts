import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
import {notFound, NotFoundError} from "../error/NotFoundError";
import {GameDTO} from "../dto/game.dto";

export class ConsoleService {

  // Récupère toutes les consoles
  public async getAllConsoles(): Promise<Console[]> {
    return await Console.findAll();
  }

  // Récupère une console par ID
  public async getConsoleById(id: number): Promise<Console | null> {
    return Console.findByPk(id);
  }

  // Crée une nouvelle console
  public async createConsole(
      name: string,
      manufacturer: string
  ): Promise<Console> {
    return Console.create({ name, manufacturer });
  }

  // Supprime une console par ID
  public async deleteConsole(id: number): Promise<void> {
    const reviews = await Review.findOne({
      include: [{
        model: Game,
        as: "game",
        where: { console_id: id }
      }]
    });

    if (reviews) {
      throw new NotFoundError(`Cannot delete console with ID ${id} as it has associated reviews.`);
    }

    const console = await Console.findByPk(id);
    if (console) {
      await console.destroy();
    }
  }

  public async getGamesByConsoleId(consoleId: number): Promise<GameDTO[]> {
    const console = await Console.findByPk(consoleId);

    if (!console) {
      notFound(`Console with ID ${consoleId}`);
    }

    const games = await Game.findAll({
      where: { console_id: consoleId }
    });

    return games.map((game) => ({
      id: game.id,
      title: game.title,
      console: {
        id: console.id,
        name: console.name,
        manufacturer: console.manufacturer,
      },
    }));
  }

  public async updateConsole(
      id: number,
      name?: string,
      manufacturer?: string
  ): Promise<Console | null> {
    const console = await Console.findByPk(id);
    if (console) {
      if (name) console.name = name;
      if (manufacturer) console.manufacturer = manufacturer;
      await console.save();
      return console;
    }
    return null;
  }
}

export const consoleService = new ConsoleService();
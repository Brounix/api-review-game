import {Body, Controller, Delete, Get, Patch, Path, Post, Route, Tags} from "tsoa";
import {consoleService} from "../services/console.service";
import {ConsoleDTO} from "../dto/console.dto";
import {notFound, NotFoundError} from "../error/NotFoundError";
import {GameDTO} from "../dto/game.dto";

@Route("consoles")
@Tags("Consoles")
export class ConsoleController extends Controller {
  // Récupère toutes les consoles
  @Get("/")
  public async getAllConsole(): Promise<ConsoleDTO[]> {
    return consoleService.getAllConsoles();
  }

  // Récupère une console par ID
  @Get("{id}")
  public async getConsoleById(@Path() id: number): Promise<ConsoleDTO> {
    const console = await consoleService.getConsoleById(id);
    if (!console) {
      notFound(`Console with ID ${id}`);
    }
    return console;
  }

  // Crée une nouvelle console
  @Post("/")
  public async createConsole(
      @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    return consoleService.createConsole(name, manufacturer);
  }

  @Get("{id}/games")
  public async getGamesByConsoleId(@Path() id: number): Promise<GameDTO[]> {
    return await consoleService.getGamesByConsoleId(id);
  }

  // Supprime une console par ID
  @Delete("{id}")
  public async deleteConsole(@Path() id: number): Promise<void> {
    try {
      await consoleService.deleteConsole(id);
      this.setStatus(200);
    } catch (error) {
      this.setStatus(400);
      throw new NotFoundError(`${error}`);
    }
  }

  // Met à jour une console par ID
  @Patch("{id}")
  public async updateConsole(
      @Path() id: number,
      @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    const updatedConsole = await consoleService.updateConsole(id, name, manufacturer);
    if (!updatedConsole) {
      notFound(`Console with ID ${id}`);
    }
    return updatedConsole;
  }
}
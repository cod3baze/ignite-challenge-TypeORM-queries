import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository.query(
      `SELECT * FROM games WHERE LOWER(title) LIKE LOWER('%${param}%') `
    );

    // return this.repository
    //   .createQueryBuilder("game")
    //   .where("game.title = :title", { title: param })
    //   .getMany();

    return games as Game[];
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder("games")
      .where("games.id = :id", { id })
      .leftJoinAndSelect("games.users", "users")
      .getMany();

    const usersFormatted = users[0].users;

    return usersFormatted;
  }
}

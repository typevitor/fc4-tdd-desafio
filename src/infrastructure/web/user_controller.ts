import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";
import { CreateUserDTO } from "../../application/dtos/create_user_dto";

export class UserController {
  constructor(private readonly userService: UserService) {
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.body.name;
      if (!name) {
        return res.status(400).json({ message: "O campo nome é obrigatório" });
      }
      const userDto: CreateUserDTO = { name };
      const user = await this.userService.createUser(userDto);

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        data: {
          id: user.getId(),
          name: user.getName(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}

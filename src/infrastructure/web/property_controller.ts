import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";

export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      if (!data.name) {
        return res.status(400).json({ message: "O nome da propriedade é obrigatório." });
      }

      if(!data.maxGuests || data.maxGuests <= 0) {
        return res.status(400).json({ message: "A capacidade máxima deve ser maior que zero." });
      }

      if(data.basePricePerNight === undefined || data.basePricePerNight === null) {
        return res.status(400).json({ message: "O preço base por noite é obrigatório." });
      }

      if(data.basePricePerNight <= 0) {
        return res.status(400).json({ message: "O preço base por noite deve ser maior que zero." });
      }

      const propertyDto: CreatePropertyDTO = { 
        name: data.name,
        description: data.description,
        maxGuests: data.maxGuests,
        basePricePerNight: data.basePricePerNight,
       };
      const property = await this.propertyService.createProperty(propertyDto);

      return res.status(201).json({
        message: "Propriedade criada com sucesso",
        data: {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          maxGuests: property.getMaxGuests(),
          basePricePerNight: property.getBasePricePerNight(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}

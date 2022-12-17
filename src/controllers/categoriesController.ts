import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Category } from "../models";

export const categoriesController = {
    index: async (req: Request, res: Response) => {
        try{
            const categories = await Category.findAll({
                attributes: ['id', 'name', 'position'],
                order: ['position', 'ASC']
            })
            return res.json(categories)
        }catch(err){
            if (err instanceof Error){
                return res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
            }
        }
    }
}
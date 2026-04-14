import { Request, Response } from "express";
import {prisma} from '../lib/prisma';
import z from 'zod';

export const getCategory = async (req: Request, res: Response) => {

    try {

        const categories = await prisma.category.findMany({orderBy:{name: 'asc'}});
        
        if(categories.length === 0){
            return res.status(400).json({message: 'categories not found'})
        }

        return res.status(200).json(categories);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'aparently system is not working well', error: (error as Error).message});
        
    }
}


export const createNewCategory = async(req: Request, res: Response) => {
    const categorySchema = z.object({
        name: z.string().min(1, 'name is required'),
        slug: z.string().min(1, 'slug is required')
    });
    
    try {
        
        const result = categorySchema.safeParse(req.body);

        if(!result.success){
            return res.status(400).json({message: 'both fields must be fill'});
        }

        const {name, slug} = result.data;

        const existingCategory = await prisma.category.findFirst({where: {OR: [{name}, {slug}]}});

        if(existingCategory){
            return res.status(400).json({message: 'the category name or slug already exist remember categories has to be unique'});
        }

        const newCategory = await prisma.category.create({data: {name,slug}});
        return res.status(200).json({message: 'a new category has been created succesfully', data: newCategory});



        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'aparently system is not working well', error: (error as Error).message})
        
    }
}


export const deleteCategory = async(req: Request, res: Response) => {
    try {
        const {id} = req.body;
        
        const booksInCategory = await prisma.book.findFirst({where:{categoryId: id}});

        if(booksInCategory){
            return res.status(400).json({message: 'the category is not empty of book'});

        }

        const deleteCategory = await prisma.category.delete({where:{id}});

        return res.status(200).json({message: "the category has been deleted succesfully", data: deleteCategory});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'aparently system is not working well', error: (error as Error).message})
        
    }
}


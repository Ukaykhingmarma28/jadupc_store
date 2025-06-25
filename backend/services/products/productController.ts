import { Request, Response, NextFunction } from 'express';
import { Product } from './productEntity';
import createHttpError from 'http-errors';
import { User } from '../users/userEntity';

interface AuthRequest extends Request {
    user?: User;
}


const checkRequiredFields = (
    fields: Array<string | undefined>,
    next: NextFunction,
): boolean => {
    if (fields.some((field) => !field)) {
        next(createHttpError(400, 'All fields are required'));
        return true;
    }
    return false;
};


export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(createHttpError(401, 'Unauthorized'));
        return;
    }
    if (user.role !== 'admin') {
        next(createHttpError(403, 'Forbidden'));
        return;
    }

    const { name, description, price, image, stock, productCode } = req.body;
    if (checkRequiredFields([name, description, price, stock, productCode], next)) {
        return;
    }
    const product = Product.create({ name, description, price, image, stock, productCode });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
};


export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    res.status(200).json(products);
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id: parseInt(id) } });
    res.status(200).json(product);
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(createHttpError(401, 'Unauthorized'));
        return;
    }
    if (user.role !== 'admin') {
        next(createHttpError(403, 'Forbidden'));
        return;
    }
    const { id } = req.params;
    const { name, description, price, image, stock, productCode } = req.body;
    const product = await Product.findOne({ where: { id: parseInt(id) } });
    if (!product) {
        next(createHttpError(404, 'Product not found'));
        return;
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.image = image;
    product.productCode = productCode;
    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(createHttpError(401, 'Unauthorized'));
        return;
    }
    if (user.role !== 'admin') {
        next(createHttpError(403, 'Forbidden'));
        return;
    }
    const { id } = req.params;
    const product = await Product.findOne({ where: { id: parseInt(id) } });
    if (!product) {
        next(createHttpError(404, 'Product not found'));
        return;
    }
    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
};


export const getProductByProductCode = async (req: Request, res: Response, next: NextFunction) => {
    const { productCode } = req.params;
    const product = await Product.findOne({ where: { productCode } });
    res.status(200).json(product);
};


export const updateProductStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(createHttpError(401, 'Unauthorized'));
        return;
    }
    if (user.role !== 'admin') {
        next(createHttpError(403, 'Forbidden'));
        return;
    }
    const { id } = req.params;
    const { stock } = req.body;
    const product = await Product.findOne({ where: { id: parseInt(id) } });
    if (!product) {
        next(createHttpError(404, 'Product not found'));
        return;
    }
    product.stock = stock;
    await product.save();
    res.status(200).json({ message: 'Product stock updated successfully', product });
}   



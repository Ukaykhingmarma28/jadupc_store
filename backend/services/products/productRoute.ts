import { Router } from 'express';
import { createProduct, getAllProducts, deleteProduct, getProductById, getProductByProductCode, updateProduct, updateProductStock } from './productController';
import authMiddleware from '../../middleware/auth';
import isAdmin from '../../middleware/isAdmin';

const router = Router();

router.post('/create', authMiddleware, isAdmin, createProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/product-code/:productCode', getProductByProductCode);
router.put('/stock/:id', authMiddleware, isAdmin, updateProductStock);

export default router;
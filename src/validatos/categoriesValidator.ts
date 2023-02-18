import { query, param } from "express-validator";

const showParams = [
    param('id').isNumeric().withMessage('Informe um id de categoria válido')
]


const indexParams = [
    query('page').isLength({ min: 1}).withMessage('O número da página deve ser no mínimo 1'),
    query('perPage').isLength({ min: 1, max: 50  }).withMessage('A quantidade de registros por página deve estar entre 1 e 50 registros')
]

export const categoriesShowValidator = () => showParams
export const categoriesIndexValidator = () => indexParams
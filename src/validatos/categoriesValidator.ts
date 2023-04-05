import { query, param } from "express-validator";

const showParams = [
    param('id').isNumeric().withMessage('Informe um id de categoria válido')
]


const indexParams = [
    query('page').isNumeric().optional({nullable: true}).withMessage('Informe um número de páginas válido'),
    query('perPage').isNumeric().optional({nullable: true}).withMessage('Informe uma quantidade de registros válida'),
    query('page').isLength({ min: 1}).optional({nullable: true}).withMessage('O número da página deve ser no mínimo 1'),
    query('perPage').isLength({ min: 1, max: 50  }).optional({nullable: true}).withMessage('A quantidade de registros por página deve estar entre 1 e 50 registros')
]

export const categoriesShowValidator = () => showParams
export const categoriesIndexValidator = () => indexParams
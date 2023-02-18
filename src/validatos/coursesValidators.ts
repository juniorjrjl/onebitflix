import { query, param } from "express-validator";

const searchParams = [
    query('page').isLength({ min: 1}).withMessage('O número da página deve ser no mínimo 1'),
    query('perPage').isLength({ min: 1, max: 50  }).withMessage('A quantidade de registros por página deve estar entre 1 e 50 registros')
]

const showParams = [
    param('id').isNumeric().withMessage('Informe o id do curso')
]

export const coursesSearchValidators = () => searchParams
export const courseShowValidators = () => showParams
import { body, param } from "express-validator";

const deleteParams = [
    param('id').isNumeric().withMessage('Informe um id de curso válido')
]

const saveBody = [
    body('courseId').isNumeric().withMessage('Informe o id do curso')
]

export const likeDeleteValidators = () => deleteParams
export const likeSaveValidators = () => saveBody
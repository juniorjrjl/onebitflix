import { body, param } from "express-validator";

const deleteParamsValidators = [
    param('id').isNumeric().withMessage('Informe o id do curso')
]

const saveBodyValidators = [
    body('courseId').isNumeric().withMessage('Informe o id do curso')
]

export const favoriteDeleteValidators = () => deleteParamsValidators
export const favoriteSaveValidators = () => saveBodyValidators
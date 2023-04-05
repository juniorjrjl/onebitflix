import { body, Meta } from "express-validator";
import { passwordConfirmation } from "./validatorUtils";

const changePasswordBodyValidators = [
    body('currentPassword').trim().notEmpty().withMessage('Informe a senha atual'),
    body('passwordConfirm').trim().notEmpty().withMessage('Repita a senha atual no campo de confirmação'),
    body('newPassword').trim().notEmpty().withMessage('Informe a nova senha'),
    body('currentPassword').isLength({min: 6, max: 12}).withMessage('A senha atual tem entre 6 e 12 caractéres'),
    body('newPassword').isLength({min: 6, max: 12}).withMessage('A senha atual tem entre 6 e 12 caractéres'),
    body('newPassword').isLength({min: 6, max: 12}).withMessage('A nova senha deve ter entre 6 e 12 caractéres'),
    body(['newPassword', 'passwordConfirm'])
        .custom((_: any, meta: Meta) => passwordConfirmation('newPassword', 'passwordConfirm', meta))
        .withMessage("Os campos 'newPassword'e 'passwordConfirm' estão diferentes")
]

const updateBodyValidators = [
    body('firstName').trim().notEmpty().withMessage('Informe o nome do usuário'),
    body('lastName').trim().notEmpty().withMessage('Informe informe o sobrenome do usuário'),
    body('phone').trim().notEmpty().withMessage('Informe o telefone'),
    body('email').trim().notEmpty().withMessage('Informe o e-mail'),
    body('firstName').isLength({min: 2, max: 20}).withMessage('O nome deve ter entre 2 e 20 caractéres'),
    body('lastName').isLength({min: 2, max: 20}).withMessage('O sobrenome deve ter entre 2 e 20 caractéres'),
    body('phone').isLength({min: 2, max: 20}).withMessage('O telefone deve ter entre 2 e 20 caractéres'),
    body('email').isLength({min: 2, max: 20}).withMessage('O email deve ter entre 2 e 20 caractéres'),
]

export const userChangePasswordValidtators = () => changePasswordBodyValidators
export const userUpdateValidators = () => updateBodyValidators
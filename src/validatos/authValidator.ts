import { body, Meta } from "express-validator";
import { passwordConfirmation } from "./validatorUtils";


const loginBodyValidators = [
    body('email').trim().notEmpty().withMessage('Informe o e-mail'),
    body('password').trim().notEmpty().withMessage('Informe a senha'),
    body('email').isLength({min: 2, max: 20}).withMessage('O email deve ter entre 2 e 20 caractéres'),
    body('password').isLength({min: 2, max: 20}).withMessage('A senha deve ter entre 6 e 20 caractéres')
]

const registerBodyValidators = [
    body('firstName').trim().notEmpty().withMessage('Informe o nome do usuário'),
    body('lastName').trim().notEmpty().withMessage('Informe informe o sobrenome do usuário'),
    body('phone').trim().notEmpty().withMessage('Informe o telefone'),
    body('email').trim().notEmpty().withMessage('Informe o e-mail'),
    body('birth').trim().notEmpty().withMessage('Informe a data de nascimento'),
    body('password').trim().notEmpty().withMessage('Informe a senha'),
    body('passwordVerifier').trim().notEmpty().withMessage('Informe a confirmação da senha'),
    body('firstName').isLength({min: 2, max: 20}).withMessage('O nome deve ter entre 2 e 20 caractéres'),
    body('lastName').isLength({min: 2, max: 20}).withMessage('O sobrenome deve ter entre 2 e 20 caractéres'),
    body('phone').isLength({min: 2, max: 20}).withMessage('O telefone deve ter entre 2 e 20 caractéres'),
    body('email').isLength({min: 2, max: 20}).withMessage('O email deve ter entre 2 e 20 caractéres'),
    body('birth').isDate().withMessage('Informe uma data de nascimento válida'),
    body('password').isLength({min: 2, max: 20}).withMessage('A senha deve ter entre 6 e 20 caractéres'),
    body('passwordVerifier').isLength({min: 2, max: 20}).withMessage('A confirmação da senha deve ter entre 6 e 20 caractéres'),
    body(['password', 'passwordVerifier'])
        .custom((_: any, meta: Meta) => passwordConfirmation('password', 'passwordVerifier', meta))
        .withMessage("Os campos 'password'e 'passwordConfirm' estão diferentes")
]

export const authRegisterValidators = () => registerBodyValidators
export const authLoginValidators = () => loginBodyValidators
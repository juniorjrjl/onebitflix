import { Request } from "express"
import { Meta, validationResult } from "express-validator";
import { InvalidParamError, InvalidParamField } from "../errors/invalidParamError";

export const checkValidators = (req: Request) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const fields = errors.array().map(e => InvalidParamField.builder()
            .withField(e.param)
            .withMessage(e.msg)
            .build())
        throw new InvalidParamError("A requisição contém parametros inválidos", fields);
    }
}

export const passwordConfirmation = async (password: string, passwordConfirm: string, meta: Meta) => meta.req.body[password] !== meta.req.body[passwordConfirm] && Promise.reject()
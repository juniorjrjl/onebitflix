import { param } from "express-validator";

const getWatchTimeValidators = [
    param('id').isNumeric().withMessage('informe um id de tempo de transmissão válido')
]

const setWatchTimeValidators = [
    param('id').isNumeric().withMessage('informe um id de tempo de transmissão válido'),
    param('seconds').isNumeric().withMessage('informe o momento em que o usuário parou de assistir os vídeos em segundos')
]

const getValidators = [
    param('id').isString().withMessage('informe uma url de vídeo válida')
]

export const getWatchTimeEpisodesValidators = () => getWatchTimeValidators
export const setWatchTimeEpisodesValidators = () => setWatchTimeValidators
export const getEpidodesValidators = () => getValidators
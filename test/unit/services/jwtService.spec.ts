import { JwtPayload } from "jsonwebtoken"
import JwtService from "../../../src/services/jwtService"
import { payloadDTOFactory } from "../../factories/payloadDTO"


describe('JWT Service', () => {

    let jwtService: JwtService

    beforeEach(() => jwtService = new JwtService())

    it('sign and verify token', async () =>{
        const payload = payloadDTOFactory.build()
        const jwt = await jwtService.sign(payload, '1d')
        jwtService.verify(jwt, (err, decoded) => {
            expect(err).toBeNull()
            expect(decoded).not.toBeUndefined()
            expect((decoded as JwtPayload).id).toBe(payload.id)
            expect((decoded as JwtPayload).firstName).toBe(payload.firstName)
            expect((decoded as JwtPayload).email).toBe(payload.email)
        })
    })

})
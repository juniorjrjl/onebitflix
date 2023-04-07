import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
    openapi: '3.0.0',
    info: {
        title: 'OneBitFlix API',
        version: '1.0.0',
        description: 'API do projeto OneBitflix desenvolvida no curso Fullstack da OneBitCode',
    },
    servers:[
        {
            url: `http://localhost:${process.env.SERVER_PORT || 3000}`,
            description: 'Development server'
        }
    ],
    components:{
        securitySchemes:{
            bearerAuth:{
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    security:[{
        bearerAuth: []
    }]
}

const options: swaggerJSDoc.OAS3Options = {
    swaggerDefinition,
    apis: ['./src/controllers/*.ts']
}

export const swaggerSpec = swaggerJSDoc(options)
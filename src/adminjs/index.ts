import AdminJs from 'adminjs'
import AdminJsExpress from '@adminjs/express'
import AdminSequelize from '@adminjs/sequelize'
import { sequelize } from '../database'
import { adminJsResources } from './resources'
import { locale } from './locale'
import { componentLoader } from './components'
import { DashboardOptions } from './dashboard'
import { brandingOptions } from './branding'
import { authenticationOptions } from './authentication'

AdminJs.registerAdapter(AdminSequelize)


export const adminJs = new AdminJs({
    databases: [sequelize],
    rootPath: '/admin',
    resources: adminJsResources,
    locale: locale,
    componentLoader: componentLoader,
    dashboard: DashboardOptions,
    branding: brandingOptions
})

export const adminJsRouter = AdminJsExpress.buildAuthenticatedRouter(adminJs, authenticationOptions, null, {resave: false, saveUninitialized: false})
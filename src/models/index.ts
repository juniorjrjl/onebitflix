import { Category } from './Category'
import { Course } from './Course'
import { Episode } from './Episode'
import { User } from './User'
import { Favorite } from './Favorite'

Category.hasMany(Course)
Course.belongsTo(Category)

Course.hasMany(Episode)
Episode.belongsTo(Course)

Course.belongsToMany(User, { through: Favorite })
Course.hasMany(Favorite)

Episode.belongsTo(Course)

Favorite.belongsTo(Course)
Favorite.belongsTo(User)

User.belongsToMany(Course, { through: Favorite})
User.hasMany(Favorite)


export {
    Course,
    Category,
    Episode,
    User,
    Favorite
}
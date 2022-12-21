import { Category } from './Category'
import { Course } from './Course'
import { Episode } from './Episode'
import { User } from './User'
import { Favorite } from './Favorite'
import { Like } from './Like'

Category.hasMany(Course)

Course.belongsToMany(User, { through: Like })
Course.belongsToMany(User, { through: Favorite })
Course.belongsTo(Category)
Course.hasMany(Episode)
Course.hasMany(Favorite)

Episode.belongsTo(Course)
Episode.belongsTo(Course)

Favorite.belongsTo(Course)
Favorite.belongsTo(User)

User.belongsToMany(Course, { through: Favorite})
User.belongsToMany(Course, { through: Like})
User.hasMany(Favorite)


export {
    Course,
    Category,
    Episode,
    User,
    Favorite,
    Like
}
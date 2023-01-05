const bcrypt = require('bcrypt')
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10)
    await queryInterface.bulkInsert('users', [{
      first_name: 'teste',
      last_name: 'teste',
      phone: '555-5555',
      birth: '1990-01-01',
      email: 'teste@teste.com',
      password: hashedPassword,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, { where: { email: 'admin@email.com' } })
  }
};

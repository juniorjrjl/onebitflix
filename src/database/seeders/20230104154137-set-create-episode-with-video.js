'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const name = 'Programador Full-stack Javascript'
    const [course] = await queryInterface.sequelize.query(`SELECT id FROM courses where name = '${name}';`)
    await queryInterface.bulkInsert('episodes', [
      { 
        name: 'Introdução', 
        synopsis: 'Video introdutório do curso Programador Full-stack Javascript', 
        order: 1, 
        video_url: '/videos/course-1/introducao.mp4', 
        seconds_long: 957, 
        course_id: course[0].id, 
        created_at: new Date(), 
        updated_at: new Date() 
      },
    ], 
    {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('episodes', null, {})
  }
};

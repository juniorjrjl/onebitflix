'use strict';

const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [courses] = await queryInterface.sequelize.query('SELECT id FROM courses order by id;')
    for(const i in courses){
      const intI = Number(i) +1
      const imgName = intI <10 ? `0${intI}.jpg` : `${intI}.jpg`
      const thumbnail_url = `thumbnails/course-${courses[i].id}/${imgName}`
      await queryInterface.sequelize.query('UPDATE courses set thumbnail_url = :thumbnail_url WHERE id = :id', 
      {
        replacements: {id: courses[i].id, thumbnail_url}
      })
    }
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('courses', {thumbnail_url: null})
  }
};

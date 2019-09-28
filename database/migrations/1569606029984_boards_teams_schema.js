'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardsTeamsSchema extends Schema {
  up () {
    this.create('boards_teams', table => {
      table.increments()
      table.integer('id_team').unsigned().references('id').inTable('teams')
      table.integer('id_board').unsigned().references('id').inTable('boards')
      table.integer('id_author').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('boards_teams')
  }
}

module.exports = BoardsTeamsSchema

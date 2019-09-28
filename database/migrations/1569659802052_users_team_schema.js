'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersTeamSchema extends Schema {
  up () {
    this.create('users_teams', table => {
      table.increments()
      table.integer('team_id').unsigned().references('id').inTable('teams')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.boolean('root')
      table.timestamps()
    })
  }

  down () {
    this.drop('users_teams')
  }
}

module.exports = UsersTeamSchema

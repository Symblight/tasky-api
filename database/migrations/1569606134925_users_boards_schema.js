'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersBoardsSchema extends Schema {
  up () {
    this.create('users_boards', table => {
      table.increments()
      table.integer('id_user').unsigned().references('id').inTable('users')
      table.integer('id_board').unsigned().references('id').inTable('boards')
      table.boolean('root')
      table.timestamps()
    })
  }

  down () {
    this.drop('users_boards')
  }
}

module.exports = UsersBoardsSchema

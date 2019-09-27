'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardsSchema extends Schema {
  up () {
    this.create('boards', (table) => {
      table.increments()
      table.string('firstname', 80)
      table.boolean('private')
      table.integer('author_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('boards')
  }
}

module.exports = BoardsSchema

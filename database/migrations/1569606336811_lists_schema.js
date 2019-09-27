'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListsSchema extends Schema {
  up () {
    this.create('lists', (table) => {
      table.increments()
      table.integer('id_board').unsigned().references('id').inTable('boards')
      table.string('title', 80)
      table.boolean('closed')
      table.integer('position')
      table.timestamps()
    })
  }

  down () {
    this.drop('lists')
  }
}

module.exports = ListsSchema
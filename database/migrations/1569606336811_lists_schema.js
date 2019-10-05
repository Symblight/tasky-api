'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListsSchema extends Schema {
  up () {
    this.create('lists', table => {
      table.increments()
      table.integer('id_board').unsigned().references('id').inTable('boards')
        .onDelete('CASCADE')
      table.string('title', 80)
      table.boolean('removed').defaultTo(false)
      table.string('pos')
      table.string('uuid', 180)
      table.timestamps()
    })
  }

  down () {
    this.drop('lists')
  }
}

module.exports = ListsSchema

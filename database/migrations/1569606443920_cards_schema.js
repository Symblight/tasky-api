'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardsSchema extends Schema {
  up () {
    this.create('cards', table => {
      table.increments()
      table.integer('id_list').unsigned().references('id').inTable('lists')
        .onDelete('CASCADE')
      table.string('title', 80)
      table.string('data')
      table.boolean('removed').defaultTo(false)
      table.string('pos')
      table.string('uuid', 180)
      table.timestamps()
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardsSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardsSchema extends Schema {
  up () {
    this.create('boards', table => {
      table.increments()
      table.string('title', 80)
      table.boolean('private')
      table.string('background', 180)
      table.string('uuid', 180)
      table.boolean('removed').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('boards')
  }
}

module.exports = BoardsSchema

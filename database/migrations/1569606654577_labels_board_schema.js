'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LabelsBoardSchema extends Schema {
  up () {
    this.create('labels_boards', table => {
      table.increments()
      table.integer('id_board').unsigned().references('id').inTable('boards')
      table.integer('id_label').unsigned().references('id').inTable('labels')
      table.timestamps()
    })
  }

  down () {
    this.drop('labels_boards')
  }
}

module.exports = LabelsBoardSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LabelsCardsSchema extends Schema {
  up () {
    this.create('labels_cards', table => {
      table.increments()
      table.integer('id_card').unsigned().references('id').inTable('cards')
      table.integer('id_label').unsigned().references('id').inTable('labels_boards')
      table.timestamps()
    })
  }

  down () {
    this.drop('labels_cards')
  }
}

module.exports = LabelsCardsSchema

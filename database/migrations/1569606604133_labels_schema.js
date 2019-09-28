'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LabelsSchema extends Schema {
  up () {
    this.create('labels', table => {
      table.increments()
      table.string('name', 80)
      table.string('color', 80)
      table.timestamps()
    })
  }

  down () {
    this.drop('labels')
  }
}

module.exports = LabelsSchema

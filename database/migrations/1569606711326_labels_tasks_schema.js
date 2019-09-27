'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LabelsTasksSchema extends Schema {
  up () {
    this.create('labels_tasks', (table) => {
      table.increments()
      table.integer('id_task').unsigned().references('id').inTable('tasks')
      table.integer('id_label').unsigned().references('id').inTable('labels_boards')
      table.timestamps()
    })
  }

  down () {
    this.drop('labels_tasks')
  }
}

module.exports = LabelsTasksSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksSchema extends Schema {
  up () {
    this.create('tasks', table => {
      table.increments()
      table.integer('id_list').unsigned().references('id').inTable('lists')
      table.string('title', 80)
      table.boolean('removed').defaultTo(false)
      table.integer('position')
      table.timestamps()
    })
  }

  down () {
    this.drop('tasks')
  }
}

module.exports = TasksSchema

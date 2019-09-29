'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksUsersSchema extends Schema {
  up () {
    this.create('tasks_users', table => {
      table.increments()
      table.integer('id_task').unsigned().references('id').inTable('tasks')
      table.integer('id_user').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('tasks_users')
  }
}

module.exports = TasksUsersSchema

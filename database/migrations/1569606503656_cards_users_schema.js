'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardsUsersSchema extends Schema {
  up () {
    this.create('cards_users', table => {
      table.increments()
      table.integer('id_card').unsigned().references('id').inTable('cards')
      table.integer('id_user').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('cards_users')
  }
}

module.exports = CardsUsersSchema

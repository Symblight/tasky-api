'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('login', 'UserController.get')
  Route.delete('logout', 'UserController.logout')
}).prefix('api/v1/user').middleware('auth')


Route.group(() => {
  Route.post('login', 'UserController.login')
  Route.post('signup', 'UserController.register')
}).prefix('api/v1/user')


Route.group(() => {
  Route.post('board', 'BoardController.createPrivate')
  Route.get('board', 'BoardController.showByUser')
  Route.get('board/all', 'BoardController.storeByPrivate')
}).prefix('api/v1').middleware('auth')

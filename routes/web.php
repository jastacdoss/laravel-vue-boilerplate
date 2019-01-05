<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


/** ADMIN CONTROLLER */
Route::get('/dashboard', 'HomeController@home');
Route::get('/dashboard/{any}', 'HomeController@home')->where('any', '.*');

Route::get('/', function () {
    return view('welcome');
});

<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TodoController::class, 'index'])->name('index');
Route::post('/create', [TodoController::class, 'create'])->name('index.create');
Route::post('/update', [TodoController::class, 'update'])->name('index.update');
Route::post('/delete', [TodoController::class, 'destroy'])->name('index.destroy');
Route::post('/delete-all', [TodoController::class, 'destroyAll'])->name('index.destroy.all');
Route::get('/todos', [TodoController::class, 'todos'])->name('index.todos');

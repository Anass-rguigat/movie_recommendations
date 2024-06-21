<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\RatingMovie;
use App\Http\Controllers\API\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user',[AuthController::class,'logged']);

Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);
Route::post('/logout',[AuthController::class,'logout'])->middleware('auth:sanctum');


// Route::middleware('auth:sanctum')->group(function () {
    Route::post('/rate-movie', [RatingMovie::class, 'rateMovie']);
    Route::get('/rated-movies', [RatingMovie::class, 'getRatedMovies']);
// });
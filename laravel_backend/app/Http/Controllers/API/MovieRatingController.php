<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\MovieRating; // Ensure this import if you are using Eloquent Model
use Illuminate\Support\Facades\Auth;

class MovieRatingController extends Controller
{
    public function rateMovie(Request $request)
    {
        $validatedData = $request->validate([
            'tmdb_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $user = Auth::user();

        $rating = MovieRating::updateOrCreate(
            ['user_id' => $user->id, 'tmdb_id' => $validatedData['tmdb_id']],
            ['rating' => $validatedData['rating']]
        );

        return response()->json(['success' => true, 'rating' => $rating]);
    }

    public function getRatedMovies()
    {
        $user = Auth::user();
        $ratings = MovieRating::where('user_id', $user->id)->get();

        return response()->json(['success' => true, 'ratings' => $ratings]);
    }
}

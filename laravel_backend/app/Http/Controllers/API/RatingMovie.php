<?php

namespace App\Http\Controllers\API;

use App\Models\MovieRating;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class RatingMovie extends Controller
{
    public function rateMovie(Request $request)
    {
        $validatedData = $request->validate([
            'tmdb_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // $user = Auth::user();

        $rating = MovieRating::updateOrCreate(
            ['user_id' => $request['user_id'], 'tmdb_id' => $validatedData['tmdb_id']],
            ['rating' => $validatedData['rating']]
        );

        return response()->json(['success' => true, 'rating' => $rating]);
    }

    public function getRatedMovies(Request $request)
    {
        $ratings = MovieRating::where('user_id', $request['user_id'])->get();

        return response()->json(['success' => true, 'ratings' => $ratings]);
    }
}

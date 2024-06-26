<?php

namespace App\Http\Controllers\API;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=_ LOGIN 1 _=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    // public function login(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'email' => 'required|string|email|max:255',
    //         'password' => 'required|string',
    //     ]);

    //     if (!Auth::attempt($validatedData)) {
    //         throw ValidationException::withMessages([
    //             'credentials' => ['The provided credentials are incorrect.'],
    //         ]);
    //     }


    //     $token = $request->user()->createToken('auth_token')->plainTextToken;

    //     return response()->json([
    //         'access_token' => $token,
    //         'token_type' => 'Bearer',
    //     ]);
    // }

    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string',
        ]);
    
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'errors' => [
                    'credentials' => ['The provided credentials are incorrect.'],
                ]
            ], 422); // Return a 422 Unprocessable Entity status code for validation errors
        }
    
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    




// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=_ LOGIN 2 _=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    //  public function login(Request $request)
    //  {
    //      $input = $request->all();

    //      $validation = Validator::make($input,[
    //          'email' => 'required|email',
    //          'password' => 'required',
    //      ]);

    //      if($validation->fails()){
    //          return response()->json(['success' => false, 'Status' => 422 , 'message' => $validation->errors()]);
    //      }

    //      if(Auth::attempt(['email' => $input['email'],'password'=>$input['password']])){

    //          $user = Auth::user();
    //          $token = $user->createToken('user')->plainTextToken;

    //          return response()->json([ 'token' => $token ]);

    //      }else{
    //          return response()->json(['success' => false, 'Status' => 422 , 'message' => 'email or password incorrect']);
    //      }
    // }


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=_ REGISTER _-=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    // public function register(Request $request)
    // {
    //     $input = $request->all();

    //     $validation = Validator::make($input,[
    //         'name'=> 'required',
    //         'email' => 'required|email|unique:users',
    //         'password' => 'required',
    //     ]);

    //     if($validation->fails()){
    //         return response()->json(['success' => false, 'error' => $validation->errors()]);
    //     }

    //     $user = User::create([
    //         'name'     => $input['name'],
    //         'email'    => $input['email'],
    //         'password' => Hash::make($input['password'])
    //     ]);

    //     $token = $user->createToken('authToken')->plainTextToken;

    //     if($user){
    //         return response()->json(['success' => true, 'message'=>'registred succefully', 'access_token' => $token, 'user' => $user,]);
    //     }

    //     return response()->json(['success' => false, 'message'=>'not registred']);

    // }

    public function register(Request $request)
{
    $input = $request->all();

    $validation = Validator::make($input, [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users|max:255',
        'password' => 'required|string|min:8',
    ]);

    if ($validation->fails()) {
        return response()->json(['errors' => $validation->errors()], 422);
    }

    $user = User::create([
        'name' => $input['name'],
        'email' => $input['email'],
        'password' => Hash::make($input['password'])
    ]);

    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'Registered successfully',
        'access_token' => $token,
        'user' => $user,
    ]);
}


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=_ LOGOUT _-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    public function logout(Request $request)
    {
        // $user = auth()->user()->tokens()->delete();
        $user = $request->user()->tokens()->delete();

        // Return a success response
        if($user){
            return response()->json([
                'message' => 'logout Success',
                'user' => $user
            ], 200);
        }

        return response()->json([
            'message' => 'unothorize',
        ], 200);
    }



// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=_ LOGGED _-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    public function logged(Request $request)
    {
        $logged = auth()->user();
        if($logged){
            return response()->json([
                'message' => 'Successfully logged data',
                'user' => $logged
            ], 200);
        }

        return response()->json([
            'message' => 'unothorize',
        ], 201);

    }

}
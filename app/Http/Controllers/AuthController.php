<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Member;
use Bouncer;

class AuthController extends Controller
{
    /**
     * Retrieve the currently logged in user
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function getUser()
    {
        $user = auth()->user();
        return $user;
    }

    /**
     * Register new account to log into the system. Valid identifying information must be submitted, and requires
     * a profile in UnionWare.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Create the user account
        $user = new User;
        $user->name = request('name');
        $user->email = request('email');
        $user->password = bcrypt(request('password'));
        $user->role_id = '1'; // TODO: Implement roles/permissions package

        // Save the user account
        try {
            $user->save();
        } catch (\Illuminate\Database\QueryException $ex) {
            return response()->json([
                'message' => 'Error creating a user account. (' . $ex->errorInfo[2] . ')',
                'user' => $user,
            ], 400);
        }

        return response()->json([
            'message' => 'User account created successfully.',
            'user' => $user
        ], 201);
    }

    /**
     * Log user into system using Email/Password. Utilizes Passport/Oauth.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function login(Request $request)
    {
        // Check if a user with the specified email exists
        $user = User::whereEmail(request('username'))
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email address does not belong to a user account.',
            ], 422);
        }

        // If a user with the email was found validate the password
        if (!Hash::check(request('password'), $user->password)) {
            return response()->json([
                'message' => 'Invalid password.',
            ], 422);
        }

        // Fetch the Oauth Client
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        // Make sure a Password Client exists in the DB
        if (!$client) {
            return response()->json([
                'message' => 'Laravel Passport is not setup properly.',
            ], 500);
        }

        // Send an internal API request to get an access token
        $data = [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => request('username'),
            'password' => request('password'),
        ];
        $request = Request::create('/oauth/token', 'POST', $data);
        $response = app()->handle($request);

        // Check if the request was successful
        if ($response->getStatusCode() != 200) {
            return response()->json([
                'message' => 'Wrong email or password',
            ], 422);
        }

        // Get the data from the response
        $data = json_decode($response->getContent());

        // Format the final response in a desirable format
        return response()->json([
            'message' => 'Logged in successfully',
            'token' => $data->access_token,
            'user' => $user,
        ], 200);
    }

    /**
     * Log user out of system and revoke access token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $accessToken = auth()->user()->token();

        $refreshToken = DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $accessToken)
            ->update([
                'revoked' => true
            ]);

        $accessToken->revoke();

        // Respond
        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}

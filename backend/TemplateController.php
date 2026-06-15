<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $r)
    {
        $r->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $r->email)->first();
        if (!$user || !Hash::check($r->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }
        if (!$user->is_admin) return response()->json(['message' => 'Bukan admin'], 403);

        $token = $user->createToken('admin')->plainTextToken;
        return ['token' => $token, 'user' => $user];
    }

    public function me(Request $r) { return $r->user(); }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()->delete();
        return ['ok' => true];
    }
}

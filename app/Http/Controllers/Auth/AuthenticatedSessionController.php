<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
  /**
   * Handle an incoming authentication request.
   */
  public function store(LoginRequest $request): JsonResponse
  {
    $request->authenticate();

    $request->session()->regenerate();

    $guards = ['web', 'admin', 'teacher', 'parent'];
    $user = null;

    foreach ($guards as $guard) {
        if (Auth::guard($guard)->check()) {
            /** @var \App\Models\User|\App\Models\Admin|\App\Models\Teacher|\App\Models\StudentParent $user */
            $user = Auth::guard($guard)->user();
            break;
        }
    }

    return response()->json([
      'user' => $user,
      'token' => $user->createToken('api', [$user->getRoleAttribute()])->plainTextToken
    ]);
  }

  /**
   * Destroy an authenticated session.
   */
  public function destroy(Request $request): Response
  {
    $user = $request->user();

    if ($user) {
      $user->tokens()->delete();
    }

    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return response()->noContent();
  }
}

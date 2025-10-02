<?php

namespace App\Http\Controllers;

// DEPLOYMENT TEST: Last updated via GitHub Actions on October 2, 2024 at 15:48 UTC

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $fillable = ['slug', 'name', 'description', 'preview_image', 'config'];
    protected $casts = ['config' => 'array'];
}

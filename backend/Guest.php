<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index() { return Template::orderBy('name')->get(); }

    public function store(Request $r)
    {
        $data = $r->validate([
            'slug' => 'required|string|unique:templates,slug',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'preview_image' => 'nullable|string',
            'config' => 'nullable|array',
        ]);
        return Template::create($data);
    }

    public function update(Request $r, Template $template)
    {
        $data = $r->validate([
            'slug' => 'sometimes|string|unique:templates,slug,'.$template->id,
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'preview_image' => 'nullable|string',
            'config' => 'nullable|array',
        ]);
        $template->update($data);
        return $template;
    }

    public function destroy(Template $template)
    {
        $template->delete();
        return ['ok' => true];
    }
}

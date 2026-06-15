<?php

namespace Database\Seeders;

use App\Models\Invitation;
use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@wedding.test'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'is_admin' => true]
        );

        $tpl = Template::updateOrCreate(
            ['slug' => 'garden-vintage'],
            ['name' => 'Garden Vintage', 'description' => 'Tema vintage taman dengan nuansa krem & sage.', 'config' => ['theme' => 'garden-vintage']]
        );

        Template::updateOrCreate(
            ['slug' => 'modern-minimal'],
            ['name' => 'Modern Minimal', 'description' => 'Tema minimalis modern, monochrome.', 'config' => ['theme' => 'modern-minimal']]
        );

        Invitation::updateOrCreate(
            ['slug' => 'bobby-krisma'],
            [
                'user_id' => $admin->id,
                'template_id' => $tpl->id,
                'groom_name' => 'Bobby',
                'bride_name' => 'Krisma',
                'groom_full' => 'Bobby Indra Nainggolan, S.T.',
                'bride_full' => 'Krismawati Simbolon, S.T.',
                'groom_parents' => 'Bapak M. Suherman Nainggolan & Ibu Tiominar Siahaan',
                'bride_parents' => 'Bapak Lamsihar Simbolon & Ibu Risda R. S. Sirait',
                'groom_ig' => 'killaslark',
                'bride_ig' => 'krismasimbolon',
                'wedding_date' => '2024-10-12 10:00:00',
                'cover_quote' => 'Demikianlah mereka bukan lagi dua, melainkan satu. — Matius 19:6',
                'love_story' => [
                    ['year' => '2013', 'title' => 'First Meet', 'text' => 'Pertama kali bertemu di SMA, klub matematika.'],
                    ['year' => '2017', 'title' => 'Together', 'text' => 'Mulai pacaran setelah saling mengenal di kampus.'],
                    ['year' => '2023', 'title' => 'Engagement', 'text' => 'Bobby melamar Krisma, kedua keluarga merestui.'],
                ],
                'gallery' => [],
                'banks' => [
                    ['bank' => 'Bank Mandiri', 'number' => '1650001827451', 'name' => 'Bobby Indra Nainggolan'],
                    ['bank' => 'Bank BRI', 'number' => '043001009542535', 'name' => 'Krismawati Simbolon'],
                ],
                'events' => [
                    ['title' => 'Pemberkatan', 'date' => 'Sabtu, 12.10.2024', 'time' => '10.00 - 12.00 WIB', 'place' => 'Gereja HKBP Tampubolon', 'address' => 'Balige, Toba Samosir', 'maps' => 'https://maps.app.goo.gl/YLXUfzKz5bbtUYWv7'],
                    ['title' => 'Resepsi', 'date' => 'Sabtu, 12.10.2024', 'time' => '13.00 WIB - Selesai', 'place' => 'Sopo Parsaoran Nauli Tambunan', 'address' => 'Jl. Pasar Melintang, Balige', 'maps' => 'https://maps.app.goo.gl/pqkwVqmzChscKK2E7'],
                ],
                'is_published' => true,
            ]
        );
    }
}

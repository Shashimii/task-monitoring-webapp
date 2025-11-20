<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Employee;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $divisions = ['RICTU', 'ORED', 'GSS', 'PMD', 'RAC', 'LEGAL', 'SMD', 'ED'];
        
        foreach ($divisions as $name) {
            Division::create([
                'division_name' => $name
            ]);
        }

        Employee::factory(7)->create();

    }
}

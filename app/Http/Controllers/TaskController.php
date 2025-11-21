<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Division;
use App\Models\Employee;
use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $divisions = Division::all();
        $employees = Employee::orderBy('last_name', 'asc')->get();

        $notStarted = Task::with('division', 'employee')
            ->where('status', 'not_started')
            ->orderBy('created_at', 'desc')
            ->get();
        $inProgress = Task::with('division', 'employee')
            ->where('status', 'in_progress')
            ->orderBy('created_at', 'desc')
            ->get();
        $completed = Task::with('division', 'employee')
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Task', [
            'divisions_data' => $divisions,
            'employees_data' => $employees,
            'notStarted_data' => TaskResource::collection($notStarted),
            'inProgress_data' => TaskResource::collection($inProgress),
            'completed_data' => TaskResource::collection($completed),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_name' => 'required|string|max:255',
            'assignee' => 'required|string|max:255',
            'division' => 'required|string|max:255',
            'last_action' => 'nullable|string|max:255',
            'status' => 'required|string|max:255',
            'priority' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $employeeId = !empty($validated['assignee'])
            ? intval($validated['assignee'])
            : null;

        $divisionId = !empty($validated['division'])
            ? intval($validated['division'])
            : null;

        $task = Task::create([
            'name' => $validated['task_name'],
            'employee_id' => $employeeId,
            'division_id' => $divisionId,
            'last_action' => $validated['last_action'] ?? null,
            'status' => $validated['status'] ?? null,
            'priority' => $validated['priority'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', 'Task added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}

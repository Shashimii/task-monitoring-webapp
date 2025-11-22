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
    public function index(Request $request)
    {
        $divisions = Division::all();
        $employees = Employee::orderBy('last_name', 'asc')->get();

        // Get page numbers for each table separately
        $notStartedPage = $request->get('not_started_page', 1);
        $inProgressPage = $request->get('in_progress_page', 1);
        $completedPage = $request->get('completed_page', 1);

        // Get search parameters for each table
        $notStartedSearch = $request->get('not_started_search', '');
        $inProgressSearch = $request->get('in_progress_search', '');
        $completedSearch = $request->get('completed_search', '');

        // Get sort order for each table (asc or desc, default to desc)
        $notStartedSort = $request->get('not_started_sort', 'desc');
        $inProgressSort = $request->get('in_progress_sort', 'desc');
        $completedSort = $request->get('completed_sort', 'desc');

        // Validate sort order
        $notStartedSort = in_array($notStartedSort, ['asc', 'desc']) ? $notStartedSort : 'desc';
        $inProgressSort = in_array($inProgressSort, ['asc', 'desc']) ? $inProgressSort : 'desc';
        $completedSort = in_array($completedSort, ['asc', 'desc']) ? $completedSort : 'desc';

        // Helper function to apply search
        $applySearch = function($query, $search) {
            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('last_action', 'like', '%' . $search . '%')
                      ->orWhereHas('employee', function($empQuery) use ($search) {
                          $empQuery->where('first_name', 'like', '%' . $search . '%')
                                   ->orWhere('last_name', 'like', '%' . $search . '%');
                      })
                      ->orWhereHas('division', function($divQuery) use ($search) {
                          $divQuery->where('division_name', 'like', '%' . $search . '%');
                      });
                });
            }
            return $query;
        };

        $notStarted = $applySearch(
            Task::with('division', 'employee')
                ->where('status', 'not_started')
                ->orderBy('created_at', $notStartedSort),
            $notStartedSearch
        )->paginate(7, ['*'], 'not_started_page', $notStartedPage);

        $inProgress = $applySearch(
            Task::with('division', 'employee')
                ->where('status', 'in_progress')
                ->orderBy('created_at', $inProgressSort),
            $inProgressSearch
        )->paginate(7, ['*'], 'in_progress_page', $inProgressPage);

        $completed = $applySearch(
            Task::with('division', 'employee')
                ->where('status', 'completed')
                ->orderBy('created_at', $completedSort),
            $completedSearch
        )->paginate(7, ['*'], 'completed_page', $completedPage);

        return Inertia::render('Task', [
            'divisions_data' => $divisions,
            'employees_data' => $employees,
            'notStarted_data' => [
                'data' => TaskResource::collection($notStarted->items())->resolve(),
                'links' => $notStarted->linkCollection()->toArray(),
                'current_page' => $notStarted->currentPage(),
                'last_page' => $notStarted->lastPage(),
                'per_page' => $notStarted->perPage(),
                'total' => $notStarted->total(),
            ],
            'inProgress_data' => [
                'data' => TaskResource::collection($inProgress->items())->resolve(),
                'links' => $inProgress->linkCollection()->toArray(),
                'current_page' => $inProgress->currentPage(),
                'last_page' => $inProgress->lastPage(),
                'per_page' => $inProgress->perPage(),
                'total' => $inProgress->total(),
            ],
            'completed_data' => [
                'data' => TaskResource::collection($completed->items())->resolve(),
                'links' => $completed->linkCollection()->toArray(),
                'current_page' => $completed->currentPage(),
                'last_page' => $completed->lastPage(),
                'per_page' => $completed->perPage(),
                'total' => $completed->total(),
            ],
            'search_params' => [
                'not_started_search' => $notStartedSearch,
                'in_progress_search' => $inProgressSearch,
                'completed_search' => $completedSearch,
            ],
            'sort_params' => [
                'not_started_sort' => $notStartedSort,
                'in_progress_sort' => $inProgressSort,
                'completed_sort' => $completedSort,
            ],
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
        $validated = $request->validate([
            'task_name' => 'required|string|max:255',
            'assignee' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:255',
            'last_action' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'priority' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $employeeId = !empty($validated['assignee'])
            ? intval($validated['assignee'])
            : null;

        $divisionId = !empty($validated['division'])
            ? intval($validated['division'])
            : null;

        $task->update([
            'name' => $validated['task_name'],
            'employee_id' => $employeeId,
            'division_id' => $divisionId,
            'last_action' => $validated['last_action'] ?? null,
            'status' => $validated['status'] ?? null,
            'priority' => $validated['priority'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('task.index')->with('success', 'Task deleted!');
    }
}

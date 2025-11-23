import { useState, useEffect } from 'react'
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { SelectItem } from "@/components/ui/select"
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MainContainer from "@/Components/DivContainer/MainContainer";
import Modal from "@/Components/Modal";
import ModalToggle from "@/Components/Button/ModalToggle";
import PrimaryInput from "@/Components/Form/PrimaryInput";
import TableContainer from '@/Components/DivContainer/TableContainer';
import Table from '@/Components/Table/Table';
import TableHeader from '@/Components/Table/TableHeader';
import TableRow from '@/Components/Table/TableRow';
import TableData from '@/Components/Table/TableData';
import SelectInput from '@/Components/Form/SelectInput';
import TextareaInput from '@/Components/Form/TextareaInput';
import Datepicker from '@/Components/Form/Datepicker';
import Badge from '@/Components/Misc/Badge';
import DateContainer from '@/Components/Misc/DateContainer';
import StatusContainer from '@/Components/Misc/StatusContainer';
import DivisionContainer from '@/Components/Misc/DivisionContainer';
import Pagination from '@/Components/Misc/Pagination';
import ModalPrimary from '@/Components/Button/ModalPrimary';
import ModalSecondary from '@/Components/Button/ModalSecondary';


export default function Task({ divisions_data, employees_data, search_params = {}, sort_params = {} }) {
    // Data
    const { props } = usePage();
    const {
        notStarted_data = [],
        inProgress_data = [],
        completed_data = [],
    } = props;

    // Search state for each table
    const [searchValues, setSearchValues] = useState({
        not_started: search_params.not_started_search || '',
        in_progress: search_params.in_progress_search || '',
        completed: search_params.completed_search || '',
    });

    // Sort state for each table
    const [sortValues, setSortValues] = useState({
        not_started: sort_params.not_started_sort || 'desc',
        in_progress: sort_params.in_progress_sort || 'desc',
        completed: sort_params.completed_sort || 'desc',
    });

    // Debounced search values
    const [debouncedSearch, setDebouncedSearch] = useState(searchValues);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchValues);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchValues]);

    // Track if component has mounted to avoid initial search
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle search when debounced value changes
    useEffect(() => {
        if (!isMounted) return; // Don't search on initial mount

        const performSearch = () => {
            // Get current URL params to preserve other table states
            const currentParams = new URLSearchParams(window.location.search);
            const params = {};

            // Preserve all table page parameters
            ['not_started_page', 'in_progress_page', 'completed_page'].forEach(param => {
                const value = currentParams.get(param);
                if (value) params[param] = value;
            });

            // Preserve all table sort parameters
            ['not_started_sort', 'in_progress_sort', 'completed_sort'].forEach(param => {
                const value = currentParams.get(param);
                if (value) params[param] = value;
            });

            // Set search parameters for each table
            Object.entries(debouncedSearch).forEach(([tableType, value]) => {
                if (value && value.trim() !== '') {
                    params[`${tableType}_search`] = value;
                    // Reset to page 1 when searching
                    params[`${tableType}_page`] = 1;
                } else {
                    // Remove search param if empty
                    delete params[`${tableType}_search`];
                }
            });

            // Remove undefined values
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            });

            router.get(route('task.index'), params, {
                preserveState: true,
                preserveScroll: true,
            });
        };

        performSearch();
    }, [debouncedSearch, isMounted]);

    // Handle search input change
    const handleSearchChange = (tableType, value) => {
        setSearchValues(prev => ({
            ...prev,
            [tableType]: value
        }));
    };

    // Handle sort order change
    const handleSortChange = (tableType, value) => {
        setSortValues(prev => ({
            ...prev,
            [tableType]: value
        }));

        // Get current URL params to preserve other table states
        const currentParams = new URLSearchParams(window.location.search);
        const params = {};

        // Preserve all table page parameters
        ['not_started_page', 'in_progress_page', 'completed_page'].forEach(param => {
            const val = currentParams.get(param);
            if (val) params[param] = val;
        });

        // Preserve all table search parameters
        ['not_started_search', 'in_progress_search', 'completed_search'].forEach(param => {
            const val = currentParams.get(param);
            if (val) params[param] = val;
        });

        // Preserve other table sort parameters
        ['not_started_sort', 'in_progress_sort', 'completed_sort'].forEach(param => {
            if (param !== `${tableType}_sort`) {
                const val = currentParams.get(param);
                if (val) params[param] = val;
            }
        });

        // Set current table sort and reset to page 1
        params[`${tableType}_sort`] = value;
        params[`${tableType}_page`] = 1;

        router.get(route('task.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Helper function to safely get array from paginated data
    const getDataArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.data) {
            const dataArray = data.data;
            if (Array.isArray(dataArray)) return dataArray;
            // If it's an object, convert to array
            if (typeof dataArray === 'object') {
                return Object.values(dataArray);
            }
        }
        return [];
    };

    // console.log(inProgress_data)

    // Processing
    // -Add Task
    const { data: addTaskData, setData: setAddTaskData, post: addTaskPost, processing: addTaskProcessing, errors: addTaskErrors, reset: addTaskReset } = useForm({
        task_name: "",
        assignee: "",
        division: "",
        last_action: "",
        status: "",
        priority: "",
        due_date: "",
        description: "",
    });
    const submitTask = (e) => {
        e.preventDefault();
        toast.loading("Creating task...");

        // Format date before submitting - temporarily update form data
        const originalDueDate = addTaskData.due_date;
        if (originalDueDate && originalDueDate instanceof Date) {
            setAddTaskData("due_date", formatDateForBackend(originalDueDate));
        }
        
        addTaskPost(route("task.store"), {
            onSuccess: () => {
                addTaskReset();
                setOpen(false);

                toast.dismiss();
                toast.success("Task Created!");
            },
            onError: (errors) => {
                // Restore original date if error
                if (originalDueDate instanceof Date) {
                    setAddTaskData("due_date", originalDueDate);
                }
                const messages = Object.values(errors).flat().join(" ");
                toast.dismiss();
                toast.error(messages || "Something went wrong.");
            },
        });
    };

    // Render
    // -Helpers
    const StatusColor = (status) => {
        if (status === 'Not Started') {
            return 'bg-gray-400'
        }
        if (status === 'In Progress') {
            return 'bg-orange-400'
        }
        if (status === 'Completed') {
            return 'bg-green-400'
        }
    }
    const PriorityColor = (priority) => {
        if (priority === 'High') {
            return 'bg-red-600'
        }
        if (priority === 'Medium') {
            return 'bg-orange-600'
        }
        if (priority === 'Low') {
            return 'bg-green-600'
        }
    }
    const DateColor = (date) => {
        if (date) {
            return 'bg-red-100'
        }
    }

    // -Header Title
    const HEADER_CONTENT = (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Tasks
            </h2>

            <ModalToggle
                onClick={() => setOpen(true)}
            >
                Add Tasks
            </ModalToggle>
        </div>
    )

    // -To-Do Table
    // -Edit Toggle (track which task is being edited by ID)
    const [editingTaskId, setEditingTaskId] = useState(null)

    // -Edit Task Form State (store edit data for each task)
    const [editTaskData, setEditTaskData] = useState({})

    // -Accordion State (track which rows are expanded)
    const [expandedRows, setExpandedRows] = useState(new Set())

    // Toggle accordion for a task
    const toggleAccordion = (taskId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev)
            if (newSet.has(taskId)) {
                newSet.delete(taskId)
            } else {
                newSet.add(taskId)
            }
            return newSet
        })
    }

    // -Description Editing State
    const [editingDescriptionId, setEditingDescriptionId] = useState(null)
    const [descriptionEditValue, setDescriptionEditValue] = useState('')

    // Start editing description
    const startEditingDescription = (task) => {
        setDescriptionEditValue(task?.description || '')
        setEditingDescriptionId(task.id)
    }

    // Cancel editing description
    const cancelEditingDescription = () => {
        setEditingDescriptionId(null)
        setDescriptionEditValue('')
    }

    // Save description
    const saveDescription = (taskId) => {
        setUpdateTaskProcessing(true)
        toast.loading("Updating description...")

        let updateData = {}

        // If task is already in main edit mode, merge with existing editTaskData
        if (editingTaskId === taskId) {
            updateData = {
                ...editTaskData,
                description: descriptionEditValue,
            }
        } else {
            // If task is not in main edit mode, get current values from data
            const task = [...getDataArray(notStarted_data), ...getDataArray(inProgress_data), ...getDataArray(completed_data)]
                .find(t => t.id === taskId)
            
            if (task) {
                updateData = {
                    task_name: task.name,
                    assignee: task?.employee?.id ? String(task.employee.id) : '',
                    division: task?.division?.id ? String(task.division.id) : '',
                    last_action: task.last_action || '',
                    status: statusToDbValue(task.status || ''),
                    priority: priorityToDbValue(task.priority || ''),
                    due_date: task.due_date || '',
                    description: descriptionEditValue,
                }
            } else {
                toast.dismiss()
                toast.error("Task not found")
                setUpdateTaskProcessing(false)
                return
            }
        }

        router.put(route("task.update", taskId), prepareTaskDataForSave(updateData), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingDescriptionId(null)
                setDescriptionEditValue('')
                setUpdateTaskProcessing(false)
                toast.dismiss()
                toast.success("Description updated!")
            },
            onError: (errors) => {
                const messages = Object.values(errors).flat().join(" ")
                setUpdateTaskProcessing(false)
                toast.dismiss()
                toast.error(messages || "Something went wrong.")
            },
        })
    }

    // Convert display status to DB value
    const statusToDbValue = (displayStatus) => {
        const statusMap = {
            'Not Started': 'not_started',
            'In Progress': 'in_progress',
            'Completed': 'completed'
        }
        return statusMap[displayStatus] || displayStatus
    }

    // Convert display priority to DB value
    const priorityToDbValue = (displayPriority) => {
        const priorityMap = {
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high'
        }
        return priorityMap[displayPriority] || displayPriority
    }

    // -Edit Task
    const startEditing = (task) => {
        // Parse due_date string (format: MM/DD/YYYY) to Date object for Datepicker
        let dueDateValue = null
        if (task?.due_date) {
            try {
                // Parse MM/DD/YYYY format
                dueDateValue = parse(task.due_date, 'MM/dd/yyyy', new Date())
            } catch (e) {
                // Fallback: try to parse as ISO string
                try {
                    dueDateValue = new Date(task.due_date)
                } catch (e2) {
                    dueDateValue = null
                }
            }
        }

        setEditTaskData({
            task_name: task?.name || '',
            assignee: task?.employee?.id ? String(task.employee.id) : '',
            division: task?.division?.id ? String(task.division.id) : '',
            last_action: task?.last_action || '',
            status: statusToDbValue(task?.status || ''),
            priority: priorityToDbValue(task?.priority || ''),
            due_date: dueDateValue,
            description: task?.description || '',
        })
        setEditingTaskId(task.id)
    }

    // Cancel editing
    const cancelEditing = () => {
        setEditingTaskId(null)
        setEditTaskData({})
    }

    // Update task data helper
    const updateEditTaskData = (field, value) => {
        setEditTaskData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Format date for backend (Y-m-d format to avoid timezone issues)
    const formatDateForBackend = (date) => {
        if (!date) return null
        if (date instanceof Date) {
            // Format as Y-m-d to avoid timezone conversion issues
            return format(date, 'yyyy-MM-dd')
        }
        return date
    }

    // Prepare task data for saving (format dates)
    const prepareTaskDataForSave = (data) => {
        const prepared = { ...data }
        if (prepared.due_date) {
            prepared.due_date = formatDateForBackend(prepared.due_date)
        }
        return prepared
    }

    // Update task
    const [updateTaskProcessing, setUpdateTaskProcessing] = useState(false)

    // -Delete Task
    const deleteTask = (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        toast.loading("Deleting task...");

        router.delete(route("task.destroy", taskId), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss();
                toast.success("Task deleted!");
            },
            onError: (errors) => {
                const messages = Object.values(errors).flat().join(" ");
                toast.dismiss();
                toast.error(messages || "Something went wrong.");
            },
        });
    };

    // -Mobile Card Component
    const TaskCard = ({ task, tableType }) => {
        const isEditing = editingTaskId === task.id
        const isExpanded = expandedRows.has(task.id)

        return (
            <div className="mb-6">
                <div 
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${!isEditing ? "cursor-pointer hover:shadow-xl transition-all duration-200" : ""}`}
                    onClick={() => !isEditing && toggleAccordion(task.id)}
                >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex-1 pr-3">
                            {!isEditing ? (
                                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                                    {task?.name}
                                </h3>
                            ) : (
                                <div className="mb-3">
                                    <PrimaryInput
                                        value={editTaskData.task_name || ''}
                                        onChange={(e) => updateEditTaskData("task_name", e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                                <StatusContainer bgcolor={StatusColor(task?.status)}>
                                    {task?.status}
                                </StatusContainer>
                                <Badge bgcolor={PriorityColor(task?.priority)}>
                                    {task?.priority}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            {!isEditing && (
                                <button
                                    className="cursor-pointer text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    onClick={() => startEditing(task)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            )}
                            {isEditing && (
                                <>
                                    <button
                                        className="cursor-pointer text-green-500 hover:text-green-700 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        onClick={() => {
                                            if (!editTaskData.task_name || editTaskData.task_name.trim() === '') {
                                                toast.error("Task name is required")
                                                return
                                            }
                                            setUpdateTaskProcessing(true)
                                            toast.loading("Updating task...")
                                            router.put(route("task.update", task.id), prepareTaskDataForSave(editTaskData), {
                                                preserveState: true,
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    setEditingTaskId(null)
                                                    setEditTaskData({})
                                                    setUpdateTaskProcessing(false)
                                                    toast.dismiss()
                                                    toast.success("Task Updated!")
                                                },
                                                onError: (errors) => {
                                                    const messages = Object.values(errors).flat().join(" ")
                                                    setUpdateTaskProcessing(false)
                                                    toast.dismiss()
                                                    toast.error(messages || "Something went wrong.")
                                                },
                                            })
                                        }}
                                        disabled={updateTaskProcessing}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                    <button
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        onClick={cancelEditing}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                            <button 
                                className="cursor-pointer text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                onClick={() => deleteTask(task.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-4 text-base">
                        <div className="flex items-center gap-4 py-1">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0 text-sm">Assignee:</span>
                            <div className="flex-1 min-w-0">
                                {!isEditing ? (
                                    <span className="text-gray-800 dark:text-gray-200 break-words block font-medium">
                                        {task?.employee?.first_name + ' ' + task?.employee?.last_name || 'N/A'}
                                    </span>
                                ) : (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Assignee"
                                        defaultValue={editTaskData.assignee || (task?.employee?.id ? String(task.employee.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("assignee", value)}
                                        className="w-full"
                                    >
                                        {employees_data.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.last_name} {employee.first_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-1">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0 text-sm">Division:</span>
                            <div className="flex-1 min-w-0">
                                {!isEditing ? (
                                    <DivisionContainer bgcolor={task?.division?.division_color}>
                                        {task?.division?.division_name || 'N/A'}
                                    </DivisionContainer>
                                ) : (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Division"
                                        defaultValue={editTaskData.division || (task?.division?.id ? String(task.division.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("division", value)}
                                        className="w-full"
                                    >
                                        {divisions_data.map((division) => (
                                            <SelectItem key={division.id} value={String(division.id)}>
                                                {division.division_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-1">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0 text-sm">Last Action:</span>
                            <div className="flex-1 min-w-0">
                                {!isEditing ? (
                                    <span className="text-gray-800 dark:text-gray-200 break-words block font-medium">
                                        {task?.last_action || 'N/A'}
                                    </span>
                                ) : (
                                    <PrimaryInput
                                        value={editTaskData.last_action || ''}
                                        onChange={(e) => updateEditTaskData("last_action", e.target.value)}
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-1">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0 text-sm">Due Date:</span>
                            <div className="flex-1 min-w-0">
                                {!isEditing ? (
                                    <DateContainer bgcolor={DateColor(task?.due_date)}>
                                        {task?.due_date || 'N/A'}
                                    </DateContainer>
                                ) : (
                                    <Datepicker
                                        value={editTaskData.due_date || task?.due_date || ''}
                                        onChange={(date) => updateEditTaskData("due_date", date)}
                                    />
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <>
                                <div className="flex items-center gap-4 py-1">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0 text-sm">Status:</span>
                                    <div className="flex-1 min-w-0">
                                        <SelectInput
                                            placeholder="Select Status"
                                            defaultValue={editTaskData.status || statusToDbValue(task?.status || '')}
                                            onChange={(value) => updateEditTaskData("status", value)}
                                            className="w-full"
                                        >
                                            <SelectItem value="not_started">Not Started</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectInput>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 py-1">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0 text-sm">Priority:</span>
                                    <div className="flex-1 min-w-0">
                                        <SelectInput
                                            placeholder="Select Priority"
                                            defaultValue={editTaskData.priority || priorityToDbValue(task?.priority || '')}
                                            onChange={(value) => updateEditTaskData("priority", value)}
                                            className="w-full"
                                        >
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectInput>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Expanded Description */}
                    {isExpanded && !isEditing && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300">Description:</h4>
                                {editingDescriptionId !== task.id && (
                                    <button
                                        className="text-blue-400 hover:text-blue-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            startEditingDescription(task)
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {editingDescriptionId === task.id ? (
                                <div className="space-y-4">
                                    <TextareaInput
                                        value={descriptionEditValue}
                                        onChange={(e) => setDescriptionEditValue(e.target.value)}
                                        rows={5}
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                saveDescription(task.id)
                                            }}
                                            disabled={updateTaskProcessing}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                cancelEditingDescription()
                                            }}
                                            disabled={updateTaskProcessing}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-base leading-relaxed">
                                    {task?.description || 'No description provided.'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const TABLE_NOT_STARTED_HEAD = (
        <>
            <tr>
                <TableHeader>
                    Name
                </TableHeader>
                <TableHeader>
                    Assignee
                </TableHeader>
                <TableHeader>
                    Division
                </TableHeader>
                <TableHeader>
                    Last Action
                </TableHeader>
                <TableHeader>
                    Status
                </TableHeader>
                <TableHeader>
                    Due Date
                </TableHeader>
                <TableHeader>
                    Priority
                </TableHeader>
                <TableHeader>
                    Action
                </TableHeader>
            </tr>
        </>
    )
    const TABLE_NOT_STARTED_TBODY = (
        <>
            {getDataArray(notStarted_data).map(task => {
                const isEditing = editingTaskId === task.id
                const isExpanded = expandedRows.has(task.id)
                return (
                    <>
                        <TableRow 
                            key={task.id}
                            onClick={() => !isEditing && toggleAccordion(task.id)}
                            className={!isEditing ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" : ""}
                        >
                            <TableData>
                                {!isEditing && (
                                    task?.name
                                )}

                                {isEditing && (
                                    <PrimaryInput
                                        value={editTaskData.task_name || ''}
                                        onChange={(e) => updateEditTaskData("task_name", e.target.value)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    task?.employee?.first_name + ' ' + task?.employee?.last_name
                                )}

                                {isEditing && (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Assignee"
                                        defaultValue={editTaskData.assignee || (task?.employee?.id ? String(task.employee.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("assignee", value)}
                                    >
                                        {employees_data.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.last_name} {employee.first_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <DivisionContainer bgcolor={task?.division?.division_color}>
                                        {task?.division?.division_name}
                                    </DivisionContainer>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Division"
                                        defaultValue={editTaskData.division || (task?.division?.id ? String(task.division.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("division", value)}
                                    >
                                        {divisions_data.map((division) => (
                                            <SelectItem key={division.id} value={String(division.id)}>
                                                {division.division_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    task?.last_action
                                )}

                                {isEditing && (
                                    <PrimaryInput
                                        value={editTaskData.last_action || ''}
                                        onChange={(e) => updateEditTaskData("last_action", e.target.value)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <StatusContainer bgcolor={StatusColor(task?.status)}>
                                        {task?.status}
                                    </StatusContainer>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        placeholder="Select Status"
                                        defaultValue={editTaskData.status || statusToDbValue(task?.status || '')}
                                        onChange={(value) => updateEditTaskData("status", value)}
                                    >
                                        <SelectItem value="not_started">Not Started</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <DateContainer bgcolor={DateColor(task?.due_date)}>
                                        {task?.due_date}
                                    </DateContainer>
                                )}

                                {isEditing && (
                                    <Datepicker
                                        value={editTaskData.due_date || task?.due_date || ''}
                                        onChange={(date) => updateEditTaskData("due_date", date)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <Badge bgcolor={PriorityColor(task?.priority)}>
                                        {task?.priority}
                                    </Badge>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        placeholder="Select Priority"
                                        defaultValue={editTaskData.priority || priorityToDbValue(task?.priority || '')}
                                        onChange={(value) => updateEditTaskData("priority", value)}
                                    >
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                <span className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                    {!isEditing && (
                                        <button
                                            className="cursor-pointer text-blue-400"
                                            onClick={() => startEditing(task)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                    )}

                                    {isEditing && (
                                        <>
                                            <button
                                                className="cursor-pointer text-green-400"
                                                onClick={() => {
                                                    if (!editTaskData.task_name || editTaskData.task_name.trim() === '') {
                                                        toast.error("Task name is required")
                                                        return
                                                    }

                                                    setUpdateTaskProcessing(true)
                                                    toast.loading("Updating task...")

                                                    router.put(route("task.update", task.id), prepareTaskDataForSave(editTaskData), {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            setEditingTaskId(null)
                                                            setEditTaskData({})
                                                            setUpdateTaskProcessing(false)
                                                            toast.dismiss()
                                                            toast.success("Task Updated!")
                                                        },
                                                        onError: (errors) => {
                                                            const messages = Object.values(errors).flat().join(" ")
                                                            setUpdateTaskProcessing(false)
                                                            toast.dismiss()
                                                            toast.error(messages || "Something went wrong.")
                                                        },
                                                    })
                                                }}
                                                disabled={updateTaskProcessing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="cursor-pointer text-blue-400"
                                                onClick={cancelEditing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    <button className="cursor-pointer text-red-400"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </span>
                            </TableData>
                        </TableRow>
                        {isExpanded && !isEditing && (
                            <TableRow key={`${task.id}-description`}>
                                <TableData colSpan={8} className="bg-gray-50 dark:bg-gray-800/50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Description:</h4>
                                            {editingDescriptionId !== task.id && (
                                                <button
                                                    className="text-blue-400 hover:text-blue-600 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        startEditingDescription(task)
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        {editingDescriptionId === task.id ? (
                                            <div className="space-y-3">
                                                <TextareaInput
                                                    value={descriptionEditValue}
                                                    onChange={(e) => setDescriptionEditValue(e.target.value)}
                                                    rows={4}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            saveDescription(task.id)
                                                        }}
                                                        disabled={updateTaskProcessing}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            cancelEditingDescription()
                                                        }}
                                                        disabled={updateTaskProcessing}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                {task?.description || 'No description provided.'}
                                            </p>
                                        )}
                                    </div>
                                </TableData>
                            </TableRow>
                        )}
                    </>
                )
            })}

            {(notStarted_data.data.length === 0 && (
                <TableRow colspan={8} >No tasks are pending to start</TableRow>
            ))}
        </>
    )

    const TABLE_TODO_HEAD = (
        <>
            <tr>
                <TableHeader>
                    Name
                </TableHeader>
                <TableHeader>
                    Assignee
                </TableHeader>
                <TableHeader>
                    Division
                </TableHeader>
                <TableHeader>
                    Last Action
                </TableHeader>
                <TableHeader>
                    Status
                </TableHeader>
                <TableHeader>
                    Due Date
                </TableHeader>
                <TableHeader>
                    Priority
                </TableHeader>
                <TableHeader>
                    Action
                </TableHeader>
            </tr>
        </>
    )
    const TABLE_TODO_TBODY = (
        <>
            {getDataArray(inProgress_data).map(task => {
                const isEditing = editingTaskId === task.id
                const isExpanded = expandedRows.has(task.id)
                return (
                    <>
                        <TableRow 
                            key={task.id}
                            onClick={() => !isEditing && toggleAccordion(task.id)}
                            className={!isEditing ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" : ""}
                        >
                            <TableData>
                                {!isEditing && (
                                    task?.name
                                )}

                                {isEditing && (
                                    <PrimaryInput
                                        value={editTaskData.task_name || ''}
                                        onChange={(e) => updateEditTaskData("task_name", e.target.value)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    task?.employee?.first_name + ' ' + task?.employee?.last_name
                                )}

                                {isEditing && (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Assignee"
                                        defaultValue={editTaskData.assignee || (task?.employee?.id ? String(task.employee.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("assignee", value)}
                                    >
                                        {employees_data.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.last_name} {employee.first_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <DivisionContainer bgcolor={task?.division?.division_color}>
                                        {task?.division?.division_name}
                                    </DivisionContainer>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Division"
                                        defaultValue={editTaskData.division || (task?.division?.id ? String(task.division.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("division", value)}
                                    >
                                        {divisions_data.map((division) => (
                                            <SelectItem key={division.id} value={String(division.id)}>
                                                {division.division_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    task?.last_action
                                )}

                                {isEditing && (
                                    <PrimaryInput
                                        value={editTaskData.last_action || ''}
                                        onChange={(e) => updateEditTaskData("last_action", e.target.value)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <StatusContainer bgcolor={StatusColor(task?.status)}>
                                        {task?.status}
                                    </StatusContainer>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        placeholder="Select Status"
                                        defaultValue={editTaskData.status || statusToDbValue(task?.status || '')}
                                        onChange={(value) => updateEditTaskData("status", value)}
                                    >
                                        <SelectItem value="not_started">Not Started</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <DateContainer bgcolor={DateColor(task?.due_date)}>
                                        {task?.due_date}
                                    </DateContainer>
                                )}

                                {isEditing && (
                                    <Datepicker
                                        value={editTaskData.due_date || task?.due_date || ''}
                                        onChange={(date) => updateEditTaskData("due_date", date)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <Badge bgcolor={PriorityColor(task?.priority)}>
                                        {task?.priority}
                                    </Badge>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        placeholder="Select Priority"
                                        defaultValue={editTaskData.priority || priorityToDbValue(task?.priority || '')}
                                        onChange={(value) => updateEditTaskData("priority", value)}
                                    >
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                <span className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                    {!isEditing && (
                                        <button
                                            className="cursor-pointer text-blue-400"
                                            onClick={() => startEditing(task)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                    )}

                                    {isEditing && (
                                        <>
                                            <button
                                                className="cursor-pointer text-green-400"
                                                onClick={() => {
                                                    if (!editTaskData.task_name || editTaskData.task_name.trim() === '') {
                                                        toast.error("Task name is required")
                                                        return
                                                    }

                                                    setUpdateTaskProcessing(true)
                                                    toast.loading("Updating task...")

                                                    router.put(route("task.update", task.id), prepareTaskDataForSave(editTaskData), {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            setEditingTaskId(null)
                                                            setEditTaskData({})
                                                            setUpdateTaskProcessing(false)
                                                            toast.dismiss()
                                                            toast.success("Task Updated!")
                                                        },
                                                        onError: (errors) => {
                                                            const messages = Object.values(errors).flat().join(" ")
                                                            setUpdateTaskProcessing(false)
                                                            toast.dismiss()
                                                            toast.error(messages || "Something went wrong.")
                                                        },
                                                    })
                                                }}
                                                disabled={updateTaskProcessing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="cursor-pointer text-blue-400"
                                                onClick={cancelEditing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    <button className="cursor-pointer text-red-400"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </span>
                            </TableData>
                        </TableRow>
                        {isExpanded && !isEditing && (
                            <TableRow key={`${task.id}-description`}>
                                <TableData colSpan={8} className="bg-gray-50 dark:bg-gray-800/50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Description:</h4>
                                            {editingDescriptionId !== task.id && (
                                                <button
                                                    className="text-blue-400 hover:text-blue-600 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        startEditingDescription(task)
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        {editingDescriptionId === task.id ? (
                                            <div className="space-y-3">
                                                <TextareaInput
                                                    value={descriptionEditValue}
                                                    onChange={(e) => setDescriptionEditValue(e.target.value)}
                                                    rows={4}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            saveDescription(task.id)
                                                        }}
                                                        disabled={updateTaskProcessing}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            cancelEditingDescription()
                                                        }}
                                                        disabled={updateTaskProcessing}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                {task?.description || 'No description provided.'}
                                            </p>
                                        )}
                                    </div>
                                </TableData>
                            </TableRow>
                        )}
                    </>
                )
            })}

            {(inProgress_data.data.length === 0 && (
                <TableRow colspan={8} >No tasks are in progress</TableRow>
            ))}
        </>
    )

    const TABLE_COMPLETED_HEAD = (
        <>
            <tr>
                <TableHeader>
                    Name
                </TableHeader>
                <TableHeader>
                    Assignee
                </TableHeader>
                <TableHeader>
                    Division
                </TableHeader>
                <TableHeader>
                    Last Action
                </TableHeader>
                <TableHeader>
                    Status
                </TableHeader>
                <TableHeader>
                    Due Date
                </TableHeader>
                <TableHeader>
                    Priority
                </TableHeader>
                <TableHeader>
                    Action
                </TableHeader>
            </tr>
        </>
    )
    const TABLE_COMPLETED_TBODY = (
        <>
            {getDataArray(completed_data).map(task => {
                const isEditing = editingTaskId === task.id
                const isExpanded = expandedRows.has(task.id)
                return (
                    <>
                        <TableRow 
                            key={task.id}
                            onClick={() => !isEditing && toggleAccordion(task.id)}
                            className={!isEditing ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" : ""}
                        >
                            <TableData>
                                {!isEditing && (
                                    task?.name
                                )}

                                {isEditing && (
                                    <PrimaryInput
                                        value={editTaskData.task_name || ''}
                                        onChange={(e) => updateEditTaskData("task_name", e.target.value)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    task?.employee?.first_name + ' ' + task?.employee?.last_name
                                )}

                                {isEditing && (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Assignee"
                                        defaultValue={editTaskData.assignee || (task?.employee?.id ? String(task.employee.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("assignee", value)}
                                    >
                                        {employees_data.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.last_name} {employee.first_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <DivisionContainer bgcolor={task?.division?.division_color}>
                                        {task?.division?.division_name}
                                    </DivisionContainer>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        label=""
                                        placeholder="Select Division"
                                        defaultValue={editTaskData.division || (task?.division?.id ? String(task.division.id) : undefined)}
                                        onChange={(value) => updateEditTaskData("division", value)}
                                    >
                                        {divisions_data.map((division) => (
                                            <SelectItem key={division.id} value={String(division.id)}>
                                                {division.division_name}
                                            </SelectItem>
                                        ))}
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    task?.last_action
                                )}

                                {isEditing && (
                                    <PrimaryInput
                                        value={editTaskData.last_action || ''}
                                        onChange={(e) => updateEditTaskData("last_action", e.target.value)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <StatusContainer bgcolor={StatusColor(task?.status)}>
                                        {task?.status}
                                    </StatusContainer>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        placeholder="Select Status"
                                        defaultValue={editTaskData.status || statusToDbValue(task?.status || '')}
                                        onChange={(value) => updateEditTaskData("status", value)}
                                    >
                                        <SelectItem value="not_started">Not Started</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <DateContainer bgcolor={DateColor(task?.due_date)}>
                                        {task?.due_date}
                                    </DateContainer>
                                )}

                                {isEditing && (
                                    <Datepicker
                                        value={editTaskData.due_date || task?.due_date || ''}
                                        onChange={(date) => updateEditTaskData("due_date", date)}
                                    />
                                )}
                            </TableData>
                            <TableData>
                                {!isEditing && (
                                    <Badge bgcolor={PriorityColor(task?.priority)}>
                                        {task?.priority}
                                    </Badge>
                                )}

                                {isEditing && (
                                    <SelectInput
                                        placeholder="Select Priority"
                                        defaultValue={editTaskData.priority || priorityToDbValue(task?.priority || '')}
                                        onChange={(value) => updateEditTaskData("priority", value)}
                                    >
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectInput>
                                )}
                            </TableData>
                            <TableData>
                                <span className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                    {!isEditing && (
                                        <button
                                            className="cursor-pointer text-blue-400"
                                            onClick={() => startEditing(task)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                    )}

                                    {isEditing && (
                                        <>
                                            <button
                                                className="cursor-pointer text-green-400"
                                                onClick={() => {
                                                    if (!editTaskData.task_name || editTaskData.task_name.trim() === '') {
                                                        toast.error("Task name is required")
                                                        return
                                                    }

                                                    setUpdateTaskProcessing(true)
                                                    toast.loading("Updating task...")

                                                    router.put(route("task.update", task.id), prepareTaskDataForSave(editTaskData), {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            setEditingTaskId(null)
                                                            setEditTaskData({})
                                                            setUpdateTaskProcessing(false)
                                                            toast.dismiss()
                                                            toast.success("Task Updated!")
                                                        },
                                                        onError: (errors) => {
                                                            const messages = Object.values(errors).flat().join(" ")
                                                            setUpdateTaskProcessing(false)
                                                            toast.dismiss()
                                                            toast.error(messages || "Something went wrong.")
                                                        },
                                                    })
                                                }}
                                                disabled={updateTaskProcessing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="cursor-pointer text-blue-400"
                                                onClick={cancelEditing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    <button className="cursor-pointer text-red-400"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </span>
                            </TableData>
                        </TableRow>
                        {isExpanded && !isEditing && (
                            <TableRow key={`${task.id}-description`}>
                                <TableData colSpan={8} className="bg-gray-50 dark:bg-gray-800/50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Description:</h4>
                                            {editingDescriptionId !== task.id && (
                                                <button
                                                    className="text-blue-400 hover:text-blue-600 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        startEditingDescription(task)
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        {editingDescriptionId === task.id ? (
                                            <div className="space-y-3">
                                                <TextareaInput
                                                    value={descriptionEditValue}
                                                    onChange={(e) => setDescriptionEditValue(e.target.value)}
                                                    rows={4}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            saveDescription(task.id)
                                                        }}
                                                        disabled={updateTaskProcessing}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            cancelEditingDescription()
                                                        }}
                                                        disabled={updateTaskProcessing}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                {task?.description || 'No description provided.'}
                                            </p>
                                        )}
                                    </div>
                                </TableData>
                            </TableRow>
                        )}
                    </>
                )
            })}

            {(completed_data.data.length === 0 && (
                <TableRow colspan={8} >No tasks are completed</TableRow>
            ))}
        </>
    )

    // -Add Modal Toggle
    const [open, setOpen] = useState(false)
    // -Add Modal
    const ADD_MODAL_CONTENT = (
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
                <PrimaryInput
                    label="Task Name"
                    type="text"
                    placeholder="Enter Task Name"
                    value={addTaskData.task_name}
                    onChange={(e) => setAddTaskData("task_name", e.target.value)}
                    error={addTaskErrors.task_name}
                />

                <SelectInput
                    label="Division"
                    placeholder="Select Division"
                    value={addTaskData.division}
                    onChange={(value) => setAddTaskData("division", value)}
                    error={addTaskErrors.division}
                >
                    {divisions_data.map((division) => (
                        <SelectItem key={division.id} value={String(division.id)}>
                            {division.division_name}
                        </SelectItem>
                    ))}
                </SelectInput>

                <SelectInput
                    label="Priority"
                    placeholder="Select Priority"
                    value={addTaskData.priority}
                    onChange={(value) => setAddTaskData("priority", value)}
                    error={addTaskErrors.priority}
                >
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectInput>

                <Datepicker
                    label="Due Date"
                    value={addTaskData.due_date}
                    onChange={(date) => setAddTaskData("due_date", date)}
                />
            </div>
            <div className="space-y-4">
                <SelectInput
                    label="Assignee"
                    placeholder="Select Assignee"
                    value={addTaskData.assignee}
                    onChange={(value) => setAddTaskData("assignee", value)}
                    error={addTaskErrors.assignee}
                >
                    {employees_data.map((employee) => (
                        <SelectItem key={employee.id} value={String(employee.id)}>
                            {employee.last_name} {employee.first_name}
                        </SelectItem>
                    ))}
                </SelectInput>
                <SelectInput
                    label="Status"
                    placeholder="Select Status"
                    value={addTaskData.status}
                    onChange={(value) => setAddTaskData("status", value)}
                    error={addTaskErrors.status}
                >
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                </SelectInput>
                <PrimaryInput
                    label="Last Action"
                    type="text"
                    placeholder="Enter Last Action"
                    value={addTaskData.last_action}
                    onChange={(e) => setAddTaskData("last_action", e.target.value)}
                    error={addTaskErrors.last_action}
                />
                <TextareaInput
                    label="Description"
                    value={addTaskData.description}
                    onChange={(e) => setAddTaskData("description", e.target.value)}
                    error={addTaskErrors.description}
                />
            </div>
        </form>

    )
    const ADD_MODAL_FOOTER = (
        <>
            <ModalPrimary
                disabled={addTaskProcessing}
                onClick={submitTask}
            >
                Add Task
            </ModalPrimary>
            <ModalSecondary
                onClick={() => setOpen(false)}
            >
                Cancel
            </ModalSecondary>
        </>
    )

    return (
        <AuthenticatedLayout
            header={HEADER_CONTENT}
        >
            <Head title="Tasks" />

            <MainContainer>
                <div className="space-y-12">
                    <TableContainer
                        tableTitle="NOT STARTED"
                        borderColor="border-gray-500"
                        headerContent={
                            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                                <PrimaryInput
                                    type="text"
                                    placeholder="Search by name, assignee, division, or last action..."
                                    value={searchValues.not_started}
                                    onChange={(e) => handleSearchChange('not_started', e.target.value)}
                                    className="flex-1"
                                />
                                <SelectInput
                                    placeholder="Sort Order"
                                    value={sortValues.not_started}
                                    onChange={(value) => handleSortChange('not_started', value)}
                                    className="w-full sm:w-40"
                                >
                                    <SelectItem value="desc">Descending</SelectItem>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                </SelectInput>
                            </div>
                        }
                    >
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                            <Table
                                thead={TABLE_NOT_STARTED_HEAD}
                                tbody={TABLE_NOT_STARTED_TBODY}
                            />
                        </div>
                        
                        {/* Mobile Card View */}
                        <div className="block md:hidden">
                            {getDataArray(notStarted_data).length > 0 ? (
                                getDataArray(notStarted_data).map(task => (
                                    <TaskCard key={task.id} task={task} tableType="not_started" />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No tasks are pending to start
                                </div>
                            )}
                        </div>

                        {notStarted_data?.links && (
                            <div className="mt-4">
                                <Pagination
                                    links={notStarted_data.links}
                                    current_page={notStarted_data.current_page}
                                    per_page={notStarted_data.per_page}
                                    total={notStarted_data.total}
                                    last_page={notStarted_data.last_page}
                                    tableType="not_started"
                                />
                            </div>
                        )}
                    </TableContainer>

                    <TableContainer
                        tableTitle="IN PROGRESS"
                        borderColor="border-orange-500"
                        headerContent={
                            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                                <PrimaryInput
                                    type="text"
                                    placeholder="Search by name, assignee, division, or last action..."
                                    value={searchValues.in_progress}
                                    onChange={(e) => handleSearchChange('in_progress', e.target.value)}
                                    className="flex-1"
                                />
                                <SelectInput
                                    placeholder="Sort Order"
                                    value={sortValues.in_progress}
                                    onChange={(value) => handleSortChange('in_progress', value)}
                                    className="w-full sm:w-40"
                                >
                                    <SelectItem value="desc">Descending</SelectItem>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                </SelectInput>
                            </div>
                        }
                    >
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                            <Table
                                thead={TABLE_TODO_HEAD}
                                tbody={TABLE_TODO_TBODY}
                            />
                        </div>
                        
                        {/* Mobile Card View */}
                        <div className="block md:hidden">
                            {getDataArray(inProgress_data).length > 0 ? (
                                getDataArray(inProgress_data).map(task => (
                                    <TaskCard key={task.id} task={task} tableType="in_progress" />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No tasks are in progress
                                </div>
                            )}
                        </div>

                        {inProgress_data?.links && (
                            <div className="mt-4">
                                <Pagination
                                    links={inProgress_data.links}
                                    current_page={inProgress_data.current_page}
                                    per_page={inProgress_data.per_page}
                                    total={inProgress_data.total}
                                    last_page={inProgress_data.last_page}
                                    tableType="in_progress"
                                />
                            </div>
                        )}
                    </TableContainer>

                    <TableContainer
                        tableTitle="COMPLETED"
                        borderColor="border-green-500"
                        headerContent={
                            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                                <PrimaryInput
                                    type="text"
                                    placeholder="Search by name, assignee, division, or last action..."
                                    value={searchValues.completed}
                                    onChange={(e) => handleSearchChange('completed', e.target.value)}
                                    className="flex-1"
                                />
                                <SelectInput
                                    placeholder="Sort Order"
                                    value={sortValues.completed}
                                    onChange={(value) => handleSortChange('completed', value)}
                                    className="w-full sm:w-40"
                                >
                                    <SelectItem value="desc">Descending</SelectItem>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                </SelectInput>
                            </div>
                        }
                    >
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                            <Table
                                thead={TABLE_COMPLETED_HEAD}
                                tbody={TABLE_COMPLETED_TBODY}
                            />
                        </div>
                        
                        {/* Mobile Card View */}
                        <div className="block md:hidden">
                            {getDataArray(completed_data).length > 0 ? (
                                getDataArray(completed_data).map(task => (
                                    <TaskCard key={task.id} task={task} tableType="completed" />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No tasks are completed
                                </div>
                            )}
                        </div>

                        {completed_data?.links && (
                            <div className="mt-4">
                                <Pagination
                                    links={completed_data.links}
                                    current_page={completed_data.current_page}
                                    per_page={completed_data.per_page}
                                    total={completed_data.total}
                                    last_page={completed_data.last_page}
                                    tableType="completed"
                                />
                            </div>
                        )}
                    </TableContainer>
                </div>
            </MainContainer>

            <Modal
                open={open}
                setOpen={setOpen}
                width="sm:max-w-[50rem]"
                Icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                }
                IconColor="bg-green-200 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                Title="Add Task"
                TitleSecond="Provide the task name first and other details later."
                Content={ADD_MODAL_CONTENT}
                Footer={ADD_MODAL_FOOTER}
            />
        </AuthenticatedLayout >
    )
}
import { useState } from 'react'
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { SelectItem } from "@/components/ui/select"
import { toast } from 'sonner';
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
import ModalPrimary from '@/Components/Button/ModalPrimary';
import ModalSecondary from '@/Components/Button/ModalSecondary';


export default function Task({ divisions_data, employees_data }) {
    // Data
    const { props } = usePage();
    const {
        notStarted_data = [],
        inProgress_data = [],
        completed_data = [],
    } = props;

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

        addTaskPost(route("task.store"), {
            onSuccess: () => {
                addTaskReset();
                setOpen(false);

                toast.dismiss();
                toast.success("Task Created!");
            },
            onError: (errors) => {
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
    
    // Helper to convert display status to DB value
    const statusToDbValue = (displayStatus) => {
        const statusMap = {
            'Not Started': 'not_started',
            'In Progress': 'in_progress',
            'Completed': 'completed'
        }
        return statusMap[displayStatus] || displayStatus
    }
    
    // Helper to convert display priority to DB value
    const priorityToDbValue = (displayPriority) => {
        const priorityMap = {
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high'
        }
        return priorityMap[displayPriority] || displayPriority
    }
    
    // Initialize edit data when entering edit mode
    const startEditing = (task) => {
        setEditTaskData({
            task_name: task?.name || '',
            assignee: task?.employee?.id ? String(task.employee.id) : '',
            division: task?.division?.id ? String(task.division.id) : '',
            last_action: task?.last_action || '',
            status: statusToDbValue(task?.status || ''),
            priority: priorityToDbValue(task?.priority || ''),
            due_date: task?.due_date || '',
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
    
    // Update task - using router directly for simplicity
    const [updateTaskProcessing, setUpdateTaskProcessing] = useState(false)

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
            {inProgress_data.data?.map(task => {
                const isEditing = editingTaskId === task.id
                return (
                    <TableRow key={task.id}>
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
                                <DivisionContainer bgcolor={task.divisionBg}>
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
                            <span className="flex gap-4">
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
                                                
                                                router.put(route("task.update", task.id), editTaskData, {
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

                                <button className="cursor-pointer text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </span>
                        </TableData>
                    </TableRow>
                )
            })}
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
                <TableContainer
                    tableTitle="IN PROGRESS"
                >
                    <Table
                        thead={TABLE_TODO_HEAD}
                        tbody={TABLE_TODO_TBODY}
                    />
                </TableContainer>
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
import { useState } from 'react'
import { Head, useForm } from "@inertiajs/react";
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

    // -Tasks
    const inprogressTask = Array(10).fill({
        title: "Development of Task Monitoring WebApp for RED",
        person: "Aisha Cruz",
        division: "RICTU",
        divisionBg: "bg-cyan-500",
        forwarded: "Forwarded to RED",
        status: "IN PROGRESS",
        statusBg: "bg-orange-400",
        date: "12/25/2025",
        priority: "Highest",
        priorityBg: "bg-red-600",
    });

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

        // Show a loading toast
        const toastId = toast.loading("Creating task...");

        addTaskPost(route("task.store"), {
            onSuccess: () => {
                addTaskReset();
                setOpen(false);

                // Dismiss loading toast and show success
                toast.dismiss(toastId);
                toast.success("Task Created!");
            },
            onError: (errors) => {
                // Flatten error messages
                const messages = Object.values(errors).flat().join(", ");

                // Dismiss loading toast and show error
                toast.dismiss(toastId);
                toast.error(messages || "Something went wrong.");
            },
        });
    };


    // Render

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
            </tr>
        </>
    )
    const TABLE_TODO_TBODY = (
        <>
            {inprogressTask.map((task, i) => (
                <TableRow key={i}>
                    <TableData>{task.title}</TableData>
                    <TableData>{task.person}</TableData>
                    <TableData>
                        <DivisionContainer bgcolor={task.divisionBg}>
                            {task.division}
                        </DivisionContainer>
                    </TableData>
                    <TableData>{task.forwarded}</TableData>
                    <TableData>
                        <StatusContainer bgcolor={task.statusBg}>
                            {task.status}
                        </StatusContainer>
                    </TableData>
                    <TableData>
                        <DateContainer>{task.date}</DateContainer>
                    </TableData>
                    <TableData>
                        <Badge bgcolor={task.priorityBg}>
                            {task.priority}
                        </Badge>
                    </TableData>
                </TableRow>
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
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
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
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
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
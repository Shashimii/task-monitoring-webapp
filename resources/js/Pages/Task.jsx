import { useState } from 'react'
import { Head } from "@inertiajs/react";
import { SelectItem } from "@/components/ui/select"
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
import Datepicker from '@/Components/Form/Datepicker';
import Badge from '@/Components/Misc/Badge';
import DateContainer from '@/Components/Misc/DateContainer';
import StatusContainer from '@/Components/Misc/StatusContainer';
import DivisionContainer from '@/Components/Misc/DivisionContainer';


export default function Task() {
    // Data
    const inprogressTask = Array(6).fill({
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

    // Render
    const [open, setOpen] = useState(false)

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

    // To-Do Table
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

    // Add Modal
    const ADD_MODAL_ICON_COLOR = "bg-green-200 text-green-700 dark:bg-green-500/10 dark:text-green-400"
    const ADD_MODAL_TITLE = "Add Task"
    const ADD_MODAL_ICON = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    )
    const ADD_MODAL_CONTENT = (

        <form className="space-y-4">
            <div className="space-y-2">
                <PrimaryInput
                    label="Task Name"
                    type="text"
                    placeholder="Enter Task Name"
                />
            </div>
            <div className="space-y-2">
                <SelectInput
                    label="Assignee"
                    placeholder="Select Assignee"
                >
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectInput>
            </div>
            <div className="space-y-2">
                <SelectInput
                    label="Division"
                    placeholder="Select Division"
                >
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectInput>
            </div>
            <div className="space-y-2">
                <PrimaryInput
                    label="Last Action"
                    type="text"
                    placeholder="Enter Last Action"
                />
            </div>
            <div className="space-y-2">
                <SelectInput
                    label="Status"
                    placeholder="Select Status"
                >
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectInput>
            </div>
            <div className="space-y-2">
                <Datepicker
                    label="Due Date"
                />
            </div>
        </form>

    )
    const ADD_MODAL_FOOTER = (
        <>
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
            >
                Assign Task
            </button>
            <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-black ring-1 ring-inset ring-white/5 dark:bg-white/10 text-white dark:hover:bg-white/20 sm:mt-0 sm:w-auto"
            >
                Cancel
            </button>
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
                Icon={ADD_MODAL_ICON}
                IconColor={ADD_MODAL_ICON_COLOR}
                Title={ADD_MODAL_TITLE}
                Content={ADD_MODAL_CONTENT}
                Footer={ADD_MODAL_FOOTER}
            >

            </Modal>
        </AuthenticatedLayout >
    )
}
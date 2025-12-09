import { useState, useEffect, Fragment } from 'react'
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { SelectItem } from "@/components/ui/select"
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MainContainer from "@/Components/DivContainer/MainContainer";
import ModalToggle from "@/Components/Button/ModalToggle";
import TaskTable from '@/Components/Table/TaskTable';


export default function Task() {
    // Props
    const { props } = usePage();
    const {
        notStarted = [],
        inProgress = [],
        completed = [],
        employees_data = [],
        divisions_data = [],
    } = props;


    // Header Title
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

    // Edit Task
    // Not Started
    const {
        data: editDataNotStarted,
        setData: setEditDataNotStarted,
        patch: postEditDataNotStarted,
        processing: editProcessingNotStarted,
        reset: resetEditDataNotStarted,
        errors: editErrorsNotStarted
    } = useForm({
        task_name: '',
        assignee: '',
        division: '',
        last_action: '',
        status: '',
        priority: '',
        due_date: ''
    })

    // In Progress
    const {
        data: editDataInProgress,
        setData: setEditDataInProgress,
        patch: postEditDataInProgress,
        processing: editProcessingInProgress,
        reset: resetEditDataInProgress,
        errors: editErrorsInProgress
    } = useForm({
        task_name: '',
        assignee: '',
        division: '',
        last_action: '',
        status: '',
        priority: '',
        due_date: ''
    })

    // Completed
    const {
        data: editDataCompleted,
        setData: setEditDataCompleted,
        patch: postEditDataCompleted,
        processing: editProcessingCompleted,
        reset: resetEditDataCompleted,
        errors: editErrorsCompleted
    } = useForm({
        task_name: '',
        assignee: '',
        division: '',
        last_action: '',
        status: '',
        priority: '',
        due_date: ''
    })

    // Delete Task
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


    return (
        <AuthenticatedLayout
            header={HEADER_CONTENT}
        >
            <Head title="Tasks" />

            <MainContainer>
                <TaskTable
                    data={notStarted.data}
                    employees_data={employees_data}
                    divisions_data={divisions_data}
                    paginationLinks={notStarted.links}
                    paginationCurrentPage={notStarted.current_page}
                    paginationPerPage={notStarted.per_page}
                    paginationTotal={notStarted.total}
                    paginationLastPage={notStarted.last_page}
                    editData={editDataNotStarted}
                    setEditData={setEditDataNotStarted}
                    postEditData={postEditDataNotStarted}
                    editProcessing={editProcessingNotStarted}
                    resetEditData={resetEditDataNotStarted}
                    editErrors={editErrorsNotStarted}
                    tableType="not_started"
                />

                <TaskTable
                    data={inProgress.data}
                    employees_data={employees_data}
                    divisions_data={divisions_data}
                    paginationLinks={inProgress.links}
                    paginationCurrentPage={inProgress.current_page}
                    paginationPerPage={inProgress.per_page}
                    paginationTotal={inProgress.total}
                    paginationLastPage={inProgress.last_page}
                    editData={editDataInProgress}
                    setEditData={setEditDataInProgress}
                    postEditData={postEditDataInProgress}
                    editProcessing={editProcessingInProgress}
                    resetEditData={resetEditDataInProgress}
                    editErrors={editErrorsInProgress}
                    tableType="in_progress"
                />

                <TaskTable
                    data={completed.data}
                    employees_data={employees_data}
                    divisions_data={divisions_data}
                    paginationLinks={completed.links}
                    paginationCurrentPage={completed.current_page}
                    paginationPerPage={completed.per_page}
                    paginationTotal={completed.total}
                    paginationLastPage={completed.last_page}
                    editData={editDataCompleted}
                    setEditData={setEditDataCompleted}
                    postEditData={postEditDataCompleted}
                    editProcessing={editProcessingCompleted}
                    resetEditData={resetEditDataCompleted}
                    editErrors={editErrorsCompleted}
                    tableType="completed"
                />
            </MainContainer>

        </AuthenticatedLayout >
    )
}
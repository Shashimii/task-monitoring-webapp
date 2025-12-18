import MainContainer from '@/Components/DivContainer/MainContainer';
import PrimaryCard from '@/Components/DivContainer/PrimaryCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TableContainer from '@/Components/DivContainer/TableContainer';
import Table from '@/Components/Table/Table';
import TableHeader from '@/Components/Table/TableHeader';
import TableRow from '@/Components/Table/TableRow';
import TableData from '@/Components/Table/TableData';
import StatusContainer from '@/Components/Misc/StatusContainer';
import Badge from '@/Components/Misc/Badge';
import DivisionContainer from '@/Components/Misc/DivisionContainer';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard({ task_counts = {}, recent_tasks = [], tasks_by_division = [] }) {
    const { auth } = usePage().props;

    // Redirect to login if not authenticated (prevents back navigation after logout)
    useEffect(() => {
        if (!auth.user) {
            // Use window.location.replace for hard redirect that clears history
            window.location.replace('/');
        }
    }, [auth.user]);
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

    // Mobile Card Components
    const RecentTaskCard = ({ task }) => {
        return (
            <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
                <div className="space-y-3">
                    <div>
                        <Link
                            href={route('task.index')}
                            className="text-lg font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            {task.name}
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Status:</span>
                            <div className="mt-1">
                                <StatusContainer bgcolor={StatusColor(task?.status)}>
                                    {task?.status}
                                </StatusContainer>
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                            <div className="mt-1">
                                <Badge bgcolor={PriorityColor(task?.priority)}>
                                    {task?.priority}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Assignee:</span>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                            {task?.employee ? `${task.employee.first_name} ${task.employee.last_name}` : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const DivisionCard = ({ division }) => {
        return (
            <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
                <div className="space-y-4">
                    <div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Division:</span>
                        <div className="mt-2">
                            <DivisionContainer bgcolor={division.division_color}>
                                {division.division_name}
                            </DivisionContainer>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Not Started:</span>
                            <p className="text-lg font-bold text-gray-600 dark:text-gray-400 mt-1">
                                {division.not_started || 0}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">In Progress:</span>
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                                {division.in_progress || 0}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Completed:</span>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                {division.completed || 0}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total:</span>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {division.total_tasks || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <MainContainer>
                <div className="space-y-12">
                    {/* Task Count Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <PrimaryCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Started</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                        {task_counts.not_started || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-600 dark:text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </PrimaryCard>

                        <PrimaryCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                                        {task_counts.in_progress || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-600 dark:text-orange-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </PrimaryCard>

                        <PrimaryCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                                        {task_counts.completed || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600 dark:text-green-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </PrimaryCard>

                        <PrimaryCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                        {task_counts.total || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                    </svg>
                                </div>
                            </div>
                        </PrimaryCard>
                    </div>

                    {/* Tasks by Division */}
                    <div>
                        <TableContainer
                            tableTitle="Tasks by Division"
                            borderColor="border-purple-500"
                        >
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <Table
                                    thead={
                                        <tr>
                                            <TableHeader>Division</TableHeader>
                                            <TableHeader>Not Started</TableHeader>
                                            <TableHeader>In Progress</TableHeader>
                                            <TableHeader>Completed</TableHeader>
                                            <TableHeader>Total</TableHeader>
                                        </tr>
                                    }
                                    tbody={
                                        <>
                                            {tasks_by_division.length > 0 ? (
                                                tasks_by_division.map(division => (
                                                    <TableRow key={division.id}>
                                                        <TableData>
                                                            <DivisionContainer bgcolor={division.division_color}>
                                                                {division.division_name}
                                                            </DivisionContainer>
                                                        </TableData>
                                                        <TableData>
                                                            <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                                                {division.not_started || 0}
                                                            </span>
                                                        </TableData>
                                                        <TableData>
                                                            <span className="text-orange-600 dark:text-orange-400 font-semibold">
                                                                {division.in_progress || 0}
                                                            </span>
                                                        </TableData>
                                                        <TableData>
                                                            <span className="text-green-600 dark:text-green-400 font-semibold">
                                                                {division.completed || 0}
                                                            </span>
                                                        </TableData>
                                                        <TableData>
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                                                {division.total_tasks || 0}
                                                            </span>
                                                        </TableData>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow
                                                    colspan={5}
                                                >
                                                    No task by division
                                                </TableRow>
                                            )}
                                        </>
                                    }
                                />
                            </div>

                            {/* Mobile Card View */}
                            <div className="block md:hidden">
                                {tasks_by_division.length > 0 ? (
                                    tasks_by_division.map(division => (
                                        <DivisionCard key={division.id} division={division} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No task by division
                                    </div>
                                )}
                            </div>
                        </TableContainer>
                    </div>

                    {/* Recent Tasks */}
                    <div>
                        <TableContainer
                            tableTitle="Recent Tasks"
                            borderColor="border-blue-500"
                        >
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <Table
                                    thead={
                                        <tr>
                                            <TableHeader>Task Name</TableHeader>
                                            <TableHeader>Status</TableHeader>
                                            <TableHeader>Priority</TableHeader>
                                            <TableHeader>Assignee</TableHeader>
                                        </tr>
                                    }
                                    tbody={
                                        <>
                                            {recent_tasks.length > 0 ? (
                                                recent_tasks.map(task => (
                                                    <TableRow key={task.id}>
                                                        <TableData>
                                                            <Link
                                                                href={route('task.index')}
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                            >
                                                                {task.name}
                                                            </Link>
                                                        </TableData>
                                                        <TableData>
                                                            <StatusContainer bgcolor={StatusColor(task?.status)}>
                                                                {task?.status}
                                                            </StatusContainer>
                                                        </TableData>
                                                        <TableData>
                                                            <Badge bgcolor={PriorityColor(task?.priority)}>
                                                                {task?.priority}
                                                            </Badge>
                                                        </TableData>
                                                        <TableData>
                                                            {task?.employee ? `${task.employee.first_name} ${task.employee.last_name}` : 'N/A'}
                                                        </TableData>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow
                                                    colspan={4}
                                                >
                                                    No recent task found
                                                </TableRow>
                                            )}
                                        </>
                                    }
                                />
                            </div>

                            {/* Mobile Card View */}
                            <div className="block md:hidden">
                                {recent_tasks.length > 0 ? (
                                    recent_tasks.map(task => (
                                        <RecentTaskCard key={task.id} task={task} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No recent task found
                                    </div>
                                )}
                            </div>
                        </TableContainer>
                    </div>

                    <div>
                        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
                            <div className="px-2 flex items-center">
                                <div className="text-xl">
                                    ADD TASK
                                </div>
                                <div className="w-full space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            <p className="text-sm font-semibold">20/20/2025</p>
                                            <p className="text-sm font-semibold">Task Added</p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <p className="text-sm">ED</p>
                                            <p className="text-sm">Not Started</p>
                                            <p className="text-sm">01/01/2026</p>
                                            <p className="text-sm">High</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="text-2xl">New Task Name Here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </MainContainer>
        </AuthenticatedLayout>
    );
}

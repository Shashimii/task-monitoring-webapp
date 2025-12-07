import { useState, useEffect } from 'react'
import { router } from "@inertiajs/react";
import { SelectItem } from "@/components/ui/select"
import TableContainer from "../DivContainer/TableContainer";
import Table from "./Table";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableData from "./TableData";
import Pagination from "../Misc/Pagination";
import PrimaryInput from "../Form/PrimaryInput";
import SelectInput from "../Form/SelectInput";


export default function TaskTable({
    borderColor = "border-blue-500",
    tableIcon = "icon",
    tableTitle = "tableTitle",
    data,
    paginationLinks = [],
    paginationCurrentPage,
    paginationPerPage,
    paginationTotal,
    paginationLastPage,
    tableType,
}) {
    // Url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Url Parms
    let search = urlParams.get(`${tableType}_search`) || '';
    let sort = urlParams.get(`${tableType}_sort`) || 'desc';
    let page = urlParams.get(`${tableType}_page`) || 1;

    // Clean Sort Value
    if (sort !== 'asc' && sort !== 'desc') {
        sort = 'desc';
    }

    // State
    const [searchValues, setSearchValues] = useState(search || '');
    const [sortValues, setSortValues] = useState(sort || 'desc');
    const [pageValues, setPageValues] = useState(page || 1);

    // Set
    const handleSearchChange = (value) => {
        setSearchValues(value);
        setPageValues(1);
    }

    const handleSortChange = (value) => {
        setSortValues(value);
    }

    // Effects
    useEffect(() => {
        const sortParam = `${tableType}_sort`;
        const searchParam = `${tableType}_search`;
        const pageParam = `${tableType}_page`;

        const searchUrl = {
            [sortParam]: sortValues,
            [searchParam]: searchValues,
            [pageParam]: pageValues,
        }


        router.get(route('task.index'), searchUrl, {
            preserveState: true,
            preserveScroll: true,
        })
    }, [sortValues, searchValues, tableType]);


    const HEADER_CONTENT = (
        <div className="flex gap-4">
            <PrimaryInput
                type="text"
                placeholder="Search Tasks..."
                value={searchValues}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1 w-[22rem]"
            />
            <SelectInput
                placeholder="Sort Order"
                value={sortValues}
                onChange={(value) => handleSortChange(value)}
            >
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
            </SelectInput>
        </div>
    )

    const THEAD_CONTENT = (
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

    const TBODY_CONTENT = (
        <>
            {data.length === 0 &&
                (
                    <TableRow>
                        <TableData colSpan={8} className="text-center">
                            No tasks found.
                        </TableData>
                    </TableRow>
                )
            }

            {data.map(task => (
                <TableRow key={task.id}>
                    <TableData>
                        {task?.name}
                    </TableData>
                    <TableData>
                        {task?.employee?.first_name} {task?.employee?.last_name}
                    </TableData>
                    <TableData>
                        {task?.division?.division_name}
                    </TableData>
                    <TableData>
                        {task?.last_action}
                    </TableData>
                    <TableData>
                        {task?.status}
                    </TableData>
                    <TableData>
                        {task?.due_date}
                    </TableData>
                    <TableData>
                        {task?.priority}
                    </TableData>
                    <TableData>

                    </TableData>
                </TableRow>
            ))}
        </>
    )


    return (
        <TableContainer
            borderColor={borderColor}
            tableIcon={tableIcon}
            tableTitle={tableTitle}
            headerContent={HEADER_CONTENT}
        >
            <Table
                thead={THEAD_CONTENT}
                tbody={TBODY_CONTENT}
            />

            <Pagination
                links={paginationLinks}
                current_page={paginationCurrentPage}
                per_page={paginationPerPage}
                total={paginationTotal}
                last_page={paginationLastPage}
                tableType={tableType}
            />
        </TableContainer>
    );
}
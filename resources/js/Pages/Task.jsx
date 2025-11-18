import ModalToggle from "@/Components/Button/ModalToggle";
import Modal from "@/Components/Modal";
import MainContainer from "@/Components/DivContainer/MainContainer";
import PrimaryCard from "@/Components/DivContainer/PrimaryCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
'use client'

import { useState } from 'react'
import { Head } from "@inertiajs/react";

export default function Task() {
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


    // Add Modal
    const ADD_MODAL_TITLE = "Add Task"
    const ADD_MODAL_CONTENT = (
        <>
            INPUT FIELD
        </>
    )
    const ADD_MODAL_FOOTER = (
        <>
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
            >
                Deactivate
            </button>
            <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
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
                <PrimaryCard>
                </PrimaryCard>
            </MainContainer>

            <Modal
                open={open}
                setOpen={setOpen}
                Title={ADD_MODAL_TITLE}
                Content={ADD_MODAL_CONTENT}
                Footer={ADD_MODAL_FOOTER}
            >

            </Modal>
        </AuthenticatedLayout>
    )
}
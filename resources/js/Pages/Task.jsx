import ModalToggle from "@/Components/Button/ModalToggle";
import MainContainer from "@/Components/DivContainer/MainContainer";
import PrimaryCard from "@/Components/DivContainer/PrimaryCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Task() {
    const HEADER_CONTENT = (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Tasks
            </h2>

            <ModalToggle>
                Add Task
            </ModalToggle>
        </div>
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
        </AuthenticatedLayout>
    )
}
import MainContainer from "@/Components/DivContainer/MainContainer";
import PrimaryCard from "@/Components/DivContainer/PrimaryCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Task() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Tasks
                </h2>
            }
        >
            <Head title="Tasks" />
            
            <MainContainer>
                <PrimaryCard>
                    
                </PrimaryCard>
            </MainContainer>
        </AuthenticatedLayout>
    )
}
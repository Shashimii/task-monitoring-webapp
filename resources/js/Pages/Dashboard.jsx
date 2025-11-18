import MainContainer from '@/Components/DivContainer/MainContainer';
import PrimaryCard from '@/Components/DivContainer/PrimaryCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
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
                <PrimaryCard>
                    <div className="text-gray-900 dark:text-gray-100">
                        You're logged in!
                    </div>
                </PrimaryCard>
            </MainContainer>
        </AuthenticatedLayout>
    );
}

import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import PrimaryInput from '@/Components/Form/PrimaryInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="flex flex-col items-center justify-center">
                <div className="max-w-120 flex-col items-center justify-center space-y-20">
                    <div className="space-y-10 pt-20 px-4 md:px-0 pt-0">
                        <div className="flex items-center justify-center w-full md:hidden">
                            <img
                                src="/assets/logo.png"
                                alt="denr"
                                width={100}
                                height={100}
                                className="rounded-full shadow-lg shadow-green-200/50"
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="font-medium text-2xl md:text-3xl text-center">
                                Task Management System
                            </p>
                            <p className="text-gray-600 text-center">
                                Please enter your Login credentials.
                            </p>
                        </div>
                        <form className="w-full space-y-4">
                            <PrimaryInput
                                type="text"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                autocomplete="email"
                                error={errors.email}
                            />
                            <PrimaryInput
                                type="password"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                autocomplete="password"
                                error={errors.password}
                            />

                            <PrimaryButton
                                text="Login"
                                disabled={processing}
                                onClick={submit}
                            />
                            <p className="text-gray-600 text-center mt-2">
                                For
                                <span className="text-green-600"> DENR NCR </span>
                                employees only.
                            </p>
                        </form>
                        <div className="mt-60 flex items-center justify-center">
                            <span className="text-green-600 font-semibold"> © DENR NCR 2025</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden bg-gradient-to-br from-green-400 via-green-600 to-green-300 md:flex items-center justify-center">
                <img
                    src="/assets/logo.png"
                    alt="denr"
                    width={300}
                    height={300}
                    className="rounded-full shadow-lg shadow-green-900/50"
                />
            </div>
        </GuestLayout>
    );
}

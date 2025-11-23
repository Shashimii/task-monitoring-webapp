import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const REGISTRATION_CODE = '2684';

export default function Register() {
    const [codeVerified, setCodeVerified] = useState(false);
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');

    const verifyCode = (e) => {
        e.preventDefault();
        if (code === REGISTRATION_CODE) {
            setCodeVerified(true);
            setCodeError('');
        } else {
            setCodeError('Invalid code. Please try again.');
            setCode('');
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Show code verification form if not verified
    if (!codeVerified) {
        return (
            <GuestLayout>
                <Head title="Register - Code Verification" />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Registration Code Required
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Please enter the 4-digit registration code to continue.
                            </p>
                        </div>
                        <form onSubmit={verifyCode} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="code" value="Registration Code" />
                                <TextInput
                                    id="code"
                                    type="text"
                                    name="code"
                                    value={code}
                                    className="mt-1 block w-full text-center text-2xl tracking-widest"
                                    autoComplete="off"
                                    maxLength={4}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        setCode(value);
                                        setCodeError('');
                                    }}
                                    placeholder="0000"
                                    required
                                    autoFocus
                                />
                                {codeError && (
                                    <InputError message={codeError} className="mt-2" />
                                )}
                            </div>
                            <PrimaryButton type="submit" className="w-full">
                                Verify Code
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="font-semibold text-3xl dark:text-white">Add new user account</h1>
                <form onSubmit={submit} className="w-full px-12">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <Link
                            href={route('login')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="ms-4" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </div>
                </form>
                <p className="font-semibold text-sm text-red-600">App Version 0.9 - initial</p>
            </div>
        </GuestLayout>
    );
}

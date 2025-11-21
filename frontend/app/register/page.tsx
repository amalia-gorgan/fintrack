'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/TextInput';
import FintrackLogo from '@/components/FintrackLogo';

interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type RegisterFormErrors = Partial<RegisterFormState>;

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState<RegisterFormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setGeneralError('');
    };

    const validate = (): boolean => {
        const newErrors: RegisterFormErrors = {};

        if (!form.firstName.trim()) {
            newErrors.firstName = 'First name is required.';
        }

        if (!form.lastName.trim()) {
            newErrors.lastName = 'Last name is required.';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Enter a valid email address.';
        }

        if (!form.password) {
            newErrors.password = 'Password is required.';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setGeneralError('');

        try {
            // 1) Call REGISTER endpoint
            const registerRes = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    firstName: form.firstName,
                    lastName: form.lastName,
                }),
            });

            if (!registerRes.ok) {
                let message = 'Registration failed. Please try again.';
                try {
                    const data = await registerRes.json();
                    if (data?.message) message = data.message;
                } catch {
                    // ignore JSON parse errors
                }
                throw new Error(message);
            }

            // 2) Auto-login right after successful register
            const loginRes = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            if (!loginRes.ok) {
                let message = 'Registered, but automatic login failed. Please log in manually.';
                try {
                    const data = await loginRes.json();
                    if (data?.message) message = data.message;
                } catch {
                    // ignore JSON parse errors
                }
                throw new Error(message);
            }

            const loginData = await loginRes.json();
            // adjust this if your backend uses a different property name than "token"
            if (loginData.token) {
                localStorage.setItem('token', loginData.token);
            }

            // 3) Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setGeneralError(err.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-sky-200 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <div className="mb-6 flex flex-col items-center text-center">
                    <FintrackLogo size="sm" />
                    <h1 className="mt-4 text-2xl font-semibold text-slate-900">
                        Create your account
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Start tracking your money in just a few steps.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {generalError && (
                        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {generalError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextInput
                            label="First name"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Jane"
                            autoComplete="given-name"
                            error={errors.firstName}
                        />

                        <TextInput
                            label="Last name"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            autoComplete="family-name"
                            error={errors.lastName}
                        />
                    </div>

                    <TextInput
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        error={errors.email}
                    />

                    <TextInput
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        error={errors.password}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 w-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {submitting ? 'Creating account…' : 'Sign up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/" className="font-medium text-blue-600 hover:underline">
                        Go back to login
                    </Link>
                </p>
            </div>
        </main>
    );
}

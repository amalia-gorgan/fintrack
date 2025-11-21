'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/TextInput';
import FintrackLogo from '@/components/FintrackLogo';

export default function LandingPage() {
    const router = useRouter();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            if (!res.ok) {
                let msg = 'Login failed.';
                try {
                    const data = await res.json();
                    if (data?.message) msg = data.message;
                } catch {}
                throw new Error(msg);
            }

            // Read JSON (your backend should return the token here)
            const data = await res.json();
            console.log('Login response:', data);

            // Example: backend returns { token: "..." }
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // Redirect to dashboard (or change to your route)
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-sky-200 px-4">
            <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:flex-row">

                {/* Left side */}
                <section className="flex-1 bg-slate-50 px-8 py-10 md:px-10">
                    <div className="mb-6 inline-block rounded-2xl bg-slate-100 px-6 py-3">
                        <h1 className="text-3xl font-semibold text-slate-900">Welcome!</h1>
                    </div>

                    <div className="mb-6 flex h-40 w-64 items-center justify-center pl-30">
                        <FintrackLogo size="lg" />
                    </div>

                    <div className="space-y-3">
                        <div className="inline-block rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                            Track your income, expenses, and savings all in one place.
                        </div>
                        <div className="inline-block rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                            Get a simple overview of where your money is going.
                        </div>
                    </div>
                </section>

                {/* Right side — login */}
                <section className="flex-1 bg-slate-100 px-8 py-10 md:px-10">
                    <div className="mx-auto max-w-sm">
                        <div className="mb-6 rounded-xl bg-white px-4 py-2 text-center shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Login or Signup?
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
                                    {error}
                                </div>
                            )}

                            <TextInput
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />

                            <TextInput
                                label="Password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:brightness-110 disabled:opacity-70"
                            >
                                {loading ? 'Logging in…' : 'Login'}
                            </button>
                        </form>

                        <p className="mt-6 flex items-center justify-between text-sm text-slate-700">
                            <span>Create a new account?</span>
                            <Link
                                href="/register"
                                className="rounded-md bg-white px-3 py-1 text-xs font-medium text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                            >
                                click here
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

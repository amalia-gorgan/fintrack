'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MeResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    // add more fields here if your /me returns them
}

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<MeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // no token = not logged in
                    router.push('/');
                    return;
                }

                const res = await fetch('http://localhost:8000/api/auth/me', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    // token invalid/expired -> kick back to login
                    localStorage.removeItem('token');
                    router.push('/');
                    return;
                }

                if (!res.ok) {
                    throw new Error('Failed to load user data.');
                }

                const data: MeResponse = await res.json();
                setUser(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    // Loading state
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-sky-200">
                <div className="rounded-2xl bg-white px-6 py-4 text-sm text-slate-600 shadow">
                    Loading your dashboard…
                </div>
            </main>
        );
    }

    // Error state
    if (error || !user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-sky-200">
                <div className="rounded-2xl bg-white px-6 py-4 text-sm text-red-600 shadow">
                    {error || 'Could not load user data.'}
                </div>
            </main>
        );
    }

    // Normal state
    return (
        <main className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-sky-200">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col border-r border-slate-200 bg-white/90 p-4 shadow-lg">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Account
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                </div>

                <nav className="flex-1 space-y-2 text-sm">
                    <button className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-left font-medium text-blue-700">
                        <span>Profile settings</span>
                    </button>

                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100">
                        <span>Billing (coming soon)</span>
                    </button>

                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100">
                        <span>Notifications (coming soon)</span>
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-4 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                >
                    Logout
                </button>
            </aside>

            {/* Main content */}
            <section className="flex flex-1 flex-col px-8 py-6">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Hello, {user.firstName}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Here&apos;s an overview of your budget.
                        </p>
                    </div>
                </header>

                {/* Placeholder content – you can replace this with real budget widgets later */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Total balance
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">€0.00</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Connect accounts to see your balance.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            This month&apos;s spending
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">€0.00</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Start adding expenses to track spending.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Upcoming bills
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
                        <p className="mt-1 text-xs text-slate-500">
                            No upcoming bills yet.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

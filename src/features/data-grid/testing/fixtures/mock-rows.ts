export interface MockUserRow {
    id: string;
    name: string;
    email: string;
    age: number;
    status: 'active' | 'inactive' | 'pending';
    role: 'admin' | 'user' | 'manager';
    balance: number;
    progress: number;
    createdAt: string;
    isVerified: boolean;
}

export const mockRows: MockUserRow[] = [
    {
        id: '1',
        name: 'علی رضایی',
        email: 'ali@example.com',
        age: 32,
        status: 'active',
        role: 'admin',
        balance: 1250000,
        progress: 75,
        createdAt: '2026-01-12T10:30:00.000Z',
        isVerified: true,
    },
    {
        id: '2',
        name: 'سارا محمدی',
        email: 'sara@example.com',
        age: 27,
        status: 'pending',
        role: 'manager',
        balance: 840000,
        progress: 48,
        createdAt: '2026-02-03T14:10:00.000Z',
        isVerified: false,
    },
    {
        id: '3',
        name: 'رضا کریمی',
        email: 'reza@example.com',
        age: 41,
        status: 'inactive',
        role: 'user',
        balance: 320000,
        progress: 20,
        createdAt: '2026-03-22T08:45:00.000Z',
        isVerified: true,
    },
    {
        id: '4',
        name: 'نگار احمدی',
        email: 'negar@example.com',
        age: 35,
        status: 'active',
        role: 'manager',
        balance: 2100000,
        progress: 92,
        createdAt: '2026-04-15T16:25:00.000Z',
        isVerified: true,
    },
];

import type { ColumnDef } from '../../core/types';
import type { MockUserRow } from './mock-rows';

export const mockColumns: Array<ColumnDef<MockUserRow>> = [
    {
        id: 'name',
        accessorKey: 'name',
        header: 'نام',
        type: 'text',
        size: 180,
    } as any,
    {
        id: 'email',
        accessorKey: 'email',
        header: 'ایمیل',
        type: 'email',
        size: 220,
    } as any,
    {
        id: 'age',
        accessorKey: 'age',
        header: 'سن',
        type: 'number',
        size: 100,
    } as any,
    {
        id: 'status',
        accessorKey: 'status',
        header: 'وضعیت',
        type: 'badge',
        size: 130,
        meta: {
            badgeMap: {
                active: {
                    label: 'فعال',
                    variant: 'success',
                },
                inactive: {
                    label: 'غیرفعال',
                    variant: 'muted',
                },
                pending: {
                    label: 'در انتظار',
                    variant: 'warning',
                },
            },
        },
    } as any,
    {
        id: 'role',
        accessorKey: 'role',
        header: 'نقش',
        type: 'text',
        size: 130,
    } as any,
    {
        id: 'balance',
        accessorKey: 'balance',
        header: 'موجودی',
        type: 'currency',
        size: 160,
    } as any,
    {
        id: 'progress',
        accessorKey: 'progress',
        header: 'پیشرفت',
        type: 'percent',
        size: 130,
    } as any,
    {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: 'تاریخ ایجاد',
        type: 'datetime',
        size: 180,
    } as any,
    {
        id: 'isVerified',
        accessorKey: 'isVerified',
        header: 'تأیید شده',
        type: 'boolean',
        size: 120,
    } as any,
];

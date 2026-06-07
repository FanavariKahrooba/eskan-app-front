# Data Grid Feature

یک DataGrid ماژولار، قابل توسعه و type-safe برای نمایش و مدیریت داده‌های جدولی.

## ساختار اصلی

````txt
data-grid/
├─ core/
│  ├─ types/
│  ├─ engine/
│  ├─ registries/
│  ├─ permissions/
│  └─ utils/
├─ store/
├─ hooks/
├─ plugins/
├─ renderers/
├─ lib/
├─ constants/
├─ styles/
├─ testing/
└─ index.ts

## بخش‌ها

### `core/types`

قراردادهای اصلی DataGrid شامل:

- ColumnDef
- DataGridState
- DataGridConfig
- DataGridApi
- DataGridPlugin
- SortState
- FilterState
- PaginationState

### `core/engine`

موتور پردازش داده‌ها:

- search
- filters
- sorting
- pagination
- column visibility
- column order
- row expansion
- grouping
- aggregation

### `store`

مدیریت state جدول.

### `hooks`

اتصال store، engine، plugins و api به React.

### `plugins`

افزونه‌ها برای قابلیت‌هایی مثل:

- column resize
- column dnd
- row selection
- inline editing
- export
- virtualization

### `renderers`

رندررهای سلول، ادیتور و فیلتر.

### `lib`

توابع کمکی سطح بالا برای normalize کردن config، columns، plugins و ساخت state.

### `testing`

fixture و ابزارهای mock برای تست و Storybook.

## نمونه استفاده

tsx
import {
  createMockGrid,
  normalizeDataGridConfig,
} from '@/features/data-grid';

const config = normalizeDataGridConfig(createMockGrid({
  rowCount: 50,
}));

## Import کردن استایل‌ها

ts
import '@/features/data-grid/styles';

## قدم بعدی پیشنهادی

بعد از تکمیل این بخش‌ها، بهتر است UI اصلی ساخته شود:

txt
ui/
├─ data-grid.tsx
├─ data-grid-provider.tsx
├─ data-grid-context.tsx
├─ layout/
├─ header/
├─ body/
├─ toolbar/
├─ pagination/
└─ overlays/


---

# نکته مهم

اگر در پروژه‌ات `ColumnDef` فیلدهایی مثل `accessorKey`, `type`, `size`, `meta` را ندارد، یا اسمشان فرق دارد، فقط فایل‌های زیر نیاز به هماهنگ‌سازی دارند:

```txt
lib/normalize-columns.ts
lib/create-row-model.ts
testing/fixtures/mock-columns.ts
````

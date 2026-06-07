import type { HTMLAttributes, ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// export interface DataGridToolbarProps extends HTMLAttributes<HTMLDivElement> {
//   children?: ReactNode;

//   /**
//    * عنوان بالای جدول
//    */
//   title?: ReactNode;

//   /**
//    * توضیح کوتاه زیر عنوان
//    */
//   subtitle?: ReactNode;

//   /**
//    * اکشن‌های سمت مقابل عنوان
//    */
//   actions?: ReactNode;

//   /**
//    * محتوای سمت شروع، در صورت نیاز
//    */
//   start?: ReactNode;

//   /**
//    * محتوای سمت پایان، در صورت نیاز
//    */
//   end?: ReactNode;
// }

export function DataGridToolbar({
  children,
  title,
  subtitle,
  actions,
  start,
  end,
  className,
  ...props
}: any) {
  const hasTitleBlock = Boolean(title || subtitle);
  const rightContent =
    start ??
    (hasTitleBlock ? (
      <div className="min-w-0">
        {title ? (
          <h2 className="truncate text-base font-black text-slate-900 md:text-lg">
            {title}
          </h2>
        ) : null}

        {subtitle ? (
          <p className="mt-1 text-xs leading-6 text-slate-500 md:text-sm">
            {subtitle}
          </p>
        ) : null}
      </div>
    ) : null);

  const leftContent = end ?? actions;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {rightContent ? (
            <div className="flex min-w-0 items-center gap-3">
              {rightContent}
            </div>
          ) : null}

          {leftContent ? (
            <div className="flex flex-wrap items-center gap-2">
              {leftContent}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

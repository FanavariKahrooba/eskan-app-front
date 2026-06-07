import { ReactNode } from "react";
import Breadcrumb from "../layout/breadcrumb";
import FavoriteButton from "../layout/favorite-button";

interface Props {
  title: string;
  currentPath: string;

  subtitle?: string;
  description?: string;

  actions?: ReactNode;
  tabs?: ReactNode;
  toolbar?: ReactNode;
  stats?: ReactNode;

  enableFavorite?: boolean;
  maxWidth?: string;
}

export default function PageHeader({
  title,
  currentPath,
  subtitle,
  description,
  actions,
  tabs,
  toolbar,
  stats,
  enableFavorite = false,
  maxWidth = "max-w-[1600px]",
}: Props) {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur border border-gray-200">
      <Breadcrumb currentPath={currentPath} />

      {/* title */}
      <div className={`${maxWidth} mx-auto px-4 md:px-6 py-3`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                {title}
              </h1>

              {subtitle && (
                <span className="text-xs text-gray-500 hidden sm:block">
                  {subtitle}
                </span>
              )}

              {enableFavorite && <FavoriteButton page={currentPath} />}
            </div>

            {description && (
              <p className="text-xs text-gray-500 mt-0.5 max-w-xl hidden md:block">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      </div>

      {tabs && (
        <div
          className={`${maxWidth} mx-auto px-4 md:px-6 border-t border-gray-100`}
        >
          {tabs}
        </div>
      )}

      {toolbar && (
        <div
          className={`${maxWidth} mx-auto px-4 md:px-6 py-2 border-t border-gray-100`}
        >
          {toolbar}
        </div>
      )}

      {stats && (
        <div
          className={`${maxWidth} mx-auto px-4 md:px-6 py-3 border-t border-gray-100`}
        >
          {stats}
        </div>
      )}
    </header>
  );
}

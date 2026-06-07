export default function UnauthorizedConsoleLayout({ children }: any) {
  return (
    <>
      <main className="relative  w-full bg-gray-50 dark:bg-gray-800 overflow-x-hidden px-2 h-full">
        {children}
      </main>
    </>
  );
}

export default function MobileTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="flex flex-col lg:h-screen lg:flex-row">
        <div className="flex h-full items-center justify-center bg-gray-100 lg:w-1/2">
          <div className="h-[667px] w-[375px] rounded-lg border bg-white shadow-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}

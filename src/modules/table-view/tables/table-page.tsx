import FloorMap from "./components/floor-map";

export default function TablesPage() {
  return (
    <div className="h-screen bg-neutral-950 p-8 text-white">
      <div className="mb-6 text-2xl font-semibold">نقشه سالن</div>

      <div className="h-[80vh]">
        <FloorMap />
      </div>
    </div>
  );
}

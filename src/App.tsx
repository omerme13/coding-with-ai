import { useState } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import FloorPlanViewer from "./components/FloorPlanViewer";

// Provided layout. You may change it if your design needs it.
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <h1 className="text-base font-semibold">Floor Plan Viewer</h1>
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          {sidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          Toggle sidebar
        </button>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <main className="relative min-h-0 min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-200">
          <FloorPlanViewer />
        </main>

        {sidebarOpen && (
          <aside className="w-72 shrink-0 rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold">Pins</h2>
            <p className="text-sm text-slate-500">The pin list goes here.</p>
          </aside>
        )}
      </div>
    </div>
  );
}

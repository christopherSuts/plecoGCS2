import LeafletMap from '../components/Map';

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 text-black">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="font-bold text-xl">Logo AMV</h1>
        <button className="text-2xl">☰</button>
      </header>

      {/* Map & Log */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 bg-gray-200 flex flex-col items-center p-2 space-y-2">
          <button className="w-10 h-10 bg-red-500 text-white rounded">+</button>
          <button className="w-10 h-10 bg-white border rounded">🗒️</button>
          <button className="w-10 h-10 bg-white border rounded">H</button>
          <button className="w-10 h-10 bg-white border rounded">◻</button>
          <button className="w-10 h-10 bg-red-500 text-white rounded">Z</button>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col p-2 overflow-auto">
          {/* Top Status + Map */}
          <div className="flex flex-1">
            {/* Depth + Info */}
            <div className="w-40 bg-white shadow mr-2 p-2 space-y-2">
              <div className="text-xs">Long: ...<br />Lat: ...<br />Depth:</div>
              <div className="h-48 bg-gradient-to-b from-red-500 to-purple-500 w-8 mx-auto" />
              <div className="text-xs text-center">0m - max</div>
            </div>

            {/* Map + Indicators */}
            <div className="flex-1 bg-white shadow p-2 relative">
              <div className="absolute inset-0 z-0"><LeafletMap /></div>
              <div className="absolute top-2 right-2 bg-red-200 p-2 text-xs">project x controls</div>
              <div className="absolute top-2 left-2 text-xs">Sat: ... Fix: ...</div>
              <div className="w-20 h-20 bg-blue-100 rounded-full absolute right-20 top-12 flex items-center justify-center">Yaw</div>
              <div className="w-20 h-20 bg-blue-100 rounded-full absolute right-2 top-12 flex items-center justify-center text-center text-xs">Roll<br />Pitch</div>
            </div>

            {/* Status Box */}
            <div className="w-48 bg-white shadow ml-2 p-2 space-y-2 text-xs">
              <div className="bg-gray-200 p-1">Thrust: ON</div>
              <div className="bg-gray-200 p-1">Batt: 16V - 100%</div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex mt-2 space-x-2">
            {/* Log / Console */}
            <div className="flex-1 bg-white shadow p-2">
              <div className="h-20 overflow-y-scroll text-xs">Log view</div>
              <div className="mt-2 flex items-center space-x-2">
                <label><input type="checkbox" checked readOnly /> Center</label>
                <span>MODE: ...</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-gray-300 p-2 rounded">Manual</button>
              <button className="bg-gray-300 p-2 rounded">Auto</button>
              <button className="bg-gray-300 p-2 rounded">Send WP</button>
              <button className="bg-gray-300 p-2 rounded">RTL</button>
              <button className="bg-gray-300 p-2 rounded col-span-2">Connect</button>
              <button className="bg-gray-300 p-2 rounded col-span-2">Cloud ⛅</button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center text-xs p-2 shadow">
        &copy; 2025 AMV UI GCS
      </footer>
    </div>
  );
}

import MapWrapper from "../components/MapWrapper";

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
              <div className="text-xs">
                Long: ...
                <br />
                Lat: ...
                <br />
                Depth:
              </div>
              <div className="h-48 bg-gradient-to-b from-red-500 to-purple-500 w-8 mx-auto" />
              <div className="text-xs text-center">0m - max</div>
            </div>

            <div className="flex-1 bg-white shadow p-2 relative">
              <div className="absolute inset-0 z-0">
                <MapWrapper />
              </div>

              {/* GPS Info */}
              <div className="absolute top-2 right-2 bg-red-200 p-2 text-xs">
                Sat: ... Fix: ...
              </div>

              {/* Indicator Panel */}
              <div className="absolute top-16 right-2 grid grid-cols-2 gap-2">
                {/* Roll */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center">
                    {/* Simbol Roll */}
                    <div className="w-6 h-6 bg-red-400 rounded-full" />
                  </div>
                  <div className="mt-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                    R: -1.8
                  </div>
                </div>

                {/* Heading */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-black border rounded-full flex items-center justify-center">
                    {/* Simbol Heading */}
                    <div className="w-7 h-7">
                      <img src="/imuIndicator/yaw.png"/>
                    </div>
                  </div>
                  <div className="mt-1 bg-black text-white text-[10px] px-2 py-0.5 rounded leading-tight text-center">
                    H: -148.0
                    <br />
                    C: -132.0
                  </div>
                </div>

                {/* Pitch */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center">
                    {/* Simbol Pitch */}
                    <div className="w-8 h-4 bg-red-400 rounded" />
                  </div>
                  <div className="mt-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                    P: 2.3
                  </div>
                </div>

                {/* Left/Right Thruster */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center">
                    {/* Simbol Netral */}
                    <div className="w-3 h-3 bg-black rounded-full" />
                  </div>
                  <div className="mt-1 bg-black text-white text-[10px] px-2 py-0.5 rounded leading-tight text-center">
                    L: +0.2
                    <br />
                    R: +0.0
                  </div>
                </div>
              </div>
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
                <label>
                  <input type="checkbox" checked readOnly /> Center
                </label>
                <span>MODE: ...</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-gray-300 p-2 rounded">Manual</button>
              <button className="bg-gray-300 p-2 rounded">Auto</button>
              <button className="bg-gray-300 p-2 rounded">Send WP</button>
              <button className="bg-gray-300 p-2 rounded">RTL</button>
              <button className="bg-gray-300 p-2 rounded col-span-2">
                Connect
              </button>
              <button className="bg-gray-300 p-2 rounded col-span-2">
                Cloud ⛅
              </button>
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

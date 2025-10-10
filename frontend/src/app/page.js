"use client";
import { useState, useCallback } from "react";
import MapWrapper from "../components/MapWrapper";

const IconPlay = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7-11-7z" />
  </svg>
);

const IconPause = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
  </svg>
);

const IconStop = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M6 6h12v12H6z" />
  </svg>
);

/* Themed button with plum hover-glow + pressed state */
function SidebarButton({ label, children, menu, menuTitle }) {
  // simple id so the menu can be labelled for a11y
  const slug = (label || "menu").toLowerCase().replace(/\s+/g, "-");
  const titleText = menuTitle ?? label;

  return (
    <div className="relative group">
      <button
        className={[
          "w-12 h-12 rounded-md border text-amv-white",
          "bg-amv-grey border-amv-grey hover:bg-[#1a1a1d]",
          "transition-all duration-200 ease-out will-change-transform",
          "shadow-[0_2px_8px_rgba(107,15,43,0.35)]",
          "hover:-translate-y-0.5",
          "hover:shadow-[0_10px_24px_rgba(107,15,43,0.45),0_0_14px_rgba(107,15,43,0.55)]",
          "hover:drop-shadow-[0_0_8px_rgba(107,15,43,0.35)]",
          "hover:ring-1 hover:ring-amv-maroon hover:ring-offset-1 hover:ring-offset-amv-black",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amv-plum focus-visible:ring-offset-1 focus-visible:ring-offset-amv-black",
          "active:translate-y-0 active:shadow-[0_1px_4px_rgba(107,15,43,0.40)]",
          "active:bg-[#17171A] active:border-[#222225]",
          "relative before:content-[''] before:absolute before:inset-0 before:rounded-md",
          "before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none"
        ].join(" ")}
        aria-label={label}
      >
        {children}
      </button>
      
      <div
        className="absolute left-12 top-0 h-12 w-2 md:w-12 lg:w-2 z-30"
        style={{ background: "transparent" }}
      />

      {/* Popup menu with title */}
      {Array.isArray(menu) && menu.length > 0 && (
        <div
          className={[
            "absolute left-14 top-1/2 -translate-y-1/2",
            // visible state
            "opacity-0 translate-x-[-2px] pointer-events-none",
            "group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto",
            // stacking over bridge & header
            "z-50"
          ].join(" ")}
          role="menu"
          aria-labelledby={`menu-title-${slug}`}
        >
          <div className="min-w-56 rounded-lg border border-amv-maroon bg-amv-black/95 text-amv-white shadow-[0_16px_40px_rgba(107,15,43,0.45)] backdrop-blur px-2 py-2">
            {/* Title bar — centered */}
            <div className="px-2 pb-1 mb-2 border-b border-white/10">
              <div
                id={`menu-title-${slug}`}
                className="flex items-center justify-center gap-2 text-sm font-semibold leading-tight text-center"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amv-maroon text-white text-[12px]">
                  {children}
                </span>
                <span>{titleText}</span>
              </div>
            </div>

            {/* Items — tighter line spacing & padding */}
            {menu.map((item, idx) => (
              <button
                key={idx}
                role="menuitem"
                onClick={item.onClick}
                disabled={item.disabled}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] leading-tight transition hover:bg-amv-maroon/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amv-plum disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-[15px] leading-none">{item.icon}</span>
                <span className="leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default function HomePage() {
  const [hasPerimeter, setHasPerimeter] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);

  // Collected GPS points (lat, lng) for drawing the path
  const [perimeterPath, setPerimeterPath] = useState([]);

  const handleRecordPerimeter = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);
    setPerimeterPath([]); // reset at start
  }, []);

  // ----- DYNAMIC ISLAND BUTTONS ----- //
  // Pause/resume
  const handlePause = useCallback(() => setIsPaused(true), []);
  const handlePlay = useCallback(() => setIsPaused(false), []);
  // Stop -> open big modal for Save/Don't Save/Cancel
  const handleStop = useCallback(() => {
    setShowStopModal(true);
  }, []);
  // Modal actions
  const handleSave = useCallback(() => {
    // TODO: persist `perimeterPath` to storage/back-end
    setIsRecording(false);
    setIsPaused(false);
    setShowStopModal(false);
  }, []);
  const handleDontSave = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    setPerimeterPath([]);
    setShowStopModal(false);
  }, []);
  const handleCancelStop = useCallback(() => {
    // Return to recording (modal dismissed)
    setShowStopModal(false);
  }, []);

  const handleShowPerimeters = useCallback(() => {
    // TODO: open list/history of perimeters
  }, []);
  const handleClearPerimeters = useCallback(() => {
    // TODO: clear current perimeter on map
    setHasPerimeter(false);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-amv-black text-amv-white">
      {/* Header (dark grey) */}
      <header className="flex items-center justify-between px-5 py-3 bg-amv-black">
        <h1 className="font-bold text-xl">AMV • GCS</h1>
        <button className="text-2xl hover:text-amv-plum transition">☰</button>
      </header>

      <div className="flex flex-1 gap-1 p-1 overflow-visible bg-amv-black">
        {/* Sidebar (dark grey) */}
        <aside className="w-16 bg-amv-grey flex flex-col items-center gap-3 py-3">
          <SidebarButton
            label="Perimeter"
            menuTitle="Perimeter"
            menu={[
              { icon: "⏺️", label: "Record Perimeter", onClick: handleRecordPerimeter, disabled: isRecording },
              { icon: "🗂️", label: "Show Saved Perimeters", onClick: handleShowPerimeters },
              { icon: "🧹", label: "Clear Perimeters", onClick: handleClearPerimeters, disabled: !hasPerimeter },
            ]}
          >
            Per
          </SidebarButton>
          <SidebarButton label="Boundaries">B</SidebarButton>
          <SidebarButton label="Pathing">Path</SidebarButton>
          <SidebarButton label="Set Home">H</SidebarButton>
          <SidebarButton label="?">?</SidebarButton>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col p-2 overflow-auto bg-amv-maroon">
          {/* Top Status + Map */}
          <div className="flex flex-1">
            {/* Depth + Info */}
            <div className="text-amv-black w-40 bg-amv-white border border-amv-maroon/30 rounded-md mr-2 p-2 space-y-2 shadow-sm">
              <div className="text-xs">
                Long: ...
                <br />
                Lat: ...
                <br />
                Depth:
              </div>
              <div className="h-48 bg-gradient-to-b from-[#ff6b6b] to-[#8b4dff] w-8 mx-auto rounded"></div>
              <div className="text-xs text-center">0m - max</div>
            </div>

            {/* Map Card */}
            <div className="flex-1 bg-amv-white border border-amv-maroon/30 rounded-md p-2 relative shadow-sm">
              <div className="absolute inset-0 z-0 rounded-md overflow-hidden">
                <MapWrapper pathCoords={perimeterPath} />
              </div>

              {/* Dynamic Island — top-center controller */}
              {isRecording && (
                <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-40">
                  <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-amv-grey text-white border border-[#6B0F2B] px-3 py-1.5 shadow-[0_10px_24px_rgba(107,15,43,0.45)] backdrop-blur">
                    {/* Play (enabled only when paused) */}
                    <button
                      onClick={handlePlay}
                      disabled={!isPaused}
                      aria-label="Play"
                      className={[
                        "w-8 h-8 flex items-center justify-center rounded-md",
                        "text-white hover:text-white/80 active:text-white/70",
                        "transition disabled:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      ].join(" ")}
                    >
                      <IconPlay />
                    </button>
                    {/* Pause (enabled while recording & not paused) */}
                    <button
                      onClick={handlePause}
                      disabled={isPaused}
                      aria-label="Pause"
                      className={[
                        "w-8 h-8 flex items-center justify-center rounded-md",
                        "text-white hover:text-white/80 active:text-white/70",
                        "transition disabled:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      ].join(" ")}
                    >
                      <IconPause />
                    </button>

                    {/* Stop (enabled during a session) */}
                    <button
                      onClick={handleStop}
                      aria-label="Stop"
                      className={[
                        "w-8 h-8 flex items-center justify-center rounded-md",
                        "text-white hover:text-white/80 active:text-white/70",
                        "transition"
                      ].join(" ")}
                    >
                      <IconStop />
                    </button>

                    {/* Small status */}
                    <span className="ml-1 text-amv-white font-bold text-xs opacity-100">
                      {isPaused ? "Paused" : "Recording…"}
                    </span>
                  </div>
                </div>
              )}

              {/* GPS Info */}
              <div className="absolute top-2 right-2 bg-amv-white text-amv-black border border-amv-maroon/40 rounded px-2 py-1 text-xs backdrop-blur">
                Sat: ... Fix: ...
              </div>

              {/* Indicator Panel */}
              <div className="absolute top-16 right-2 grid grid-cols-2 gap-2">
                {/* Roll */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-amv-white border border-amv-maroon/40 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-amv-plum rounded-full" />
                  </div>
                  <div className="mt-1 bg-amv-black text-amv-white text-xs px-2 py-0.5 rounded">
                    R: -1.8
                  </div>
                </div>

                {/* Heading */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-amv-black border border-amv-maroon/40 rounded-full flex items-center justify-center">
                    <div className="w-7 h-7">
                      <img src="/imuIndicator/yaw.png" />
                    </div>
                  </div>
                  <div className="mt-1 bg-amv-black text-amv-white text-[10px] px-2 py-0.5 rounded leading-tight text-center">
                    H: -148.0
                    <br />
                    C: -132.0
                  </div>
                </div>

                {/* Pitch */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-amv-white border border-amv-maroon/40 rounded-full flex items-center justify-center">
                    <div className="w-8 h-4 bg-amv-plum rounded" />
                  </div>
                  <div className="mt-1 bg-amv-black text-amv-white text-xs px-2 py-0.5 rounded">
                    P: 2.3
                  </div>
                </div>

                {/* Left/Right Thruster */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-amv-white border border-amv-maroon/40 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-amv-black rounded-full" />
                  </div>
                  <div className="mt-1 bg-amv-black text-amv-white text-[10px] px-2 py-0.5 rounded leading-tight text-center">
                    L: +0.2
                    <br />
                    R: +0.0
                  </div>
                </div>
              </div>
            </div>

            {/* Status Box */}
            <div className="w-48 bg-amv-white border border-amv-maroon/30 rounded-md ml-2 p-2 space-y-2 text-amv-black text-xs shadow-sm">
              <div className="bg-amv-maroon/15 border border-amv-maroon/30 p-1 rounded">Thrust: ON</div>
              <div className="bg-amv-maroon/15 border border-amv-maroon/30 p-1 rounded">Batt: 16V - 100%</div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex mt-2 space-x-2">
            {/* Log / Console */}
            <div className="flex-1 text-amv-black bg-amv-white border border-amv-maroon/30 rounded-md p-2 shadow-sm">
              <div className="h-20 overflow-y-scroll text-xs">Log view</div>
              <div className="mt-2 flex items-center space-x-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-amv-plum" /> <span>Center</span>
                </label>
                <span>MODE: ...</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1 bg-amv-white border border-amv-maroon/30 rounded-md p-2 shadow-sm  space-x-1">
              {["Manual", "Auto", "Send WP", "RTL", "Connect", "Cloud ⛅"].map((t, i) => (
                <button
                  key={t}
                  className={[
                    "p-2 rounded-md text-amv-white",
                    "bg-amv-maroon hover:bg-[#5a0d24] active:bg-[#490a1e]",
                    "transition-colors shadow-sm border border-amv-maroon",
                    "hover:ring-2 hover:ring-amv-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amv-plum"
                  ].join(" ")}
                  {...(i >= 4 ? 
                    { 
                      className: 
                        "p-2 rounded-md text-amv-white bg-amv-maroon hover:bg-[#5a0d24] active:bg-[#490a1e] transition-colors shadow-sm border border-amv-maroon hover:ring-2 hover:ring-amv-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amv-plum col-span-2"
                    } : {}
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stop Confirmation Modal */}
          {showStopModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold text-black mb-2">End Perimeter Recording?</h3>
                <p className="text-sm text-black/70 mb-4">
                  Choose what to do with the current recording.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelStop}
                    className="px-4 py-2 rounded-md border border-black/10 text-black hover:bg-black/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDontSave}
                    className="px-4 py-2 rounded-md bg-[#b91c1c] text-white hover:bg-[#991b1b] transition"
                  >
                    Don’t Save
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md bg-[#6B0F2B] text-white hover:bg-[#5a0d24] active:bg-[#490a1e] transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

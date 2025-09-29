import asyncio, os, json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
import httpx
import websockets

from mission_schema import Mission, Waypoint

# ---------- Config ----------
GCS_WS_HOST = os.getenv("GCS_WS_HOST", "0.0.0.0")
GCS_PORT    = int(os.getenv("GCS_HTTP_PORT", "8000"))

AGENT_HTTP  = os.getenv("JETSON_AGENT_URL", "http://127.0.0.1:9000")
AGENT_WSURL = os.getenv("JETSON_AGENT_WS",  "ws://127.0.0.1:9001/telemetry")

app = FastAPI(title="GCS Server")

# ---------- Static UI (serve your built web app if you want) ----------
@app.get("/")
def index():
    # minimal placeholder so you can test quickly
    return HTMLResponse("<h2>GCS Server OK</h2><p>Connect UI WS to /ws/ui</p>")

# ---------- Planning API (stub; replace with algorithms/path_planner) ----------
class BoundaryReq(BaseModel):
    boundary: list  # [[lng,lat], ...]
    spacing_m: float = 5.0
    angle_deg: float = 0.0
    start: str = "SW"

@app.post("/plan/coverage")
def plan_coverage(req: BoundaryReq) -> Mission:
    """
    MVP stub: just returns the polygon vertices as a 'mission'.
    Replace this with your real planner (algorithms/path_planner/...).
    """
    # convert to lat/lon and produce a simple closed loop
    wps = []
    for i, (lng, lat) in enumerate(req.boundary):
        wps.append(Waypoint(seq=i, lat=lat, lon=lng, alt=0.0, cmd=16))
    return Mission(mission=wps)

# ---------- Mission & command forwarding to the Agent ----------
@app.post("/mission/upload")
async def mission_upload(mission: Mission):
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(f"{AGENT_HTTP}/mission", json=mission.dict())
        return {"ok": r.status_code == 200, "agent_reply": r.json()}

@app.post("/mode/auto")
async def mode_auto():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(f"{AGENT_HTTP}/mode/auto")
        return {"ok": r.status_code == 200, "agent_reply": r.json()}

@app.post("/mode/rtl")
async def mode_rtl():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(f"{AGENT_HTTP}/mode/rtl")
        return {"ok": r.status_code == 200, "agent_reply": r.json()}

@app.post("/arm")
async def arm():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(f"{AGENT_HTTP}/arm")
        return {"ok": r.status_code == 200, "agent_reply": r.json()}

@app.post("/disarm")
async def disarm():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(f"{AGENT_HTTP}/disarm")
        return {"ok": r.status_code == 200, "agent_reply": r.json()}

# ---------- WS relay: UI <-> Agent telemetry ----------
@app.websocket("/ws/ui")
async def ws_ui(ws: WebSocket):
    await ws.accept()
    try:
        async with websockets.connect(AGENT_WSURL) as agent_ws:
            async def pump_agent_to_ui():
                async for msg in agent_ws:
                    await ws.send_text(msg)

            async def pump_ui_to_agent():
                # If later you want UI→Agent control over WS, handle here
                while True:
                    _ = await ws.receive_text()
                    # ignore for now
            await asyncio.gather(pump_agent_to_ui(), pump_ui_to_agent())

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await ws.send_text(json.dumps({"type":"error","detail":str(e)}))

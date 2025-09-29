import os, json, asyncio, time
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from mavlink_service import MavlinkService
from mission_service import MissionUploader
# from sonar_service import SonarService

AGENT_HTTP_PORT = int(os.getenv("AGENT_HTTP_PORT", "9000"))
AGENT_WS_PORT   = int(os.getenv("AGENT_WS_PORT",   "9001"))

app = FastAPI(title="Jetson Agent")

mav = MavlinkService()            # pymavlink connection
uploader = MissionUploader(mav.m) # mission/control
# sonar = SonarService()            # optional

# ------- REST: mission + modes -------
class MissionBody(BaseModel):
    mission: List[dict]

@app.post("/mission")
def post_mission(body: MissionBody):
    res = uploader.upload(body.mission)
    return {"ok": True, **res}

@app.post("/mode/auto")
def mode_auto():
    return uploader.set_mode("AUTO")

@app.post("/mode/rtl")
def mode_rtl():
    return uploader.set_mode("RTL")

@app.post("/arm")
def arm():
    return uploader.arm(True)

@app.post("/disarm")
def disarm():
    return uploader.arm(False)

@app.get("/health")
def health():
    return {"link_alive": mav.link_alive()}

# ------- WebSocket: telemetry JSON -------
clients = set()

@app.websocket("/telemetry")
async def telemetry_ws(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    try:
        while True:
            # pull one mavlink message (non-blocking)
            msg = mav.recv_json()
            if msg:
                await broadcast(msg)
            # periodically send link + sonar
            if int(time.time() * 10) % 10 == 0:
                await broadcast({"type":"link","alive":mav.link_alive()})
                # depth = sonar.read_depth_m()
                if depth is not None:
                    await broadcast({"type":"depth","meters":depth})
            await asyncio.sleep(0.05)
    except WebSocketDisconnect:
        clients.discard(ws)
    except Exception as e:
        clients.discard(ws)

async def broadcast(obj):
    if not clients:
        return
    text = json.dumps(obj)
    dead = []
    for c in clients:
        try:
            await c.send_text(text)
        except Exception:
            dead.append(c)
    for d in dead:
        clients.discard(d)

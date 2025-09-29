import os, time
from typing import Optional, Dict, Any
from pymavlink import mavutil

MAVLINK_EP = os.getenv("MAVLINK_ENDPOINT", "udp:127.0.0.1:14550")

class MavlinkService:
    def __init__(self):
        self.m = mavutil.mavlink_connection(MAVLINK_EP)
        hb = self.m.recv_match(type="HEARTBEAT", blocking=True, timeout=5)
        if not hb:
            raise RuntimeError(f"No HEARTBEAT from {MAVLINK_EP}")
        self.last_hb_ts = time.time()
        self.target_system = self.m.target_system
        self.target_component = self.m.target_component

    def recv_json(self) -> Optional[Dict[str, Any]]:
        msg = self.m.recv_match(blocking=False)
        if not msg:
            return None
        t = msg.get_type()

        if t == "HEARTBEAT":
            self.last_hb_ts = time.time()
            return {"type":"link","alive":True,"ts":int(self.last_hb_ts*1000)}

        if t == "GLOBAL_POSITION_INT":
            return {
                "type":"position",
                "lat": msg.lat/1e7,
                "lon": msg.lon/1e7,
                "alt": msg.alt/1000.0,
                "hdg": (msg.hdg/100.0) if getattr(msg, "hdg", None) not in (None, 65535) else None,
            }

        if t == "ATTITUDE":
            return {"type":"attitude","roll":msg.roll,"pitch":msg.pitch,"yaw":msg.yaw}

        if t == "BATTERY_STATUS":
            v = None
            if msg.voltages and msg.voltages[0] != 65535:
                v = msg.voltages[0]/1000.0
            return {"type":"battery","voltage":v,"remaining":msg.battery_remaining}

        if t == "SYS_STATUS":
            return {"type":"sys","load":msg.load/10.0,"voltage_battery":msg.voltage_battery/1000.0}

        return None

    def link_alive(self, max_age=3.0) -> bool:
        return (time.time() - self.last_hb_ts) < max_age

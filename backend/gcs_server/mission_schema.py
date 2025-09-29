from pydantic import BaseModel, Field, root_validator, validator
from typing import List, Optional

class Waypoint(BaseModel):
    seq: int = Field(..., ge=0)
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    alt: float = 0.0
    cmd: int = 16  # MAV_CMD_NAV_WAYPOINT by default
    param1: float = 0.0
    param2: float = 0.0
    param3: float = 0.0
    param4: float = 0.0

class Mission(BaseModel):
    mission: List[Waypoint]

    @validator("mission")
    def non_empty(cls, v):
        if not v:
            raise ValueError("Mission must contain at least one waypoint")
        return v

    @root_validator
    def check_ordering(cls, values):
        m = values.get("mission") or []
        for i, wp in enumerate(m):
            if wp.seq != i:
                # normalize silently
                m[i] = Waypoint(**{**wp.dict(), "seq": i})
        values["mission"] = m
        return values

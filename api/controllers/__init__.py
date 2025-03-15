from .employee_controller import router as employee_router
from .device_controller import router as device_router
from .branch_controller import router as branch_router

# ✅ Expose all routers as a list (useful for dynamic registration)
routers = [employee_router, device_router, branch_router]

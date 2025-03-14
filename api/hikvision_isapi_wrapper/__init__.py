#from dotenv import load_dotenv
import os
from requests.auth import HTTPDigestAuth
from requests import Session
from .tools import LiveServerSession
from dotenv import load_dotenv

# Load .env file
#load_dotenv()
# ✅ Get the absolute path of the `api/` directory
api_dir = os.path.dirname(os.path.abspath(__file__))  # hikvision_isapi_wrapper/
api_dir = os.path.dirname(api_dir)  # Moves up one level to `api/`

# ✅ Load .env from api/
load_dotenv(os.path.join(api_dir, ".env"))

HIKVISION_ACT_LOGIN = os.environ.get('HIKVISION_ACT_LOGIN')
HIKVISION_ACT_PASSWORD = os.environ.get('HIKVISION_ACT_PASSWORD')
host = os.environ.get("HIKVISION_ACT_HOST")




class LoginPasswordMissingError(Exception):
    pass


if HIKVISION_ACT_LOGIN is None or HIKVISION_ACT_PASSWORD is None:
    raise LoginPasswordMissingError(
        "All Hikvision Access Control Terminals API methods require login and password!"
    )

auth = HTTPDigestAuth(HIKVISION_ACT_LOGIN, HIKVISION_ACT_PASSWORD)
session = Session()

session.auth = auth


# from .person import Person
from .fplib import FaceData, FaceDataLib
# from .event import Event

from requests import Session
from urllib.parse import urljoin
from requests.auth import HTTPDigestAuth
import time
import requests

class LiveServerSession(Session):
    def __init__(self, prefix_url=None, *args, **kwargs):
        super(LiveServerSession, self).__init__(*args, **kwargs)
        self.prefix_url = prefix_url

    def request(self, method, url,*args, **kwargs):
        url = urljoin(self.prefix_url, url)
        return super(LiveServerSession, self).request(method, url, *args, **kwargs)


class Struct:
    def __init__(self, **entries):
        self.__dict__.update(entries)
        
        
# tools.py (new file)
# class TimedSession:
#     def __init__(self, max_age_seconds=1800, auth=None):
#         self.inner_session = requests.Session()
#         self.created_at = time.time()
#         self.max_age = max_age_seconds
#         if auth:
#             self.inner_session.auth = auth
    
#     def request(self, method, url, **kwargs):
#         if time.time() - self.created_at > self.max_age:
#             self.renew()
#         return self.inner_session.request(method, url, **kwargs)
    
#     def renew(self):
#         self.inner_session.close()
#         self.inner_session = requests.Session()
#         if hasattr(self, 'auth'):
#             self.inner_session.auth = self.auth
#         self.created_at = time.time()

class TimedSession(requests.Session):
    def __init__(self, username, password, max_age_seconds=900):
        super().__init__()
        self._username = username
        self._password = password
        self._created_at = time.time()
        self.max_age = max_age_seconds
        self.headers.update({'Content-Type': 'application/json'})
        self._apply_auth()  # Set up digest auth

    def _apply_auth(self):
        """Create fresh auth object with stored credentials"""
        self.auth = HTTPDigestAuth(self._username, self._password)
        self._created_at = time.time()

    def _renew_session(self):
        """Renew session with fresh auth credentials"""
        self.close()
        self.__init__(self._username, self._password, max_age_seconds=self.max_age)
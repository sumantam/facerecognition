#from . import session
from datetime import timedelta, datetime
from zoneinfo import ZoneInfo
import json
import threading
import time
import requests


class Event(object):
    
    def __init__(self, last_event_time):
        from . import auth, session  # Lazy import
        
        self._auth = auth
        self._session = session  # Store as instance variable
        self._session.auth = auth  # Set auth immediately
        self._stop = False
        self._last_event_time = last_event_time
        print( f"Last Event Time {self._last_event_time}")    
    
    def start_listen_events(self, _callback):
        self._callback = _callback
        x = threading.Thread(target=self._start_listen_events)        
        x.start()

    def search_historical_events(self, search_id, _callback, start_time=None, end_time=None):
        self._callback = _callback

        # Build argument tuple based on whether optional args are passed
        args = (search_id,)
        if start_time or end_time:
            args += (start_time, end_time)
        else:
            args += (None, None)

        x = threading.Thread(target=self._search_historical_events, args=args)
        x.start()


    def stop_listen_events(self):
        self._stop = True
    
    def get_status(self):
        return not self._stop
            
    # def _search_historical_events(self,
    #                              search_id, 
    #                              start_time = None, 
    #                              end_time = None 
    #                             ):
    #     url = 'http://10.0.0.10/ISAPI/AccessControl/AcsEvent?format=json'

    #     print(f"Inside the function {__name__}")
        
    #         # Use India timezone
    #     tz = ZoneInfo("Asia/Kolkata")

    #     # Make timestamps timezone-aware and truncate microseconds
    #     startTime = (start_time or self._last_event_time).astimezone(tz).replace(microsecond=0)
    #     endTime = (end_time or datetime.now(tz)).astimezone(tz).replace(microsecond=0)
        
    #     payload = {
    #         "AcsEventCond": {
    #             "searchID": search_id,
    #             "searchResultPosition": 0,
    #             "maxResults": 1000,
    #             "major": 5,
    #             "minor": 75,
    #             "startTime": startTime.isoformat(),
    #             "endTime": endTime.isoformat()
    #         }
    #     }

    #     headers = {
    #         "Content-Type": "application/json"
    #     }

    #     print(f"🔍 Sending POST to {url} with payload: {payload}")

    #     response = session.post(url, json=payload, headers=headers)
    #     response.raise_for_status()

    #     data = response.json()
    #     # print(f"✅ Response: {json.dumps(data, indent=2)}")
        
    #     return {"data": data,"end_time": endTime.isoformat()}

    # def re_authenticate(self):
    #     # Basic Auth
    #     self._session.auth = self._auth

    #     # OR token-based login
    #     # token = self.get_new_token()
    #     # session.headers.update({"Authorization": f"Bearer {token}"})
        
    # def re_authenticate(self):
    #     """Force fresh authentication with new credentials"""
    #     try:
    #         # 1. Clear existing auth state
    #         self._session.inner_session.auth = None
    #         self._session.inner_session.cookies.clear()
            
    #         # 2. Force new digest auth challenge
    #         test_url = "http://10.0.0.10/ISAPI/System/status"
    #         probe = self._session.get(test_url, timeout=5)
            
    #         # 3. Apply fresh credentials if 401 received
    #         if probe.status_code == 401:
    #             self._session.auth = self._auth
    #             print("🔑 Sent fresh credentials")
    #             return True
                
    #         return False
    #     except Exception as e:
    #         print(f"🔥 Re-auth failed: {str(e)}")
    #         return False
    
    def re_authenticate(self):
        try:
            # 1. Full cleanup
            self._session.cookies.clear()
            self._session.headers.pop('Authorization', None)
            
            self._session._renew_session()
            probe_url = "http://10.0.0.10/ISAPI/System/status"
            
            verify = self._session.get(probe_url, timeout=3)
            verify.raise_for_status()
            return True
            
        except Exception as e:
            print(f"🔥 Auth renewal failed: {str(e)}")
            return False

    def re_authenticate0(self):
        """Properly handles Hikvision's digest auth challenges"""
        try:
            # 1. Full cleanup
            self._session.cookies.clear()
            self._session.headers.pop('Authorization', None)
            
            # 2. Force new auth challenge
            probe_url = "http://10.0.0.10/ISAPI/System/status"
            try:
                probe = self._session.get(probe_url, timeout=3)
                if probe.status_code == 200:
                    return True  # Auth still valid
            except requests.RequestException:
                pass
            
            # 3. Full session renewal if probe fails
            self._session._renew_session()
            
            # 4. Verify auth works
            verify = self._session.get(probe_url, timeout=3)
            if verify.status_code == 200:
                print("🔑 Auth refreshed successfully")
                return True
                
            raise Exception("Auth verification failed after renewal")
            
        except Exception as e:
            print(f"🔥 Auth renewal failed: {str(e)}")
            return False
        
    def post_with_retries(self, url, json=None, headers=None, max_retries=3):
        last_exception = None
        
        for attempt in range(1, max_retries + 1):
            try:
                response = self._session.post(
                    url,
                    json=json,
                    headers=headers,
                    timeout=(5, 30)  # 5s connect, 30s read
                )
                if response.status_code == 401:
                    if not self.re_authenticate():
                        raise requests.HTTPError("Permanent auth failure")
                    continue  # Retry with fresh auth
                    
                response.raise_for_status()
                return response
                
            except requests.RequestException as e:
                last_exception = e
                print(f"Attempt {attempt} failed: {str(e)}")
                if attempt < max_retries:
                    time.sleep(2 ** attempt)  # Exponential backoff
    
        raise last_exception or requests.RequestException("All retries failed")

    def _post_with_retries(self, url, json = None, headers= None, max_retries=3, delay=15):
        for attempt in range(1, max_retries + 1):
            try:
                # response = self._session.post(url, json=json, headers=headers)
                response = self._session.request(
                    'POST',
                    url,
                    json=json,
                    headers=headers,
                    timeout=(5, 30)
                )
                
                # if response.status_code == 401:
                #     print(f"❌ HTTP {response.status_code}: {response.text}")
                #     print("🔁 Re-authenticating after 401...")
                #     self.re_authenticate()
                #     continue  # retry after auth
                
                if response.status_code == 401:
                    if not self.re_authenticate():
                        raise requests.HTTPError("401 after auth renewal")
                    continue
                    
                response.raise_for_status()
                return response
            
            except requests.RequestException as e:
                print(f"Attempt {attempt} failed: {e}")
                print(f"❌ HTTP {response.status_code}: {response.text}")
                
                if attempt == 2:  # Final attempt
                    self._session._renew_session()  # Nuclear option
                    raise
                time.sleep(1 * (attempt + 1))
 
                if attempt == max_retries:
                    raise
                time.sleep(delay)
                
        return None  # Explicit return if all retries fail


    def _search_historical_events(self,
                                search_id, 
                                start_time=None, 
                                end_time=None):
        url = 'http://10.0.0.10/ISAPI/AccessControl/AcsEvent?format=json'

        print(f"Inside the function {__name__}")

        # Use India timezone
        tz = ZoneInfo("Asia/Kolkata")

        # Make timestamps timezone-aware and truncate microseconds
        startTime = (start_time or self._last_event_time).astimezone(tz).replace(microsecond=0)
        endTime = (end_time or datetime.now(tz)).astimezone(tz).replace(microsecond=0)

        headers = {
            "Content-Type": "application/json"
        }

        all_events = []
        position = 0
        max_results = 30

        while True:
            payload = {
                "AcsEventCond": {
                    "searchID": search_id,
                    "searchResultPosition": position,
                    "maxResults": max_results,
                    "major": 5,
                    "minor": 75,
                    "startTime": startTime.isoformat(),
                    "endTime": endTime.isoformat()
                }
            }

            print(f"🔍 Sending POST to {url} with position: {position}")
            # response = session.post(url, json=payload, headers=headers)
            response = self.post_with_retries(url, json=payload, headers=headers)
            response.raise_for_status()

            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)}")

            events = data.get("AcsEvent", [])
            all_events.extend(events)

            print(f"BreakDown Conditions {max_results}", len(events), len(events.get("InfoList")), events.get("numOfMatches"))
            # print(f"Events", events)
            if events.get("numOfMatches") < max_results:
                break  # No more data

            position += max_results  # Get the next page
            print(f"Position is {position}")

        print (f" All Events ----->>> {all_events}")
        return {
            "data": all_events,
            "end_time": endTime.isoformat()
        }


    def _start_listen_events(self):
        #path = '/ISAPI/Event/notification/alertStream'
        path = f'http://10.0.0.10/ISAPI/Event/notification/alertStream'
        response = self._session.get(path, stream=True)
        response.raise_for_status()
        print('The response is ', response)


    def _start_listen_events_old(self):
        #path = '/ISAPI/Event/notification/alertStream'
        path = f'http://10.0.0.10/ISAPI/Event/notification/alertStream'
        response = self._session.get(path, stream=True)
        response.raise_for_status()
        print('The response is ', response)
        
        in_header = False             # are we parsing headers at the moment
        grabbing_response = False     # are we grabbing the response at the moment
        response_size = 0             # the response size that we take from Content-Length
        response_buffer = b""         # where we keep the reponse bytes

        for chunk in response.iter_lines():
            decoded = ""
            try:
                decoded = chunk.decode("utf-8")
                print('Decoded :', decoded)
            except:
                # image bytes here ignore them
                continue

        #     if decoded == "--MIME_boundary":                
        #         in_header = True

        #     if in_header:
        #         if decoded.startswith("Content-Length"):
        #             decoded.replace(" ", "")
        #             content_length = decoded.split(":")[1]
        #             response_size = int(content_length)
        #             print('Enters the response size')
        #             break

        #         if decoded == "":
        #             in_header = False
        #             grabbing_response = True
        #             print('Enters the grabbing response', decoded)
        #             print('Enters the chunk response', chunk)


        #     elif grabbing_response:
        #         response_buffer += chunk

        #         if len(response_buffer) != response_size:
        #             response_buffer += b"\n"
        #         else:
        #             # time to convert it json and return it
        #             grabbing_response = False
        #             print('Resonse Buffer :', response_buffer)
        #             dic = json.loads(response_buffer)
                    
        #             if dic["eventType"] == "AccessControllerEvent":
        #                 rsp = {
        #                     "date": dic["dateTime"],
        #                     "status": dic["AccessControllerEvent"]["attendanceStatus"],
        #                 }
        #                 if rsp["status"] == "checkIn":
        #                     rsp["employee_id"] = int(dic["AccessControllerEvent"]["employeeNoString"])
        #                 self._callback(rsp)
        #             response_buffer = b""
        #             if self._stop:
        #                 return 0
            #print('Lengths :', len(response_buffer), response_size)

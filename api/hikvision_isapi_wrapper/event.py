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
            # print(f"✅ Response: {json.dumps(data, indent=2)}")

            events = data.get("AcsEvent", [])
            all_events.extend(events.get("InfoList"))

            print(f"BreakDown Conditions {max_results}", len(events), len(events.get("InfoList")), events.get("numOfMatches"))
            # print(f"Events", events)
            if events.get("numOfMatches") < max_results:
                break  # No more data

            position += max_results  # Get the next page
            print(f"Position is {position}")

        # print (f" All Events ----->>> {all_events}")
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

    
    

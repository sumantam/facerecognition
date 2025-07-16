from . import session
from datetime import timedelta, datetime
from zoneinfo import ZoneInfo
import json
import threading


class Event(object):
    
    def __init__(self, last_event_time):
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
            
    def _search_historical_events(self,
                                 search_id, 
                                 start_time = None, 
                                 end_time = None 
                                ):
        url = 'http://10.0.0.10/ISAPI/AccessControl/AcsEvent?format=json'

        print(f"Inside the function {__name__}")
        
            # Use India timezone
        tz = ZoneInfo("Asia/Kolkata")

        # Make timestamps timezone-aware and truncate microseconds
        startTime = (start_time or self._last_event_time).astimezone(tz).replace(microsecond=0)
        endTime = (end_time or datetime.now(tz)).astimezone(tz).replace(microsecond=0)
        
        payload = {
            "AcsEventCond": {
                "searchID": search_id,
                "searchResultPosition": 0,
                "maxResults": 1000,
                "major": 5,
                "minor": 75,
                "startTime": startTime.isoformat(),
                "endTime": endTime.isoformat()
            }
        }

        headers = {
            "Content-Type": "application/json"
        }

        print(f"🔍 Sending POST to {url} with payload: {payload}")

        response = session.post(url, json=payload, headers=headers)
        response.raise_for_status()

        data = response.json()
        print(f"✅ Response: {json.dumps(data, indent=2)}")
        return data


    def _start_listen_events(self):
        #path = '/ISAPI/Event/notification/alertStream'
        path = f'http://10.0.0.10/ISAPI/Event/notification/alertStream'
        response = session.get(path, stream=True)
        response.raise_for_status()
        print('The response is ', response)


    def _start_listen_events_old(self):
        #path = '/ISAPI/Event/notification/alertStream'
        path = f'http://10.0.0.10/ISAPI/Event/notification/alertStream'
        response = session.get(path, stream=True)
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

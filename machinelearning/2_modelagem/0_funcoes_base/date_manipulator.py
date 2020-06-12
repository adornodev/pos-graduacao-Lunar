import pandas as pd
from datetime import datetime

def ticks_to_datetime(ticks):
  return datetime.fromtimestamp(ticks/1000.0)

def get_date_window(start_date, end_date, mapping_window_step=100, mapping_window_step_unit='ms', bound=(None,None), closed=None, to_pydatetime=True):
  available_min_timestamp = bound[0]
  available_max_timestamp = bound[1]

  min_range = start_date #- pd.Timedelta(mapping_window_step, mapping_window_step_unit)
  max_range = end_date   #+ pd.Timedelta(mapping_window_step, mapping_window_step_unit)
  
  if available_min_timestamp:
    min_range = min_range if min_range >= available_min_timestamp else available_min_timestamp

  if available_max_timestamp:
    max_range = max_range if max_range <= available_max_timestamp else available_max_timestamp
  
  result = pd.date_range(start=min_range, end=max_range, freq=str(mapping_window_step) + ' ' + mapping_window_step_unit, closed=closed)
  
  if to_pydatetime:
    return result.to_pydatetime()
  
  return result
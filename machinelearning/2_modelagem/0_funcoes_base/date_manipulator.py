from datetime import datetime

def ticks_to_datetime(ticks):
  return datetime.fromtimestamp(ticks/1000.0)

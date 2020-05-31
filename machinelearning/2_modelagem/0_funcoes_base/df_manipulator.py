import pandas as pd
import os
import numpy as np
import re
from IPython.display import display
from datetime import datetime

def rename_columns(df):
  _df = df.copy()

  formatted_cols = [re.sub('(.)([A-Z][a-z]+)', r'\1_\2', col) for col in _df.columns]
  _df.columns = [re.sub('([a-z0-9])([A-Z])', r'\1_\2', f_col).lower() for f_col in formatted_cols]

  return _df

def apply_describe(df): 
    eda_df = {}
    eda_df['null_sum'] = df.isnull().sum()
    eda_df['null_pct'] = df.isnull().mean()
    eda_df['dtypes'] = df.dtypes
    eda_df['count'] = df.count()
    eda_df['mean'] = df.mean()
    eda_df['median'] = df.median()
    eda_df['min'] = df.min()
    eda_df['max'] = df.max()
    
    available_types = df.dtypes.value_counts().keys().tolist()

    print('Shape:\n', df.shape)
    print('Types:\n')
    
    for type in available_types:
      print(type, ': ', df.select_dtypes(include=[type]).columns.values)
    
    print('\n\n')

    result = pd.DataFrame(eda_df)
    display(result)

def load_dataframe(name, ref_dir, delimiter=';', header=[]):
    full_path = os.path.join(ref_dir,name)

    if len(header)>0:
        df = pd.read_csv(full_path, sep=delimiter, names=header, header=0) 
    else:
        df = pd.read_csv(full_path, sep=delimiter) 

    return df

def remove_nan(df, subset=None, how='any'):
  new_df = df.dropna(axis=0, how=how, thresh=None, subset=None, inplace=False)
  return new_df

def set_index(df, col, inplace):
  if not col:
    raise Exception('O parâmetro "col" é obrigatório!')
  if col not in df.columns:
    raise Exception('Esta coluna não existe')
  return df.set_index(col, inplace = inplace)

def filter_by_dates(df, start_date, end_date = None, format = None):
  if not start_date:
    start_date = datetime.min()
  if not end_date:
    end_date = datetime.utcnow()

  if format:
    if not isinstance(start_date, datetime):
      start_date = datetime.strptime(start_date, format)
    if not isinstance(end_date, datetime):
      end_date = datetime.strptime(end_date, format)

  valid_check = end_date > start_date
  return df[(df.index >= start_date) & (df.index <= end_date)] if valid_check else df[(df.index >= end_date) & (df.index <= start_date)]

def remove_column(df, cols, inplace):
  if isinstance(cols, str):
    cols = [cols]
  return df.drop(cols, axis=1, inplace=inplace)

def get_speed_bumps_idx(df, speed_bump_id=None):
  result = {}
  if speed_bump_id == 0:
      return result 

  result = {int(sb_id): 0 for sb_id in list(df.speed_bump_id.value_counts().keys()) if speed_bump_id is None or sb_id == speed_bump_id}
  for sb_id in result:
      result[sb_id] = df[df.speed_bump_id == sb_id].index.to_list()
  
  result.pop(0, None)

  return result

def get_affected_timestamps_by_speed_bumps(df, indexes, mapping_window_width, mapping_window_freq, df_freq = '100 ms', verbose=False):
  result = {}

  min_idx = min(df.index)
  max_idx = max(df.index)

  for sb_id in indexes:
    result[sb_id] = {}
    for sb_idx in indexes[sb_id]:
      result[sb_id][sb_idx] = {}

      min_range = sb_idx - pd.Timedelta(mapping_window_width[0], mapping_window_freq)
      max_range = sb_idx + pd.Timedelta(mapping_window_width[1], mapping_window_freq)
      
      min_range = min_range if min_range >= min_idx else min_idx
      max_range = max_range if max_range <= max_idx else max_idx
      
      search_values = pd.date_range(start=min_range, end=max_range, freq=df_freq)

      if verbose:
        print(f'\nsb_idx {sb_idx} -> [{min_range},{max_range}]')

      result[sb_id][sb_idx] = search_values

  return result
import pandas as pd
import os
import numpy as np

from IPython.display import display
from datetime import datetime

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

def load_dataframe(name, ref_dir, delimiter =';', header = []):
    full_path = os.path.join(ref_dir,name)

    if len(header)>0:
        df = pd.read_csv(full_path, sep=delimiter, names=header, header=0) 
    else:
        df = pd.read_csv(full_path, sep=delimiter) 

    return df

def remove_nan(df, subset=None):
  new_df = df.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
  return new_df

def set_index(df, col, inplace):
  if not col:
    raise Exception('O parâmetro "col" é obrigatório!')
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
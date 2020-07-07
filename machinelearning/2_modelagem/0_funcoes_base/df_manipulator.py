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

def load_dataframes(names, ref_dir, delimiter=';', header=[]):
  result = None

  if isinstance(names,str):
    names = [names]

  for name in names:
    _df = None
    full_path = os.path.join(ref_dir,name)

    if len(header)>0:
        _df = pd.read_csv(full_path, sep=delimiter, names=header, header=0) 
    else:
        _df = pd.read_csv(full_path, sep=delimiter) 

    if result is None:
        result = _df.copy()
    else:
        result = result.append(_df, ignore_index=True)

  return result

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

def range2(start,end,step):
    i = start
    while i < end:
        yield i
        i += step
    yield end
    
def get_initial_timestamps(df, column):
    initial_timestamp_by_speed_bump = df.sort_values('timestamp').groupby(column).head(1).where(df[column] > 0).dropna()[[column]]
    return initial_timestamp_by_speed_bump[column].to_dict()

def create_region_split_feature(df, region_id_column, aux_split_column):
    res = np.zeros(len(df[region_id_column]))

    res[0] = df[region_id_column].iloc[0]

    count = 0
    i = 0
    vals = {}

    for idx, val in df[region_id_column].iloc[0:].iteritems():
        vals[i] = val
        
        if val == 0:
            res[i] = count
        elif val == 1:
            if vals[i-1] == 0:
                count += 1
            res[i] = count
        i +=1

    df[aux_split_column] = res.astype(int)
    df[aux_split_column].loc[df[aux_split_column] < 1] = 1

def custom_train_test_split(df_in, column_to_group_by, region_id_column, aux_split_column, train_ignored_columns, chunks_size):
    df = df_in.copy()

    # Get initial timestamps from each speedbump
    initial_timestamp_by_speed_bump = get_initial_timestamps(df, column_to_group_by)
    
    # Create auxiliar feature to split data into train and test
    create_region_split_feature(df, region_id_column, aux_split_column)

    #################### Run main logic ##########################################
    total_region_1 = df[aux_split_column][-1]
    region_1_per_chunk = int(total_region_1/chunks_size)


    print(f'{region_1_per_chunk} eventos por bloco no total de {total_region_1} eventos e {chunks_size} blocos', '\n')
    print('\nQuebra-molas nº:')

    prev_i = 0
    iterations = 0
    x_trains, x_tests, y_trains, y_tests = [], [], [], []

    for i in range2(region_1_per_chunk, total_region_1, region_1_per_chunk):
        df_i = (df.loc[(df[aux_split_column] > prev_i) & (df[aux_split_column] <= i)])

        data_i =  df_i.drop(train_ignored_columns, axis=1).values
        target_i = df_i[region_id_column].values

        distribution_text = str(0) + ' (' + str(round(df_i[region_id_column].value_counts()[0]/len(df_i) * 100,1)) + '%' + ') ' + str(1) + ' (' + str(round(df_i[region_id_column].value_counts()[1]/len(df_i) * 100,1)) + '%' + ')'
        
        print('{:>02d} -> {:>02d} :{:>20s}'.format(prev_i, i, distribution_text))

        if iterations % 2 == 0:
            x_trains.append(data_i)
            y_trains.append(target_i)
        else:
            x_tests.append(data_i)
            y_tests.append(target_i)

        prev_i = i
        iterations += 1

    return df, x_trains, x_tests, y_trains, y_tests   

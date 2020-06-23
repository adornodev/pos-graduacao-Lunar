import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
import seaborn as sns
import scipy as scp
import glob
from random import uniform
from matplotlib.dates import rrulewrapper, RRuleLocator, DateFormatter

from dateutil.rrule import (DAILY, HOURLY, MINUTELY, SECONDLY)

def plot_timeseries(df, variables_array, start_date, end_date, ylabel='', days_interval=-1,
                   minutes_interval=-1, seconds_interval=-1, save_figure_name = '', rolling_time=0, 
                   reference_line=[], figure_size=[30,10], ticks=[], legend=[], special_dates={}):
    
    date_format = '%d/%m/%Y %H:%M:%S.%f'

    start_date = pd.to_datetime(start_date,format=date_format)
    end_date = pd.to_datetime(end_date,format=date_format)

    df_filtered = df[ (df.index > start_date) & (df.index < end_date) ]
    
    print(f'Shape: {df_filtered.shape}')

    if days_interval <=0:
      days_interval = int((df.index[-1]-df.index[0]).total_seconds()/60/60/24)
    if minutes_interval <= 0:
      minutes_interval = int((df.index[-1]-df.index[0]).total_seconds()/60)
    if seconds_interval <= 0:
      seconds_interval = int((df.index[-1]-df.index[0]).total_seconds())

    fig, ax = plt.subplots()
    xs = {}
    series = {}
    smask = {}

    for variable in variables_array:
        plt.plot_date(df_filtered.index, df_filtered[variable], linestyle='-', marker='o')
        plt.title(variables_array[0])
            
        if rolling_time > 0:
            plt.plot_date(df_filtered.index, df_filtered[variable].rolling(rolling_time).mean(), linestyle='-', marker='o')
      
    if len(reference_line) > 0:
        for value in reference_line:
            ax.axhline(value, color='black', lw=3)

    if len(ticks) > 2:
        ax.set_yticks(np.arange(ticks[0], ticks[1], ticks[2]))
        
    if len(legend) > 0:
        ax.legend(legend)
    
    ymin, ymax = ax.get_ylim()
    for date in special_dates:
        d = pd.to_datetime(date , format=date_format)
        if (d>=start_date) and (d <= end_date):
            plt.axvspan(d, d+pd.Timedelta(np.timedelta64(100, 'ms')), color='grey', alpha=0.5)
            position = uniform(0,1)
            plt.text(d,ymin+position*(ymax-ymin)/2,special_dates[date],fontsize=14)
   

    if days_interval <= 2:
        
      second_rule = rrulewrapper(SECONDLY, interval=seconds_interval)
      second_loc = RRuleLocator(second_rule)
      second_formatter = DateFormatter('%H:%M:%S')

      if minutes_interval <= 2:
        ax.xaxis.set_major_locator(second_loc)
        ax.xaxis.set_major_formatter(second_formatter) 
        ax.xaxis.set_tick_params(which='major', rotation=90, labelsize=10, pad=60)
      else:
        minute_rule = rrulewrapper(MINUTELY, interval=minutes_interval)
        minute_loc = RRuleLocator(minute_rule)
        minute_formatter = DateFormatter('%H:%M')

        ax.xaxis.set_major_locator(minute_loc)
        ax.xaxis.set_major_formatter(minute_formatter) 
        ax.xaxis.set_tick_params(which='major', rotation=90, labelsize=10, pad=60)
        
        ax.xaxis.set_minor_locator(second_loc)
        ax.xaxis.set_minor_formatter(second_formatter)
        ax.xaxis.set_tick_params(which='minor', labelsize=10, rotation=90)
    else:
      day_formatter = DateFormatter('%d/%m/%Y')
      day_rule = rrulewrapper(DAILY, interval=days_interval)
      day_loc = RRuleLocator(day_rule)

      ax.xaxis.set_major_locator(day_loc)
      ax.xaxis.set_major_formatter(day_formatter)
      ax.xaxis.set_tick_params(which='major', rotation=90, labelsize=10, pad=0)


    fig.set_figheight(figure_size[1])
    fig.set_figwidth(figure_size[0])
    plt.grid(True)
    
    if len(ylabel) > 0:
        plt.ylabel(ylabel)
    if save_figure_name:
        plt.savefig(save_figure_name) #dpi=500
    plt.show()
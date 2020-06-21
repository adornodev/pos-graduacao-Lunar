import os
import re

def get_out_filename(prefix, ref_dir, in_filenames):
  result = ''

  if not prefix:
    prefix = ''
  if not ref_dir:
    ref_dir = './'
  if not in_filenames:
    return result

  in_filename = ''
  if isinstance(in_filenames, list):
    txt = " ".join(in_filenames)
    in_filename = 'export_lunar_' + "_".join(re.sub("[^\d{4}\d{2}\d{2}]", ' ', txt).strip().split())
    if '.csv' not in in_filename:
      in_filename = in_filename + '.csv'
  else:
    in_filename = in_filenames

  in_prefix_idx = in_filename.find('_')
  in_prefix = ''
  if in_prefix_idx > 0 and in_prefix_idx <= 3:
      in_prefix = in_filename[:in_prefix_idx + 1]
  
  result = os.path.join(ref_dir, prefix + in_filename.replace(in_prefix, ''))
  return result

def remove_prefix(filename_without_path):
  in_prefix_idx = filename_without_path.find('_')
  in_prefix = ''
  if in_prefix_idx > 0 and in_prefix_idx <= 3:
      in_prefix = filename_without_path[:in_prefix_idx + 1]
  return filename_without_path.replace(in_prefix, '')

import os

def get_out_filename(prefix, ref_dir, in_filename):
  result = ''

  if not prefix:
    prefix = ''
  if not ref_dir:
    ref_dir = './'
  if not in_filename:
    return result

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

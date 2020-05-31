import os

def get_out_filename(out_prefix, out_ref_dir, in_filename):
  result = ''
  prefix = ''

  if not out_prefix:
    out_prefix = ''
  if not out_ref_dir:
    out_ref_dir = './'
  if not in_filename:
    return result

  in_prefix_idx = in_filename.find('_')
  if in_prefix_idx > 0 and in_prefix_idx <= 3:
      prefix = in_filename[:in_prefix_idx + 1]
  
  result = os.path.join(out_ref_dir, out_prefix + in_filename.replace(prefix, ''))
  return result
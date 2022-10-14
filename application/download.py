# Imports that handle command processing
import shlex
import subprocess

# Imports that handle other AWS functionality
import boto3

# Import for HTTP Request
import urllib3

# Initialize the s3 client
s3 = boto3.client('s3')

def download_vid_to_tmp(bucket, file_name):
    tmp_video_file_path = "/tmp/{}".format(file_name)
    s3_source_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':file_name}, ExpiresIn:120)
    
    ffmpeg_cmd = "/opt/ffmpeg -ss 00:00:00 -to 00:00:02 -i \"{}\" -c:v copy -c:a copy {}".format(s3_source_signed_url, tmp_video_file_path)
    ffprobe_cmd = "/opt/ffprobe -i \"{}\" -show_entries format=duration -v quiet -of csv=\"p=0\"".format(s3_source_signed_url)
    
    cmd1 = shlex.split(ffmpeg_cmd)
    cmd2 = shlex.split(ffprobe_cmd)
    
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    val = subprocess.run(cmd2, stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout
    
    val = val.decode("utf-8")
    update_video_length(file_name, val)
    
    return tmp_video_file_path
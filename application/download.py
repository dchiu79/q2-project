# Imports that handle command processing
import shlex
import subprocess

# Imports that handle other AWS functionality
import boto3

# Initialize the s3 client
s3 = boto3.client('s3')

def download_vid_to_tmp(bucket, file_name):
    tmp_video_file_path = "/tmp/{}".format(file_name)
    s3_source_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':file_name}, ExpiresIn=120)
    
    print("Temporary video path:", tmp_video_file_path)
    
    # ffmpeg command to copy the file to temporary directory 
    ffmpeg_cmd = "/opt/bin/ffmpeg -ss 00:00:00 -to 00:00:02 -i \"{}\" -c:v copy -c:a copy {}".format(s3_source_signed_url, tmp_video_file_path)
    
    cmd1 = shlex.split(ffmpeg_cmd)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    return tmp_video_file_path
# Imports that handle command processing
import shlex
import subprocess

# Import for file management
import shutil

import boto3

# Initialize the s3 client
s3 = boto3.client('s3')

def download_objects_to_tmp(bucket, file_name, start_image, end_image):
    
    # Creating path for video file
    tmp_video_file_path = "/tmp/{}".format(file_name)
    s3_video_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':file_name}, ExpiresIn=120)
    
    # Creating path for start image file
    tmp_start_image_path = "/tmp/{}".format(start_image)
    s3_start_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':start_image}, ExpiresIn=120)
    
    # Creating path for end image file
    tmp_end_image_path = "/tmp/{}".format(end_image)
    s3_end_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':end_image}, ExpiresIn=120)
    
    # ffmpeg command to copy the video to the temporary directory 
    ffmpeg_cmd1 = "/opt/bin/ffmpeg -i {} -c:v copy -c:a copy {}".format(s3_video_signed_url, tmp_video_file_path)
    
    cmd1 = shlex.split(ffmpeg_cmd1)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("Video copied to temporary directory")
    
    # Copying the start and end images to temporary directory
    shutil.copy(s3_start_signed_url, tmp_start_image_path)
    shutil.copy(s3_end_signed_url, tmp_end_image_path)
    print("Start/End images copied to temporary directory")
    
    return tmp_video_file_path, tmp_start_image_path, tmp_end_image_path
# Imports that handle command processing
import shlex
import subprocess

# Import that handles file management
import os

import boto3

# Initialize the s3 client
s3 = boto3.client('s3')

def download_objects_to_tmp(bucket, file_name):
    
    # Creating path for video file
    tmp_video_file_path = "/tmp/{}".format(file_name)
    s3_video_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':file_name}, ExpiresIn=120)
    print("video file path:", tmp_video_file_path)
    print("video signed url:", s3_video_signed_url)
    
    # Creating path for start image file
    tmp_start_image_path = "/tmp/imgOne.jpg"
    s3_start_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':'imgOne'}, ExpiresIn=120)
    print("start image path:", tmp_start_image_path)
    print("start image signed url:", s3_start_signed_url)
    
    # Creating path for end image file
    tmp_end_image_path = "/tmp/imgTwo.jpg"
    s3_end_signed_url = s3.generate_presigned_url('get_object', Params={'Bucket':bucket, 'Key':'imgTwo'}, ExpiresIn=120)
    print("end image path:", tmp_end_image_path)
    print("end image signed url:", s3_end_signed_url)
    
    # ffmpeg command to copy the video and images to the temporary directory 
    ffmpeg_cmd1 = "/opt/ffmpeglib/ffmpeg -i {} -c:v copy -c:a copy {}".format(s3_video_signed_url, tmp_video_file_path)
    ffmpeg_cmd2 = "/opt/ffmpeglib/ffmpeg -i {} {}".format(s3_start_signed_url, tmp_start_image_path)
    ffmpeg_cmd3 = "/opt/ffmpeglib/ffmpeg -i {} {}".format(s3_end_signed_url, tmp_end_image_path)
    
    # Makes the commands executable and runs them
    cmd1 = shlex.split(ffmpeg_cmd1)
    cmd2 = shlex.split(ffmpeg_cmd2)
    cmd3 = shlex.split(ffmpeg_cmd3)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    subprocess.run(cmd2, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    subprocess.run(cmd3, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Logs to check if file was copied to directory
    if not os.path.exists(tmp_video_file_path):
        print("Failed to copy video to tmp")
    if not os.path.exists(tmp_start_image_path):
        print("Failed to copy start image to tmp")
    if not os.path.exists(tmp_end_image_path):
        print("Failed to copy end image to tmp")

    return tmp_video_file_path, tmp_start_image_path, tmp_end_image_path
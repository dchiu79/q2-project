import shlex
import subprocess

import boto3

s3 = boto3.client('s3')

def save_thumbnail(video_path, video_name, bucket):
    thumbnail_name = "{}.png".format(video_name[:-4])
    thumbnail_path = "/tmp/{}".format(thumbnail_name)
    
    #ffmpeg command to screenshot a part of the video
    ffmpeg_cmd = "/opt/ffmpeg -i {} -ss 00:00:01 -vframes 1 {}".format(video_path, thumbnail_path)
    
    cmd1 = shlex.split(ffmpeg_cmd)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    #uploads the thumbnail file to s3 bucket
    s3.upload_file(thumbnail_path, bucket, thumbnail_name)
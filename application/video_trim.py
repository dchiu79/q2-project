import shlex
import subprocess
import urllib3
import json

import boto3

s3 = boto3.client('s3')

def trim_uploaded_video(video_path, video_file_name, bucket):
    trimmed_video_name = "{}.mp4".format(video_file_name[:-4])
    trimmed_video_path = "/tmp/{}".format(trimmed_video_name)
    
    start_timestamp, end_timestamp = get_timestamps()
    
    #ffmpeg command to trim a video based on two timestamps
    ffmpeg_cmd = "/opt/bin/ffmpeg -i {} -ss {} -to {} -c:a copy -c:v copy {}".format(video_path, start_timestamp, end_timestamp, trimmed_video_path)
    
    cmd1 = shlex.split(ffmpeg_cmd)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    #uploads the trimmed video file to s3 bucket
    s3.upload_file(trimmed_video_path, bucket, trimmed_video_name)
    
def get_timestamps():
    http = urllib3.PoolManager()
    
    url = "http://10.10.200.176:3000"
    print(url)
    r = http.request("GET", url)
    response = r.data.decode("utf-8")
    print(response)
    start_timestamp = response[response.index["start: "]+7:response.index[" end"]]
    end_timestamp = response[response.index["end: "]+5:]
    
    return (start_timestamp, end_timestamp)
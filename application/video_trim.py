import shlex
import subprocess

import boto3

s3 = boto3.client('s3')

def trim_uploaded_video(video_path, video_file_name, bucket, video_timestamps):
    
    # Creates video name and path for a trimmed version
    trimmed_video_name = "trimmed_{}.mp4".format(video_file_name[:-4])
    trimmed_video_path = "/tmp/{}".format(trimmed_video_name)
    
    # Finds the indexes where the timestamps are split
    first_split = video_timestamps.index("+")
    second_split = video_timestamps.index("+", first_split+1)
    
    print("First \"+\" position:", first_split)
    print("Second \"+\" position:", second_split)
    
    # Gets the start and end timestamps
    start_timestamp = video_timestamps[:first_split]
    end_timestamp = video_timestamps[first_split+1:second_split]
    
    print("Start:", start_timestamp)
    print("End:", end_timestamp)
    
    # ffmpeg command to trim a video based on two timestamps
    ffmpeg_cmd = "/opt/bin/ffmpeg -i {} -ss {} -to {} -c:a copy -c:v copy {}".format(video_path, start_timestamp, end_timestamp, trimmed_video_path)
    
    cmd1 = shlex.split(ffmpeg_cmd)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Uploads the trimmed video file to s3 bucket
    s3.upload_file(trimmed_video_path, 'trimmed-bucket', trimmed_video_name)
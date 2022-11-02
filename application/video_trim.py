import shlex
import subprocess

import boto3

s3 = boto3.client('s3')

def trim_uploaded_video(video_path, video_file_name, bucket, video_timestamps):
    
    # Creates video name and path for a trimmed version
    trimmed_video_name = "trimmed_{}.mp4".format(video_file_name[:-4])
    trimmed_video_path = "/tmp/{}".format(trimmed_video_name)
    
    # Creates video name and path for the extended version
    extend_trimmed_video_name = "first_{}".format(trimmed_video_name)
    extend_trimmed_video_path = "/tmp/{}".format(extend_trimmed_video_name)
    
    # Creates video name and path for the output version
    output_video_name = "output_{}".format(trimmed_video_name)
    output_video_path = "/tmp/{}".format(output_video_name)
    
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
    ffmpeg_cmd1 = "/opt/bin/ffmpeg -ss {} -to {} -i {} -c:v copy -c:a copy {}".format(start_timestamp, end_timestamp, video_path, trimmed_video_path)
    
    ## ffmpeg command to extend the first and last frames of the trimmed video by one second
    ffmpeg_cmd2 = "/opt/bin/ffmpeg -itsoffset 1 -i {} -c copy {}".format(trimmed_video_path, extend_trimmed_video_path)
    ffmpeg_cmd3 = "/opt/bin/ffmpeg -itsoffset -1 -i {} -c copy {}".format(extend_trimmed_video_path, output_video_path)
    
    cmd1 = shlex.split(ffmpeg_cmd1)
    cmd2 = shlex.split(ffmpeg_cmd2)
    cmd3 = shlex.split(ffmpeg_cmd3)
    
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("cmd1 done")
    subprocess.run(cmd2, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("cmd2 done")
    subprocess.run(cmd3, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("cmd3 done")
    
    # Uploads the trimmed video file to s3 bucket
    s3.upload_file(output_video_path, 'trimmed-bucket', output_video_name)
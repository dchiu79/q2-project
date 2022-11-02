import shlex
import subprocess

import boto3

s3 = boto3.client("s3")

def extend_video(trimmed_video_path, video_file_name):
    
    # Creates video name and path for the extended version
    extend_trimmed_video_name = "extend_{}.mp4".format(video_file_name[:-4])
    extend_trimmed_video_path = "/tmp/{}".format(extend_trimmed_video_name)
    
    # Creates video name and path for the output version
    output_video_name = "output_{}.mp4".format(video_file_name[:-4])
    output_video_path = "/tmp/{}".format(output_video_name)
    
    # ffmpeg command to extend the first and last frames of the trimmed video by one second
    ffmpeg_cmd1 = "/opt/bin/ffmpeg -itsoffset 1 -i {} -c copy {}".format(trimmed_video_path, extend_trimmed_video_path)
    ffmpeg_cmd2 = "/opt/bin/ffmpeg -itsoffset -1 -i {} -c copy {}".format(extend_trimmed_video_path, output_video_path)
    
    cmd1 = shlex.split(ffmpeg_cmd1)
    cmd2 = shlex.split(ffmpeg_cmd2)
    
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("vextend cmd1 done")
    subprocess.run(cmd2, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("vextend cmd2 done")
    
    # Uploads the extended trimmed video file to s3 bucket
    s3.upload_file(output_video_path, 'trimmed-bucket', output_video_name)
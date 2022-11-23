# Imports that handle command processing
import shlex
import subprocess

# Import that handle file management
import os

import boto3

# Initialize the s3 client
s3 = boto3.client('s3')

def append_images_to_video(video_file_name, trimmed_video_path, start_image_path, end_image_path):
    
    # Video name and path for the final output video after the trimming and appending
    output_video_name = "output_{}".format(video_file_name)
    output_video_path = "/tmp/{}".format(output_video_name)
    print("output video name:", output_video_name)
    print("output video path:", output_video_path)
    
    # Video paths for the start/end still image videos
    start_video_path = "{}.mp4".format(start_image_path[:-4])
    start_silent_video_path = "{}_silent.mp4".format(start_image_path[:-4])
    end_video_path = "{}.mp4".format(end_image_path[:-4])
    end_silent_video_path = "{}_silent.mp4".format(end_image_path[:-4])
    print("start video path:", start_video_path)
    print("start silent video path:", start_silent_video_path)
    print("end video path:", end_video_path)
    print("end silent video path:", end_silent_video_path)
    
    # ffmpeg commands to create a 1 second still image video with silent audio for the start image
    ffmpeg_cmd1 = "/opt/ffmpeg -y -loop 1 -i {} -t 1 -c:v copy {}".format(start_image_path, start_video_path)
    ffmpeg_cmd2 = "/opt/ffmpeg -y -f lavfi -i anullsrc -i {} -c:v copy -shortest {}".format(start_video_path, start_silent_video_path)
    
    # ffmpeg commands to create a 1 second still image video with silent audio for the end image
    ffmpeg_cmd3 = "/opt/ffmpeg -y -loop 1 -i {} -t 1 -c:v copy {}".format(end_image_path, end_video_path)
    ffmpeg_cmd4 = "/opt/ffmpeg -y -f lavfi -i anullsrc -i {} -c:v copy -shortest {}".format(end_video_path, end_silent_video_path)
    
    # ffmpeg command to concatenate the trimmed video and the two still image videos
    ffmpeg_cmd5 = "/opt/ffmpeg -y -i {} -i {} -i {} -filter_complex [0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a] -map [v] -map [a] -fps_mode vfr {}"\
                    .format(start_silent_video_path, trimmed_video_path, end_silent_video_path, output_video_path)

    # Makes the commands executable and runs them
    cmd1 = shlex.split(ffmpeg_cmd1)
    cmd2 = shlex.split(ffmpeg_cmd2)
    cmd3 = shlex.split(ffmpeg_cmd3)
    cmd4 = shlex.split(ffmpeg_cmd4)
    cmd5 = shlex.split(ffmpeg_cmd5)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    subprocess.run(cmd2, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    subprocess.run(cmd3, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    subprocess.run(cmd4, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    subprocess.run(cmd5, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Logs to check if file was copied to directory
    if not os.path.exists(start_video_path):
        print("Failed to create still start image video")
    if not os.path.exists(start_silent_video_path):
        print("Failed to create silent still start image video")
    if not os.path.exists(end_video_path):
        print("Failed to create still end image video")
    if not os.path.exists(end_silent_video_path):
        print("Failed to create silent still end image video")
    if not os.path.exists(output_video_path):
        print("Failed to concatenate video")

    return output_video_name, output_video_path
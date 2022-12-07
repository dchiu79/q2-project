# Imports that handle command processing
import shlex
import subprocess

# Import that handle file management
import os

def trim_video(video_path, video_file_name):
    
    # Creates video name and path for a trimmed version
    trimmed_video_name = "trimmed_{}.mp4".format(video_file_name[:-4])
    trimmed_video_path = "/tmp/{}".format(trimmed_video_name)
    
    print("Trimmed video name:", trimmed_video_name)
    print("Trimmed video path:", trimmed_video_path)

    # Make the file name suitable for extracting timestamps in the right format
    video_timestamps = video_file_name.replace("-", ":")
    print("Changed file format:", video_timestamps)
    
    # Finds the indexes where the timestamps are split
    first_split = video_timestamps.index("_")
    second_split = video_timestamps.index("_", first_split+1)
    
    print("First \"_\" position:", first_split)
    print("Second \"_\" position:", second_split)
    
    # Gets the start and end timestamps
    start_timestamp = video_timestamps[:first_split]
    end_timestamp = video_timestamps[first_split+1:second_split]
    
    print("Start:", start_timestamp)
    print("End:", end_timestamp)
    
    # ffmpeg command to trim a video based on two timestamps
    ffmpeg_cmd1 = "/opt/ffmpeg -y -ss {} -to {} -i {} -c:v copy -c:a copy {}"\
                    .format(start_timestamp, end_timestamp, video_path, trimmed_video_path)

    # Prepare the command to be run, then runs it
    cmd1 = shlex.split(ffmpeg_cmd1)
    subprocess.run(cmd1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Log to check if file was copied to directory
    if not os.path.exists(trimmed_video_path):
        print("Failed to trim the video")
    
    return trimmed_video_path
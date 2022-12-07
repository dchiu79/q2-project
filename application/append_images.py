# Imports that handle command processing
import shlex
import subprocess

# Import that handle file management
import os

def append_images_to_video(video_file_name, trimmed_video_path, start_image_path, end_image_path):
    
    # Video name and path for the final output video after the trimming and appending
    output_video_name = "output_{}.mp4".format(video_file_name[:-4])
    output_video_path = "/tmp/{}".format(output_video_name)
    
    print("output video name:", output_video_name)
    print("output video path:", output_video_path)
    
    # Video paths for the start and end still image videos
    start_video_path = "{}_v.mp4".format(start_image_path[:-4])
    start_video_audio_path = "{}_va.mp4".format(start_image_path[:-4])
    end_video_path = "{}_v.mp4".format(end_image_path[:-4])
    end_video_audio_path = "{}_va.mp4".format(end_image_path[:-4])
    
    print("start video path:", start_video_path)
    print("start silent video path:", start_video_audio_path)
    print("end video path:", end_video_path)
    print("end silent video path:", end_video_audio_path)
    
    # ffmpeg commands to create a 1 second start still image video and add silent audio to the video
    ffmpeg_cmd1 = "/opt/ffmpeg -y -framerate 1 -t 1 -i {} -c:v copy {}"\
                    .format(start_image_path, start_video_path)
    ffmpeg_cmd2 = "/opt/ffmpeg -y -f lavfi -i anullsrc -i {} -c:v copy -shortest {}"\
                    .format(start_video_path, start_video_audio_path)
    
    # ffmpeg commands to create a 1 second end still image video and add silent audio to the video
    ffmpeg_cmd3 = "/opt/ffmpeg -y -framerate 1 -t 1 -i {} -c:v copy {}"\
                    .format(end_image_path, end_video_path)
    ffmpeg_cmd4 = "/opt/ffmpeg -y -f lavfi -i anullsrc -i {} -c:v copy -shortest {}"\
                    .format(end_video_path, end_video_audio_path)
    
    # ffmpeg command to concatenate the trimmed video and the two still image videos
    ffmpeg_cmd5 = "/opt/ffmpeg -y -i {} -i {} -i {} -filter_complex [0:v]scale=720:480,setdar=1:1[0v];[1:v]scale=720:480,setdar=1:1[1v];[2:v]scale=720:480,setdar=1:1[2v];[0v][0:a][1v][1:a][2v][2:a]concat=n=3:v=1:a=1[v][a] -map [v] -map [a] -fps_mode vfr {}"\
                    .format(start_video_audio_path, trimmed_video_path, end_video_audio_path, output_video_path)

    # Prepare the commands to be run, then runs them
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
        print("Failed to create start still image video")
    if not os.path.exists(start_video_audio_path):
        print("Failed to create start still image video with audio")
    if not os.path.exists(end_video_path):
        print("Failed to create end still image video")
    if not os.path.exists(end_video_audio_path):
        print("Failed to create end still image video with audio")
    if not os.path.exists(output_video_path):
        print("Failed to concatenate video")

    return output_video_name, output_video_path
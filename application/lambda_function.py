# Imports for handling json
import json

# Imports for file management
import os
import urllib

# User defined functions
from download import download_vid_to_tmp
from video_trim import trim_video
from video_extend import extend_video
# from upload_video import upload_video_to_youtube

print('Loading function')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    
    clear_tmp_files()

    # Get the object and object's key from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    video_file_name = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
    # Make the file suitable for extracting timestamps in the right format
    video_timestamps = video_file_name.replace("-", ":")

    print("Video file name:", video_file_name)
    print("Changed file format:", video_timestamps)

    video_path = download_vid_to_tmp(bucket, video_file_name)
    
    trimmed_video_path = trim_video(video_path, video_file_name, video_timestamps)
    
    extend_video(trimmed_video_path, video_file_name)
    
    # upload_video_to_youtube(output_video_path)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    
def clear_tmp_files():
    tmp_files = os.listdir("../tmp")
    for file_name in tmp_files:
        os.remove("../tmp/" + file_name)
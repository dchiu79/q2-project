# Imports for handling json
import json

# Imports for file management
import os
import urllib

# User defined functions
from download import download_vid_to_tmp
from video_trim import trim_uploaded_video
# from upload_video import upload_video_to_youtube

print('Loading function')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    
    clear_tmp_files()

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
    video_file_name = key[:key.index(" ")]
    start_timestamp = key[key.index(" ")+1:key.index(" ", -1)]
    end_timestamp = key[key.index(" ", -1)+1:]
    print(video_file_name)
    print(start_timestamp)
    print(end_timestamp)

    video_path = download_vid_to_tmp(bucket, video_file_name)
    
    trim_uploaded_video(video_path, video_file_name, bucket, start_timestamp, end_timestamp)

    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    
def clear_tmp_files():
    tmp_files = os.listdir("../tmp")
    for file_name in tmp_files:
        os.remove("../tmp/" + file_name)
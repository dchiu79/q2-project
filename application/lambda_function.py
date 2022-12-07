# Imports for handling json
import json

# Imports for file management
import os
import urllib

import boto3

# User defined functions
from download import download_objects_to_tmp
from video_trim import trim_video
from append_images import append_images_to_video
from upload_to_s3 import upload_video_to_s3

print('Loading function')

s3 = boto3.client('s3')

def lambda_handler(event, context):

    clear_tmp_files()

    # Get the object and object's key from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    video_file_key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    print("Bucket:", bucket)
    print("Video file key:", video_file_key)

    video_path, video_file_name, start_image_path, end_image_path = download_objects_to_tmp(bucket, video_file_key)
    
    trimmed_video_path = trim_video(video_path, video_file_name)
    
    output_video_name, output_video_path = append_images_to_video(video_file_name, trimmed_video_path, start_image_path, end_image_path)
    
    upload_video_to_s3(output_video_name, output_video_path)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    
def clear_tmp_files():
    tmp_files = os.listdir("../tmp")
    for file_name in tmp_files:
        print(file_name)
        os.remove("../tmp/" + file_name)
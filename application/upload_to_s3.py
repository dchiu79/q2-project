import boto3

# Initialize the s3 client
s3 = boto3.client('s3')

def upload_video_to_s3(output_video_name, output_video_path):
    
    # Uploads the video file to an s3 bucket
    s3.upload_file(output_video_path, '', output_video_name)
# Jotto Video Trimmer

## Overview

This project aims to create a feature using React, Python, and AWS Services that will be integrated into the Jotto application. The feature is essentially a video trimmer with some additional add-ons.

* Requirements for use  
    * Zip Python code and upload to an AWS Lambda function  
    * Add [FFmpeg layer](https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/ffmpeg-lambda-layer)  
    * Create two S3 buckets, the first will act as a trigger for the Lambda function and the second will contain the video output  
    * Place inside the '' in upload_to_s3.py to your second bucket's name

* React interface  
    * Upload a video file button and displays the video  
    * Ranged slider to control the start and end points of the video and displays the current start and end timestamps  
    * Upload a start image file button  
    * Upload an end image file button  
    * Button to upload the video, start image, and end image files to S3 bucket and sends the timestamps in the file name  
    * Display the final editted video after the Lambda function processing has completed

* Python scripts  
    * Retrieves video, start image, and end image files from the S3 bucket  
    * Downloads the video, start image, and end image files to the temporary directory  
    * Trims the video based on the start and end timestamps provided in the video file name  
    * Creates one second still image videos using the image files  
    * Appends the start and end image videos to the trimmed video  
    * Uploads the video to another S3 bucket and YouTube
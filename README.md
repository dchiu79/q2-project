# Jotto Video Trimmer

## Overview

This project aims to create a prototype feature using React, Python, and AWS Services that will be integrated into the Jotto application. The feature is essentially a video trimmer with some additional add-ons.

* Requirements for use  
    * Zip Python code and upload to an AWS Lambda function  
    * Download [FFmpeg static build](https://johnvansickle.com/ffmpeg/), then untar the downloaded file and copy the ffmpeg binary file to another directory. Finally, zip the ffmpeg binary file before uploading it as a layer on AWS Lambda and adding it to your function  
    * Create two S3 buckets, the first will be added as a trigger for the Lambda function and the second will be used to upload the final video output  
    * Place the second bucket name inside the single quotes('') in upload_to_s3.py  
    * Setup a Zapier account to link your AWS's account S3 bucket upload to trigger YouTube upload on your YouTube account
 
* React interface  
    * Upload a video file button and displays the video  
    * Ranged slider to control and select the start and end points of the video. Displays the current selected start and end timestamps  
    * Upload a start image file button and displays the image  
    * Upload an end image file button and displays the image  
    * Button to upload the video, start image, and end image files to S3 bucket and sends the timestamps in the file name  
    * Display the final video output after the Lambda function processing has completed by fetching it from AWS bucket

* Python scripts  
    * Retrieves video, start image, and end image files from the S3 bucket  
    * Downloads the video, start image, and end image files to the temporary directory  
    * Trims the video based on the start and end timestamps provided in the video file name  
    * Creates one second still image videos using the image files  
    * Appends the start and end image videos to the trimmed video  
    * Uploads the video to another S3 bucket
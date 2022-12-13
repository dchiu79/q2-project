# Jotto Video Trimmer

## Overview

This project aims to create a prototype feature using React, Python, and AWS Services that will be integrated into the Jotto application developed by Quadrant 2. The feature is essentially a video trimmer with some additional add-ons.

* Prerequisities  
    * Amazon Web Services account  
    * Zapier account if you want the edited video uploaded to the S3 bucket to be uploaded elsewhere

* Setting up AWS, React, and/or Zapier  
    * AWS  
        * Zip Python scripts and upload the zip to an AWS Lambda function  
        * Download [FFmpeg static build](https://johnvansickle.com/ffmpeg/), then untar the downloaded file and copy the ffmpeg binary file to another directory. Finally, zip the ffmpeg binary file before uploading it as a layer on AWS Lambda and adding it to your function OR upload the ffmpeg zip file found in the root of this repository to create the layer on AWS Lambda  
        * Create two S3 buckets and configure their permissions based on your needs, but the first bucket must have PUT operation and the second bucket must have GET operation. Refer to [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) and [CORS configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html)  
        * The first bucket will be added as a trigger for the Lambda function and the second bucket will be used to upload the edited video  
        * Place the second bucket name inside the single quotes('') in upload_to_s3.py  
        * Create IAM user with full access to S3 bucket  
    * React  
        * Dependencies: @aws-sdk/client-s3, aws-sdk, bootstrap, buffer, react, react-bootstrap, react-dom, react-player, react-router-dom, react-scripts, redux, web-vitals  
        * In Home.js, replace or insert first bucket and region names where applicable  
        * In Home.js, insert using the created IAM user's access key and secret access key where applicable  
        * In Video.js, insert your second bucket name inside the fetch(), after the https:// and before the .s3  
    * Zapier  
        * Create a Zapier account, then create a zap to link your S3 bucket uploads to trigger a YouTube upload onto your YouTube account
 
* React interface  
    * Upload a video file button and displays the video  
    * Seekbar to select a start and end timestamp to trim the video based on  
    * Upload a start image file button and displays the image  
    * Upload an end image file button and displays the image  
    * Button to upload the video, start image, and end image files to S3 bucket and sends the timestamps in the file key  
    * The main application web page that contains all the UI elements listed above  
    * A welcome web page with a navigation bar and includes instructions on what the application does and how to use it  
    * Display the edited video on another page after the Lambda function has completed by fetching it from AWS bucket

* Python scripts  
    * Retrieves video, start image, and end image files from the S3 bucket  
    * Downloads the video, start image, and end image files to the temporary directory  
    * Trims the video based on the start and end timestamps appended in the video file name  
    * Creates one second still image videos using the image files  
    * Appends the start and end image videos to the trimmed video  
    * Uploads the edited video to another S3 bucket
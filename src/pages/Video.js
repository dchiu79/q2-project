import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
 // Helper function that creates an Amazon S3 service client module.
import React, {useState, useEffect} from "react"

export function Video(){
    const [posts, setPosts]= useState('');
    const REGION = "us-east-1";
// Create an Amazon S3 service client object.
    const s3Client = new S3Client({ region: REGION });
    const bucketParams = {
       
        Bucket: "test-bucketvid",
        Key: "maze.png"
      };

      const Run = () => {
        
        useEffect(()=>{
            async function fetchData(){
                try {
                    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
                    const data = S3Client.send(new GetObjectCommand(bucketParams));
                    // Convert the ReadableStream to a string.
                    await setPosts(data.Body.transformToString()); 
                  } catch (err) {
                    console.log("Error", err);
                  }
            }
            fetchData();
        },[]);
        
        
    };

    return (
        <div>
            <img src="https://test-bucketvid.s3.amazonaws.com/maze.png" />
            <video autoPlay={false} controls={true}>
                <source src="https://trimmed-video-tests3.s3.amazonaws.com/trimmed_00%3A00%3A19%2B00%3A01%3A20%2Bvideo-f33c5fed-4536-44c4-872b-384ab966341a-1663561128.mp4" type="video/mp4" />
            </video>
        </div>
        
        
    );
      
    

}
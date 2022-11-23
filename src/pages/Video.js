import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// Helper function that creates an Amazon S3 service client module.
import React, { useState, useEffect } from "react"
import AWS from "aws-sdk"

export function Video() {
    const REGION = "us-east-1";
    const creds = {
        accessKeyId: '',
        secretAccessKey: '',
        
    };
    const s3Client = new S3Client({ region: "us-east-1", credentials: creds})
    AWS.config.update({
        accessKeyId: '',
        secretAccessKey: '',
        region: "us-east-1"
    })
   
    const s3 = new AWS.S3();
     const [posts, setPosts] = useState('');
    // // Create an Amazon S3 service client object.
    // const s3Client = new S3Client({ region: REGION });
    const bucketParams = {

        Bucket: "test-bucketvid",
        Key: "maze.png"
    };
    const params = {
        Bucket: 'test-bucketvid',
        
        Key:'maze.png'
        
      };

    

        useEffect( () => {
    
                try {
                    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
                    const data = s3Client.send(new GetObjectCommand(bucketParams));
                    // Convert the ReadableStream to a string.
                     setPosts(data.Body.transformToBuffer());
                } catch (err) {
                    console.log("Error", err);
                }
            
        }, []);
   
        // const [listFiles, setListFiles] = useState([]);
      
        // useEffect(() => {
        //   s3.getObject(params, (err, data) => {
        //     if (err) {
        //       console.log(err, err.stack);
        //     } else {
        //       setListFiles(data.ContentType);
        //       console.log(data);
        //     }
        //   });
        // }, []);
        return (
            // <div>
            //     <img src="https://test-bucketvid.s3.amazonaws.com/maze.png" />
            //     <video autoPlay={false} controls={true}>
            //         <source src="https://test-bucketvid.s3.amazonaws.com/00%3A00%3A02%2B00%3A00%3A07%2Bfire.mp4" type="video/mp4" />
            //     </video>
            // </div>
            <div className='card'>
          <div className='card-header'>Files from s3 bucket</div>
          {/* <ul className='list-group'>
            {listFiles &&
              listFiles.map((name, index) => (
                <li className='list-group-item' key={index}>
                  {name.Key}
                </li>
              ))}
          </ul> */}
        
          <img alt="firimg" src={posts}></img>
        </div>
    
        );
};

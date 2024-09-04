import * as React from 'react';



const CollabRequestTemplate = ({
  username,name,id,project_name
}:{username:string,name:string,id:string,project_name:string}) => (
  <div>
    <h1>Your project ${project_name} has recieved a new collaboration request from <span className='font-bold'>${name}</span></h1>
    <a href={`${process.env.HOST_NAME}/account/project/dashboard/request/${id}`} className='bg-blue-600 text-white p-3'>View Now</a>
  </div>
);
export default CollabRequestTemplate
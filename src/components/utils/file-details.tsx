import React from 'react'
import { Card, CardContent } from '../ui/card'

const FileDetails = ({fileData}:{fileData:any}) => {
  return (
    <div className="container text-white max-w-[400px] z-20">
  
    {fileData && (
      <Card className="card">
        <CardContent>
          <p className="card-title">
            File Metadata
          </p>
          <p><strong>Name:</strong> {fileData.name}</p>
            <p><strong>Size:</strong> {fileData.size} bytes</p>
            <p><strong>Type:</strong> {fileData.type}</p>
            <p><strong>Last Modified:</strong> {new Date(fileData.lastModifiedDate).toLocaleString()}</p>
        </CardContent>
      </Card>
    )}
  </div>
  )
}

export default FileDetails
import { useState } from 'react';
import EditDialog from '../dialogs/edit-project-dialog';
import { Project } from '@/types/index';
import ImageGallery from '../gallery/image-gallery';

export default function ProjectGallery({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { 
      name: 'images', 
      label: 'Project Images', 
      type: 'image-array',
      description: 'Add multiple images to showcase your project'
    }
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-lg relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
      >
        Edit
      </button>

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">Project Gallery</h2>
      
      <ImageGallery images={project.images} />

      <EditDialog
        isOpen={isEditing}
        pid={project._id}
        onClose={() => setIsEditing(false)}
        title="Edit Project Gallery"
        fields={fields}
        initialData={project}
        onSave={async (data) => {
          console.log('Saving:', data);
          // Implement save logic
          setIsEditing(false);
        }}
      />
    </div>
  );
}
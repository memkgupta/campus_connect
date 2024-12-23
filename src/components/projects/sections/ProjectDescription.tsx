import { useState } from 'react';
import EditDialog from '../dialogs/EditDialog';
import { Project } from '@/types/index';

export default function ProjectDescription({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'documentation', label: 'Documentation', type: 'textarea' },
    { name: 'demo', label: 'Demo', type: 'text' }
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-lg relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
      >
        Edit
      </button>

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">About the Project</h2>
      <p className="text-white mb-4">{project.description}</p>
      
      {project.documentation && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Documentation</h3>
          <p className="text-white">{project.documentation}</p>
        </div>
      )}

      {project.demo && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Demo</h3>
          <a href={project.demo} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            View Demo
          </a>
        </div>
      )}

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Project Description"
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
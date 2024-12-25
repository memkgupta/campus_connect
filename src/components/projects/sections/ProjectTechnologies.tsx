import { useState } from 'react';
import EditDialog from '../dialogs/EditDialog';
import { Project } from '@/types/index';

export default function ProjectTechnologies({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { name: 'technologiesUsed', label: 'Technologies', type: 'tags' },
    { name: 'tags', label: 'Tags', type: 'tags' }
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-lg relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
      >
        Edit
      </button>

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">Technologies & Tags</h2>
      
      <div className="mb-4">
        <h3 className="text-lg text-yellow-400 mb-2">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologiesUsed.split(',').map((tech) => (
            <span key={tech} className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg text-yellow-400 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags.split(',').map((tag) => (
            <span key={tag} className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <EditDialog
        isOpen={isEditing}
        pid={project._id}
        onClose={() => setIsEditing(false)}
        title="Edit Technologies & Tags"
        fields={fields}
        initialData={project}
        onSave={async (data) => {
          
          
          setIsEditing(false);
        }}
      />
    </div>
  );
}
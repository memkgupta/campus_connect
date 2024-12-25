import { useState } from 'react';
import EditDialog from '../dialogs/EditDialog';
import { Project } from '@/types/index';
import { Github, Globe } from 'lucide-react';

export default function ProjectLinks({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { name: 'github', label: 'GitHub Link', type: 'text' },
    { name: 'live_link', label: 'Live Link', type: 'text' }
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-lg relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
      >
        Edit
      </button>

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">Project Links</h2>
      <div className="space-y-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-white hover:text-yellow-400"
          >
            <Github size={20} />
            <span>View on GitHub</span>
          </a>
        )}
        {project.live_link && (
          <a
            href={project.live_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-white hover:text-yellow-400"
          >
            <Globe size={20} />
            <span>View Live Site</span>
          </a>
        )}
      </div>

      <EditDialog
        isOpen={isEditing}
        pid={project._id}
        onClose={() => setIsEditing(false)}
        title="Edit Project Links"
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
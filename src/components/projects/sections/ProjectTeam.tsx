import { useState } from 'react';
import EditDialog from '../dialogs/EditDialog';
import { Project } from '@/types/index';

export default function ProjectTeam({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { name: 'lead', label: 'Project Lead', type: 'text' },
    { name: 'openForCollab', label: 'Open for Collaboration', type: 'checkbox' },
    { 
      name: 'contributors',
      label: 'Contributors',
      type: 'contributors',
      subfields: [
        { name: 'user', label: 'User', type: 'user-select' },
        { name: 'role', label: 'Role', type: 'text' }
      ]
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

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">Team</h2>
      
      {project.lead && (
        <div className="mb-4">
          <h3 className="text-lg text-yellow-400 mb-2">Project Lead</h3>
          <p className="text-white">{project.lead}</p>
        </div>
      )}

      {project.contributors.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg text-yellow-400 mb-2">Contributors</h3>
          <div className="space-y-2">
            {project.contributors.map((contributor, index) => (
              <div key={index} className="flex items-center space-x-2 text-white">
                <span>{contributor.user.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-yellow-400">{contributor.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.openForCollab && (
        <div className="mt-4">
          <span className="bg-green-900 text-green-400 px-3 py-1 rounded-full text-sm">
            Open for Collaboration
          </span>
        </div>
      )}

      <EditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Team Information"
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
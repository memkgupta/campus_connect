import { useState } from 'react';
import EditDialog from '../dialogs/EditDialog';
import { Project } from '@/types/index';
import { format } from 'date-fns';

export default function ProjectDates({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { name: 'start', label: 'Start Date', type: 'date' },
    { name: 'end', label: 'End Date', type: 'date' },
    { name: 'currently_working', label: 'Currently Working', type: 'checkbox' }
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-lg relative">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
      >
        Edit
      </button>

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">Timeline</h2>
      <div className="space-y-2 text-white">
        <p>Started: {project.start}</p>
        {project.currently_working ? (
          <p className="text-green-400">Currently Working</p>
        ) : project.end ? (
          <p>Ended: {project.end}</p>
        ) : null}
      </div>

      <EditDialog
      pid={project._id}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Project Timeline"
        fields={fields}
        initialData={project}
        onSave={async (data) => {
          
          // Implement save logic
          setIsEditing(false);
        }}
      />
    </div>
  );
}
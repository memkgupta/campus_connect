import { useState } from 'react';
import EditDialog from '../dialogs/EditDialog';
import { Project } from '@/types/index';
import { projectCategories } from '@/constants';

export default function ProjectHeader({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'category', label: 'Category', type: 'select', options: projectCategories },
    { name: 'banner', label: 'Banner Image', type: 'image' }
  ];

  return (
    <div className="relative bg-gray-900 p-6 rounded-lg">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
      >
        Edit
      </button>

      <img src={project.banner} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h1 className="text-3xl font-bold text-yellow-400">{project.title}</h1>
      <span className="inline-block bg-blue-900 text-yellow-400 px-3 py-1 rounded-full text-sm">
        {project.category}
      </span>

      <EditDialog
      pid={project._id}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Project Header"
        fields={fields}
        initialData={{title:project.title,category:project.category,banner:project.banner}}
        onSave={async (data) => {
          console.log('Saving:', data);
          // Implement save logic
          setIsEditing(false);
        }}
      />
    </div>
  );
}
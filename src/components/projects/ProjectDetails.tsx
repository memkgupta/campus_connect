import { useState } from 'react';
import ProjectHeader from './sections/ProjectHeader';
import ProjectDescription from './sections/ProjectDescription';
import ProjectDates from './sections/ProjectDates';
import ProjectLinks from './sections/ProjectLinks';
import ProjectTeam from './sections/ProjectTeam';
import ProjectTechnologies from './sections/ProjectTechnologies';
import { Project } from '@/types/index';
import ProjectGallery from './sections/ProjectGallery';

export default function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ProjectHeader project={project} />
      <ProjectDescription project={project} />
      <ProjectDates project={project} />
      <ProjectLinks project={project} />
      {/* <ProjectGallery project={project}/> */}
      <ProjectTechnologies project={project} />
      <ProjectTeam project={project} />
    </div>
  );
}
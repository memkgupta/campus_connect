import { useState } from 'react';
import ProjectHeader from './sections/project-header';
import ProjectDescription from './sections/project-description';
import ProjectDates from './sections/project-dates';
import ProjectLinks from './sections/project-links';
import ProjectTeam from './sections/project-team';
import ProjectTechnologies from './sections/project-technologies';
import { Project } from '@/types/index';
import ProjectGallery from './sections/project-gallery';

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
import { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

/**
 * Custom hook to interact with the shared projects state.
 * Returns customer-facing filtered project list, the complete list for management,
 * specification details lookups, related items recommendations, and database actions.
 */
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }

  const {
    projects: allProjects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    refreshProjects
  } = context;

  // Filter projects for user-facing lists (active or coming-soon)
  const projects = allProjects.filter((p) => p.status === 'active' || p.status === 'coming-soon');

  const getProjectBySlug = (slug) => {
    // Look up in allProjects so admins can preview draft/archived details pages
    return allProjects.find((p) => p.slug === slug);
  };

  const getRelatedProjects = (project) => {
    if (!project) return [];
    
    // Find projects in same category from customer-facing lists
    const related = projects
      .filter((p) => p.id !== project.id && p.category === project.category)
      .slice(0, 4);

    if (related.length < 4) {
      // Pad with other projects
      const fillers = projects
        .filter((p) => p.id !== project.id && !related.find((r) => r.id === p.id))
        .slice(0, 4 - related.length);
      related.push(...fillers);
    }
    return related;
  };

  return {
    projects, // Filtered active/coming-soon projects
    allProjects, // All projects including drafts
    isLoading,
    getProjectBySlug,
    getRelatedProjects,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    refreshProjects
  };
};

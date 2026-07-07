import React, { createContext, useState, useEffect } from 'react';
import { ProjectRepository } from '../services/projectRepository';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children, initialProjects }) => {
  const [projects, setProjects] = useState(initialProjects || []);
  const [isLoading, setIsLoading] = useState(!initialProjects);

  const loadProjects = async () => {
    if (initialProjects && initialProjects.length > 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await ProjectRepository.getAll();
      setProjects(data);
    } catch (e) {
      console.error("Failed to load projects from repository", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [initialProjects]);

  const addProject = async (project) => {
    try {
      const created = await ProjectRepository.create(project);
      setProjects((prev) => [...prev, created]);
      return created;
    } catch (e) {
      console.error("Failed to create project", e);
      throw e;
    }
  };

  const updateProject = async (id, fields) => {
    try {
      const updated = await ProjectRepository.update(id, fields);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (e) {
      console.error("Failed to update project", e);
      throw e;
    }
  };

  const deleteProject = async (id) => {
    try {
      await ProjectRepository.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Failed to delete project", e);
      throw e;
    }
  };

  const duplicateProject = async (id) => {
    try {
      const duplicated = await ProjectRepository.duplicate(id);
      setProjects((prev) => [...prev, duplicated]);
      return duplicated;
    } catch (e) {
      console.error("Failed to duplicate project", e);
      throw e;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        duplicateProject,
        refreshProjects: loadProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

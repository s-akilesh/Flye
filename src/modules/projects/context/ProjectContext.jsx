import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ProjectRepository } from '../services/projectRepository';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children, initialProjects }) => {
  const [projects, setProjects] = useState(initialProjects || []);
  const [isLoading, setIsLoading] = useState(!initialProjects);

  const loadProjects = useCallback(async () => {
    if (initialProjects && initialProjects.length > 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Projects fetch timeout')), 3500)
      );
      const data = await Promise.race([ProjectRepository.getAll(), timeoutPromise]);
      setProjects(data);
    } catch (e) {
      console.error("Failed to load projects from repository", e);
    } finally {
      setIsLoading(false);
    }
  }, [initialProjects]);

  useEffect(() => {
    loadProjects();
  }, [initialProjects, loadProjects]);

  const addProject = useCallback(async (project) => {
    try {
      const created = await ProjectRepository.create(project);
      setProjects((prev) => [...prev, created]);
      return created;
    } catch (e) {
      console.error("Failed to create project", e);
      throw e;
    }
  }, []);

  const updateProject = useCallback(async (id, fields) => {
    try {
      const updated = await ProjectRepository.update(id, fields);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (e) {
      console.error("Failed to update project", e);
      throw e;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      await ProjectRepository.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Failed to delete project", e);
      throw e;
    }
  }, []);

  const duplicateProject = useCallback(async (id) => {
    try {
      const duplicated = await ProjectRepository.duplicate(id);
      setProjects((prev) => [...prev, duplicated]);
      return duplicated;
    } catch (e) {
      console.error("Failed to duplicate project", e);
      throw e;
    }
  }, []);

  const contextValue = useMemo(() => ({
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    refreshProjects: loadProjects
  }), [projects, isLoading, addProject, updateProject, deleteProject, duplicateProject, loadProjects]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

import { useState, useEffect, useCallback } from 'react';

const getStorageKey = (projectId: number) => `smekta:estimate-collapsed:${projectId}`;

const loadCollapsedIds = (projectId: number): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(getStorageKey(projectId));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'number') : [];
  } catch {
    return [];
  }
};

const saveCollapsedIds = (projectId: number, ids: number[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(projectId), JSON.stringify(ids));
  } catch {
    // ignore
  }
};

export const useCollapsedSections = (projectId: number) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const ids = loadCollapsedIds(projectId);
    setCollapsedIds(new Set(ids));
    setHydrated(true);
  }, [projectId]);

  useEffect(() => {
    if (hydrated) {
      saveCollapsedIds(projectId, Array.from(collapsedIds));
    }
  }, [projectId, collapsedIds, hydrated]);

  const toggleSection = useCallback((sectionId: number) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const expandSection = useCallback((sectionId: number) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  }, []);

  const collapseAll = useCallback((sectionIds: number[]) => {
    setCollapsedIds(new Set(sectionIds));
  }, []);

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  const isCollapsed = useCallback((sectionId: number) => collapsedIds.has(sectionId), [collapsedIds]);

  const allCollapsed = useCallback((sectionIds: number[]) => 
    sectionIds.length > 0 && sectionIds.every(id => collapsedIds.has(id)),
    [collapsedIds]
  );

  return {
    isCollapsed,
    toggleSection,
    expandSection,
    collapseAll,
    expandAll,
    allCollapsed,
    hydrated,
  };
};

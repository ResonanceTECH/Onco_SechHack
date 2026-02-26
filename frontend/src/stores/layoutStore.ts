import { create } from 'zustand';

interface LayoutState {
  leftPanelOpen: boolean;
  middlePanelOpen: boolean;
  rightPanelOpen: boolean;
  toggleLeftPanel: () => void;
  toggleMiddlePanel: () => void;
  toggleRightPanel: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  leftPanelOpen: true,
  middlePanelOpen: true,
  rightPanelOpen: false,
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  toggleMiddlePanel: () => set((s) => ({ middlePanelOpen: !s.middlePanelOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
}));

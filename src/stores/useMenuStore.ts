import { create } from 'zustand';

export interface ITimingSlot {
  startTime: string; // Format: "5:30am"
  endTime: string; // Format: "10:00am"
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  desc: string;
  morningTimings?: ITimingSlot | null;
  eveningTimings?: ITimingSlot | null;
  timingTemplate?: string | null;
  ingredients: string[]; // Array of ingredient names
  priority: number;
  imgSrc: string;
  dietaryLabels?: string[]; // Default: ["vegetarian"]
  allergens?: string[]; // Default: []
  createdAt?: string;
  updatedAt?: string;
}

interface MenuStore {
  items: MenuItem[];
  loading: boolean;
  error: string | null;

  // Actions
  setItems: (items: MenuItem[]) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMenuStore = create<MenuStore>(set => ({
  items: [],
  loading: false,
  error: null,

  setItems: items => set({ items, error: null }),
  addItem: item => set(state => ({ items: [...state.items, item] })),
  updateItem: (id, updates) =>
    set(state => ({
      items: state.items.map(item =>
        item._id === id ? { ...item, ...updates } : item,
      ),
    })),
  deleteItem: id =>
    set(state => ({
      items: state.items.filter(item => item._id !== id),
    })),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));

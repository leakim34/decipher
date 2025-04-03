import type { ApplicationInteraction } from '$lib/client/services/algorand-wallet.service';

// Interface for application state
export interface AppState {
  // Selected application ID
  selectedApplicationId: string | null;
  
  // UI state
  activeTab: 'application' | 'wallet';
  
  // Wallet state
  walletAddress: string;
  resolvedAddress: string;
  walletInteractions: ApplicationInteraction[];
  
  // Methods
  selectApplication: (appId: number | string | null) => void;
  switchToApplicationTab: () => void;
}

// Create a singleton store for app state
export class AppStateStore {
  private static instance: AppStateStore;
  
  // State variables using runes
  public selectedApplicationId = $state<string | null>(null);
  public activeTab = $state<'application' | 'wallet'>('application');
  public walletAddress = $state('');
  public resolvedAddress = $state('');
  public walletInteractions = $state<ApplicationInteraction[]>([]);
  
  // Private constructor to enforce singleton pattern
  private constructor() {}
  
  // Get the singleton instance
  public static getInstance(): AppStateStore {
    if (!AppStateStore.instance) {
      AppStateStore.instance = new AppStateStore();
    }
    return AppStateStore.instance;
  }
  
  // Methods
  public selectApplication(appId: number | string | null): void {
    if (appId === null) {
      this.selectedApplicationId = null;
    } else {
      this.selectedApplicationId = appId.toString();
    }
  }
  
  public switchToApplicationTab(): void {
    this.activeTab = 'application';
  }
  
  // Update wallet interactions data
  public setWalletData(
    walletAddress: string, 
    resolvedAddress: string, 
    interactions: ApplicationInteraction[]
  ): void {
    this.walletAddress = walletAddress;
    this.resolvedAddress = resolvedAddress;
    this.walletInteractions = interactions;
  }
}

// Export a singleton instance
export const appState = AppStateStore.getInstance(); 
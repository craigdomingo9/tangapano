/**
 * Storage Service Abstraction
 * Provides a clean API for persistent storage with error handling and future extensibility
 */

const STORAGE_KEYS = {
  INTEREST_FORM: "tangapano_interest_form",
} as const;

export class StorageService {
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage key ${key}:`, error);
      return null;
    }
  }

  static setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to storage key ${key}:`, error);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key ${key}:`, error);
    }
  }

  // Domain-specific methods
  static getFormData(): any {
    return this.getItem(STORAGE_KEYS.INTEREST_FORM);
  }

  static saveFormData(formData: any): void {
    this.setItem(STORAGE_KEYS.INTEREST_FORM, formData);
  }

  static clearFormData(): void {
    this.removeItem(STORAGE_KEYS.INTEREST_FORM);
  }
}

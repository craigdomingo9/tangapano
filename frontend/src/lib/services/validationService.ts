/**
 * Validation Service
 * Centralized validation logic for form fields
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ValidationService {
  static validateFullName(name: string): string | null {
    if (!name || name.length < 2 || name.trim().split(" ").length < 2) {
      return "Please enter your full name";
    }
    return null;
  }

  static validateStudentId(studentId: string): string | null {
    if (!/^[A-Z0-9]{6,12}$/i.test(studentId)) {
      return "Please enter a valid student ID";
    }
    return null;
  }

  static validateWhatsAppNumber(phone: string): string | null {
    const cleanPhone = phone.replace(/\s/g, "");
    if (!/^\+?[\d\s-]{10,}$/.test(cleanPhone)) {
      return "Please enter a valid phone number";
    }
    return null;
  }

  static validateStep2(formData: any): ValidationResult {
    const errors: Record<string, string> = {};

    const fullNameError = this.validateFullName(formData.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const studentIdError = this.validateStudentId(formData.studentId);
    if (studentIdError) errors.studentId = studentIdError;

    const whatsappError = this.validateWhatsAppNumber(formData.whatsappNumber);
    if (whatsappError) errors.whatsappNumber = whatsappError;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

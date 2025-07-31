import { MessageField } from '@/types/iot';

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  missingFields: string[];
}

export const validateField = (field: MessageField, value: any): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (field.required && (value === undefined || value === null || value === '')) {
    errors.push(new ValidationError(`${field.label} is required`, field.name, 'REQUIRED'));
  }
  
  if (field.type === 'number' && value !== undefined && value !== null) {
    if (isNaN(Number(value))) {
      errors.push(new ValidationError(`${field.label} must be a valid number`, field.name, 'INVALID_NUMBER'));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    missingFields: errors.filter(e => e.code === 'REQUIRED').map(e => e.field!).filter(Boolean)
  };
};

export const validateFormData = (fields: MessageField[], formData: Record<string, any>): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allMissingFields: string[] = [];
  
  for (const field of fields) {
    const result = validateField(field, formData[field.name]);
    allErrors.push(...result.errors);
    allMissingFields.push(...result.missingFields);
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    missingFields: allMissingFields
  };
};
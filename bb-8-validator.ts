import type { ValidationChecks } from 'langium';
import type { Bb8AstType } from './generated/ast.js';
import type { Bb8Services } from './bb-8-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Bb8Services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.Bb8Validator;
    const checks: ValidationChecks<Bb8AstType> = {
        
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Bb8Validator {

   
}

import type { ValidationChecks } from 'langium';
import type { AndesAstType } from './generated/ast.js';
import type { AndesServices } from './andes-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: AndesServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.AndesValidator;
    const checks: ValidationChecks<AndesAstType> = {
        
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class AndesValidator {

   
}

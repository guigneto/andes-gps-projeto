import fs from "fs";
import path from 'path';
import { Model, UseCase, isActor, isUseCase } from "../../../language/generated/ast.js";
import { expandToStringWithNL } from "langium/generate";

export class UseCaseGeneratorService {
    private model: Model;
    private targetFolder: string;

    constructor(model: Model, targetFolder: string) {
        this.model = model;
        this.targetFolder = targetFolder;
    } 

    public generate(): void {
        const modules = this.model.components.filter(isUseCase);
        const filePath = path.join(this.targetFolder, "usecasemodel.puml");

        // Variável para acumular todos os casos de uso
        let allUseCasesContent = `@startuml UseCaseDiagram\n`;

        for (const module of modules) {
            allUseCasesContent += this.createModelUseCase(module);
        }

        allUseCasesContent += `@enduml`;

        // Escreve o conteúdo acumulado no arquivo
        fs.writeFileSync(filePath, allUseCasesContent);
    }

    private createModelUseCase(module: UseCase): string {
        // Extrai os atores e verifica se cada referência é válida
        const actors = module.actors.map(actor => actor.ref).filter(isActor);
        
        // Extrai as dependências e verifica se cada referência é válida
        const dependencies = module.depends.map(dep => dep.ref?.id).filter(Boolean);

        return expandToStringWithNL`
            ' Definindo atores
            ${actors.map(actor => `actor ${actor.name}`).join('\n')}
            
            ' Caso de uso principal
            usecase (${module.id}) as "${module.name_fragment || module.id}"
    
            ' Relações entre atores e caso de uso
            ${actors.map(actor => `${actor.name} -> (${module.id})`).join('\n')}
            
            ' Dependências de outros casos de uso
            ${dependencies.map(dep => `(${module.id}) --> (${dep})`).join('\n')}
        `;
    }
}

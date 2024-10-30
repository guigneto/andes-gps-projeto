import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument } from "langium";
import { CancellationToken } from "vscode-languageclient";
import { Model, isActor, isRequirements, isUseCase } from "./generated/ast.js";


/**
 * Gerador customizado para o escopo global do arquivo.
 * Por padrão, o escopo global só contém os filhos do nó raiz,
 * sejam acessíveis globalmente
 */
export class CustomScopeComputation extends DefaultScopeComputation {
    override async computeExports(document: LangiumDocument<AstNode>, cancelToken?: CancellationToken | undefined): Promise<AstNodeDescription[]> {
        // Os nós que normalmente estariam no escopo global
        
        const default_global = await super.computeExports(document, cancelToken)

        const root = document.parseResult.value as Model

        const requirements = root.components.filter(isRequirements).flatMap(requirements => 
            requirements.requirements.map(requirement => this.descriptions.createDescription(requirement, `${requirement.$container.id}.${requirement.id}`, document)))
        
        const useCases = root.components.filter(isUseCase).map(useCase => 
                this.descriptions.createDescription(useCase, `${useCase.id}`, document))
        
        const events = root.components.filter(isUseCase).flatMap(useCase => 
            useCase.events.map(event => this.descriptions.createDescription(event, `${event.$container.id}.${event.id}`, document)))
        
        const actors = root.components.filter(isActor).flatMap(actor => 
            this.descriptions.createDescription(actor, `${actor.id}`, document))
                
        root.components.filter(isRequirements).map(
                requirement => this.exportNode(requirement, default_global, document))

        root.components.filter(isUseCase).map(
                    useCase => this.exportNode(useCase, default_global, document))
        
        root.components.filter(isActor).map(
            actor => this.exportNode(actor, default_global, document))

        root.components.filter(isUseCase).map(
                        usecase => usecase.events.map(event=>this.exportNode(event, default_global, document)))
            

        return default_global.concat(requirements, useCases, events, actors)
    }
}

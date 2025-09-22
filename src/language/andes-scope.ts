import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument } from "langium";
import { CancellationToken } from "vscode-languageclient";
import { Model, isModule, isLocalEntity, FunctionalRequirement, NonFunctionalRequirement, BussinesRule } from "./generated/ast.js";


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

        const array: (FunctionalRequirement | NonFunctionalRequirement | BussinesRule)[] = [];

        root.Requirements?.fr.forEach(fr => array.push(fr));
        root.Requirements?.nfr.forEach(nfr => array.push(nfr));
        root.Requirements?.br.forEach(br => array.push(br));

        array.map(requirement => this.exportNode(requirement, default_global, document))    
        
        const requirements =array.map(requirement => this.descriptions.createDescription(requirement, `${requirement.$container.id}.${requirement.id}`, document))
        
        const useCases = root.UseCase.map(useCase => 
                this.descriptions.createDescription(useCase, `${useCase.id}`, document))
        
        const events = root.UseCase.flatMap(useCase => 
            useCase.events.map(event => this.descriptions.createDescription(event, `${event.$container.id}.${event.id}`, document)))

        root.UseCase.map(
                    useCase => this.exportNode(useCase, default_global, document))
        
        root.Actor.map(
            actor => this.exportNode(actor, default_global, document))

        root.UseCase.map(
                        usecase => usecase.events.map(event=>this.exportNode(event, default_global, document)))
        
        root.AbstractElement.filter(isModule).map(k =>
            [...k.localEntities, ...k.enumXs, ...k.modules].map(e =>
                this.exportNode(e, default_global, document)
            )
        )
        
        const entities = root.AbstractElement.filter(isModule).flatMap(m =>
            [...m.localEntities, ...m.enumXs, ...m.modules].filter(isLocalEntity).map(e =>
                this.descriptions.createDescription(e, `${e.$container.name}.${e.name}`, document)
            )
        )

        return default_global.concat(requirements, useCases, events, entities)
    }
}

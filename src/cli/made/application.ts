import { Event, Model, Module, UseCase, isModule } from "../../language/generated/ast.js"
import fs from "fs";
import path from 'path'
import { createPath } from "../generator-utils.js";
import { expandToString, expandToStringWithNL } from "langium/generate";


type Dictionary = Record<string, any>;
/* Cada caso de uso é mapeado para um EPIC e um Evento para um caso de uso */
export class MadeApplication {
    model: Model
    target_folder:string
    MANAGEMENT_PATH: string
    dict: Dictionary = {};
    
    constructor (model: Model, target_folder:string){
        this.model = model
        this.target_folder = target_folder  
        
        fs.mkdirSync(this.target_folder, {recursive:true})        
        this.MANAGEMENT_PATH = createPath(this.target_folder,'made') 
    }

    public create(){
        
        const project = this.model.project?.id.toLocaleLowerCase() ?? "file"
        fs.writeFileSync(path.join(this.MANAGEMENT_PATH , `${project}.made`), this.createBacklog())
    
    }

    private createBacklog():string{

        const projectID = this.model.project?.id ?? "Name"
        const useCases = this.model.UseCase
        const project = this.model.project

        const modulesClassDiagram = this.model.AbstractElement.filter(isModule)
        
        useCases.map(useCase=>  this.dict[useCase.id]=`${projectID}.${useCase.id.toLocaleLowerCase()}`)

        useCases.map(useCase=> useCase.events.map((event,index) =>this.dict[event.id]=`${projectID}.${useCase.id.toLocaleLowerCase()}_${index}`))

        return expandToStringWithNL`
        project ${projectID}{
            name: "${project?.name_fragment?? "nodefined"}"
            description: "${project?.description}"
        }
        backlog ${projectID}{
            name: "${project?.name_fragment?? "nodefined"}"
            description: "${project?.description}"
            ${modulesClassDiagram.length > 0? this.createDiagramModel(modulesClassDiagram): " "}
            ${useCases.map(useCase=>  this.createEPIC(projectID, useCase)).join(`\n`)}
        }
        `
    }

    private createDiagramModel (modules: Module[]):string {
        return expandToStringWithNL`
        epic domaindiagram {
            name: "Create Problem Domain Modules"
            description: "Create Problem Domain Modules"
            ${modules.map(module => module.name? this.createStoryFromModule(module): "").join("\n")}
        }        `
    }

    private createStoryFromModule(module: Module){
        return expandToStringWithNL`
            story createmodule${module.name?.toLocaleLowerCase()}{
                name: "Create database infrastruture to module ${module.name}"
                description: "Create database infrastruture to ${module.name}"
                
                task createmodule {
                    name: "Implements domain modules"                    
                }

                task createrepository {
                    name: "Implements data repository"
                    depends: domaindiagram.createmodule${module.name?.toLocaleLowerCase()}.createmodule
                }
            }
        `
        
    }

    private createEPICDependencie(item:UseCase|Event):string{
        
        const depends:string[] = []
        
        if (item.depend){
            
            depends.push(`${this.dict[item.depend.ref?.id||""]}`)
        }
        item.depends.map(depend => depends.push(`${this.dict[depend.ref?.id||""]}`))


        return expandToString`${depends.length >0 ? "depends:" :""} ${depends.map(value => `${value}`).join(`,`)}        
        `
    }

    private createEPIC(projectID: string, usecase:UseCase):string {
        return expandToStringWithNL`
        epic ${usecase.id.toLocaleLowerCase()} {
            name:"${usecase.name_fragment}" 
            description: "${usecase.description ?? ""}" 
            ${this.createEPICDependencie(usecase)}         
            ${usecase.events.map((event,index) => this.createUserStory(event, usecase,index,projectID)).join(`\n`)}
        }
        `
    }

    private createUserStory(event: Event, usecase:UseCase, index:number, projectID:string){
        // TODO pensar em como fazer assim
        return expandToStringWithNL`
        story  ${usecase.id.toLocaleLowerCase()}_${index} {
            name:"${event.name_fragment}" 
            description: "${event.description ?? ""}"  
            ${this.createEPICDependencie(event)}
        }
        `
    }
}
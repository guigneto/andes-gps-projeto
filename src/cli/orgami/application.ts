import { Event, Model, UseCase, isUseCase } from "../../language/generated/ast.js"
import fs from "fs";
import path from 'path'
import { createPath } from "../generator-utils.js";
import { expandToString, expandToStringWithNL } from "langium/generate";


type Dictionary = Record<string, any>;

export class OrigamiApplication {
    model: Model
    target_folder:string
    MANAGEMENT_PATH: string
    dict: Dictionary = {};
    
    constructor (model: Model, target_folder:string){
        this.model = model
        this.target_folder = target_folder  
        
        fs.mkdirSync(this.target_folder, {recursive:true})        
        this.MANAGEMENT_PATH = createPath(this.target_folder,'management') 
    }

    public create(){
        
        const project = this.model.project?.id.toLocaleLowerCase() ?? "file"
        fs.writeFileSync(path.join(this.MANAGEMENT_PATH , `${project}.origami`), this.createBacklog())
    
    }

    private createBacklog():string{

        const projectID = this.model.project?.id.toLocaleLowerCase() ?? "nodefined"
        const useCases = this.model.components.filter(isUseCase)
        const project = this.model.project

        useCases.map(useCase=>  this.dict[useCase.id]=`${projectID}.${useCase.id.toLocaleLowerCase()}`)

        useCases.map(useCase=> useCase.events.map((event,index) =>this.dict[event.id]=`${projectID}.${useCase.id.toLocaleLowerCase()}_${index}`))

        return expandToStringWithNL`
        backlog ${projectID}{
            name: "${project?.name_fragment?? "nodefined"}"
            description: "${project?.description}"
            
            ${useCases.map(useCase=>  this.createEPIC(projectID, useCase)).join(`\n`)}

        }
        `
    }

    private createEPICDependencie(projectID: string, item:UseCase|Event):string{
        
        const depends:string[] = []
        if (item.depend){
            //depends.push(`${projectID}.${item.depend.ref?.id.toLocaleLowerCase()}`)
            depends.push(`${this.dict[item.depend.ref?.id||""]}`)
        }
        item.depends.map(depend => depends.push(`${this.dict[depend.ref?.id||""]}`))
        return expandToString`${depends.map(value => `${value}`).join(`,`)}        
        `
    }

    private createEPIC(projectID: string, usecase:UseCase):string {
        return expandToStringWithNL`
        epic ${usecase.id.toLocaleLowerCase()} {name:"${usecase.name_fragment}" description: "${usecase.description ?? ""}" depends: ${this.createEPICDependencie(projectID,usecase)} }        
        ${usecase.events.map((event,index) => this.createUserStory(event, usecase,index,projectID)).join(`\n`)}
        `
    }

    private createUserStory(event: Event, usecase:UseCase, index:number, projectID:string){
        // TODO pensar em como fazer assim
        //userstory  ${event.id.toLocaleLowerCase()} {name:"${event.name_fragment}" description: "${event.description ?? ""}" epic: ${projectID}.${usecase.id.toLocaleLowerCase()} depends: ${this.createEPICDependencie(projectID,event)}}        
        return expandToStringWithNL`
        userstory  ${usecase.id.toLocaleLowerCase()}_${index} {name:"${event.name_fragment}" description: "${event.description ?? ""}" epic: ${projectID}.${usecase.id.toLocaleLowerCase()} depends: ${this.createEPICDependencie(projectID,event)}}
        `
    }
}
import { Event, Model, UseCase, isModule, isUseCase } from "../../language/generated/ast.js"
import fs from "fs";
import path from 'path'
import { createPath } from "../generator-utils.js";
import { expandToString, expandToStringWithNL } from "langium/generate";

export class SparkApplication {
    model: Model
    target_folder:string
    SPARK_PATH: string
    dict: Dictionary = {};
    
    constructor (model: Model, target_folder:string){
        this.model = model
        this.target_folder = target_folder  
        
        fs.mkdirSync(this.target_folder, {recursive:true})        
        this.SPARK_PATH = createPath(this.target_folder,'spark') 
    }

    public create(){
        
        const project = this.model.project?.id.toLocaleLowerCase() ?? "file"
        fs.writeFileSync(path.join(this.SPARK_PATH , `${project}.spark`), this.createspark())
    
    }

    private createspark():string{
        const project = this.model.project
        const modules = this.model.components.filter(isModule)

        return expandToStringWithNL`
        Configuration {
            software_name: "${project?.name_fragment?? "nodefined"}"
            about: "${project?.description}"
            language: "${project?.architcture?? "nodefined"}"
        }
        ${modules.map(module => `module ${module.name}`)}
        `
    }
}
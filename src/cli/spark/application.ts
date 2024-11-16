import {  EnumX, LocalEntity, Model, isEnumX, isLocalEntity, isModule } from "../../language/generated/ast.js"
import fs from "fs";
import path from 'path'
import { createPath } from "../generator-utils.js";
import {  expandToStringWithNL } from "langium/generate";

export class SparkApplication {
    model: Model
    target_folder:string
    SPARK_PATH: string
   
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
            language: ${project?.architcture?? "nodefined"}
        }
        ${modules.map(module => `module ${module.name}
        {
        ${module.elements.filter(isLocalEntity).map(localEntity => this.createEntity(localEntity)).join(`\n`)}
        ${module.elements.filter(isEnumX).map(enumX => this.createEnum(enumX)).join(`\n`)}
        }`).join("\n")}
        `
    }

    private createEnum (enumx: EnumX):string {
        return expandToStringWithNL`
        enum ${enumx.name}{
            ${enumx.attributes.map(value => `${value.name}`).join(`\n`)}
        }
        `
    }

    private createEntity (entity:LocalEntity):string {
        return expandToStringWithNL`
    entity ${entity.name} {
      ${entity.attributes.map(value => `${value.name}: ${value.type}`)} 
      ${entity.enumentityatributes.map(value => `${value.name} uses ${value.type.ref?.name}`)} 
      ${entity.functions.map(value => `fun ${value.name} (${value.paramters.map(param=>param.element).join(',')}): ${value.response}`)} 
      ${entity.relations.map(value => `${value.name} ${value.$type} ${value.type.ref?.name}`)} 
       
    }
        `
    }
}
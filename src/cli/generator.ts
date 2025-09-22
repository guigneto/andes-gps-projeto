import { isModule, type Model } from '../language/generated/ast.js';
import { GenerateOptions } from './main.js';
import { ArtifactApplication } from './artifacts/application.js'
import { MadeApplication } from './made/application.js'
import { SparkApplication } from './spark/application.js';
import path from 'path';

import { ApplicationCreator, ProjectModuleType, ProjectOverviewType, ProjectType } from "andes-lib"
import { translateActor, translateModule, translateRequirements, translateUseCase } from './translate-utils.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined,opts: GenerateOptions): string {
    const final_destination  = extractDestination(filePath, destination);
    
    const artifactApplication = new ArtifactApplication(model,final_destination);
    const madeApplication = new MadeApplication(model,final_destination); 
    const sparkApplication = new SparkApplication(model,final_destination);

    const overview: ProjectOverviewType = {
        architecture: model.project?.architcture ? model.project.architcture : "python",
        description: model.project?.description ? model.project.description : "",
        name: model.project?.name_fragment ? model.project.name_fragment : "Projeto sem Nome",
        miniwolrd: model.project?.miniworld ? model.project?.miniworld : "Sem Minimundo",
        purpose: model.project?.purpose ? model.project?.purpose : "Sem Propósito",
        identifier: model.project?.id??"",
    }

    const singleModule: ProjectModuleType = {
        actors: model.Actor.map(c => translateActor(c)),
        uc: model.UseCase.map(uc => translateUseCase(uc)),
        description: model.project?.description ? model.project.description : "No Description",
        identifier: model.project?.id ? model.project.id : "",
        miniwolrd: model.project?.miniworld ? model.project?.miniworld : "Sem Minimundo",
        name: model.project?.name_fragment ? model.project.name_fragment : "Projeto sem Nome",
        purpose: model.project?.purpose ? model.project?.purpose : "Sem Propósito",
        requisites: translateRequirements(model.Requirements),
        // @ts-ignore
        packages: model.AbstractElement.filter(pkgs => isModule(pkgs)).map(pkg => translateModule(pkg)),
    }

    const project: ProjectType = {  
        modules: [singleModule],
        overview: overview,
    }

    const app = new ApplicationCreator(project, final_destination);
    
    if(opts.destination == undefined)
    {
        // Some error ocurred and it is simple just overwrite it
        opts.all = true;
    }

    if (opts.only_Documentation){
        console.log("Not Implemented Yet");
    }
    if (opts.only_spark){
        sparkApplication.create()
    }

    if (opts.only_testing){
        artifactApplication.create()
    }

    if (opts.only_made){
        madeApplication.create()
    }

    if (opts.all){
        app.create();
    }
    
    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')
  
    return destination ?? path.join(path.dirname(filePath))
}


import { type Model } from '../language/generated/ast.js';
import { DocumentationApplication } from './documentation/application.js';
import { GenerateOptions } from './main.js';
import path from 'path';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined,opts: GenerateOptions): string {
    const final_destination  = extractDestination(filePath, destination);
    

    
    const documentationApplication = new DocumentationApplication(model,final_destination);
    
    //const origamiApplication = new OrigamiApplication(model,data.destination);    
    
    //const artifactApplication = new ArtifactApplication(model,data.destination);
  
    documentationApplication.create()
    
    
    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')
  
    return destination ?? path.join(path.dirname(filePath))
  }
  
import {  type Model } from '../../language/generated/ast.js';
import * as path from 'node:path';
import { extractDestinationAndName } from '../cli-util.js';


export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    
    return generatedFilePath;
}


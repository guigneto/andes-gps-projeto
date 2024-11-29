import { UseCase, isUseCase, type Model } from '../../language/generated/ast.js';
import * as path from 'node:path';
import fs from "fs";
import { extractDestinationAndName } from '../cli-util.js';
import { OpenAI } from '../generative_ai/application.js';
import { createPath } from '../generator-utils.js';



export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const useCases = model.components.filter(isUseCase)
    const FEATURE_PATH = createPath(data.destination,'feature')

    useCases.map(async useCase => await genarateBDD(useCase, FEATURE_PATH))

    return generatedFilePath;
}

async function genarateBDD (useCase: UseCase, destination: string){

    const command = `
    Transforme o seguinte caso de uso em arquivos BDD com cenários outlines para casos de sucesso e erro.
    Para cada atributo gerar uma mensagem de erro personalizada quando ela não for informada.
    Caso exista uma regra de integridade, gera uma mensagem de erro personalizada quando ela não for obedecida:
    ${useCase.description}

    Exemplo de formato BDD:
    Feature: Nome da Feature

    Scenario Outline: Incluir modalidade com sucesso
        Given o servidor informa os dados da modalidade <sigla>, <nome>, <descrição>, <percentual>, <data_início>, <modalidades_bolsa>
        And o servidor seleciona a resolução <resolução>
        When o sistema valida e salva a modalidade
        Then o sistema deve salvar a modalidade com status "Em edição"
        
    Examples:
        | sigla | nome | descrição | percentual | data_início | modalidades_bolsa | resolução |
        | ABC   | Nome | Desc      | 10         | 2024-01-01  | Bolsa1            | Res1      |

    Scenario Outline: Incluir modalidade com erro
        Given o servidor informa os dados da modalidade <sigla>, <nome>, <descrição>, <percentual>, <data_início>, <modalidades_bolsa>
        And o servidor seleciona a resolução <resolução>
        When o sistema valida e não pode salvar a modalidade
        Then o sistema deve retornar uma mensagem de erro "<mensagem_erro>"
        
    Examples:
        | sigla | nome | descrição | percentual | data_início | modalidades_bolsa | resolução | mensagem_erro               |
        | ABC   | Nome | Desc      | -10        | 2024-01-01  | Bolsa1            | Res1      | Percentual não pode ser negativo |
    `
    const openAI = new OpenAI()
    const response = await openAI.send(command, destination)
    

    fs.writeFileSync(path.join(destination, `/${useCase.name_fragment?.replaceAll(/\s/g,"_").toLocaleLowerCase()}.feature`), response)
        
}
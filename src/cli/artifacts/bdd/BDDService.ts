import path from "path";
import { Event, Model, isEvent, isUseCase } from "../../../language/generated/ast.js"
import { OpenAI } from "../../generative_ai/application.js";
import { createPath } from "../../generator-utils.js"
import fs from "fs";
export class BDDService {

    model: Model
    target_folder:string
    ARTIFACT_PATH:string
    FEATURE_PATH:string
    openAI:OpenAI
    constructor (model: Model, target_folder:string){        
        this.model = model
        this.target_folder = target_folder

        this.openAI = new OpenAI()
        
        fs.mkdirSync(this.target_folder, {recursive:true})        
        this.ARTIFACT_PATH = createPath(this.target_folder,'artifact')        
        this.FEATURE_PATH = createPath(this.ARTIFACT_PATH,'feature')
    }

    public create(){
        const events = this.model.components.filter(isUseCase).flatMap(usecase => usecase.events.filter(isEvent))

        events.map(async event => await this.genarateBDD(event))
    }

    private async genarateBDD (event: Event){

        const command = `
        Transforme o seguinte caso de uso em arquivos BDD com cenários outlines para casos de sucesso e erro.
        Para cada atributo gerar uma mensagem de erro personalizada quando ela não for informada.
        Caso exista uma regra de integridade, gera uma mensagem de erro personalizada quando ela não for obedecida:
        ${event.action}
    
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
       
        const response = await  this.openAI.send(command)
        
        
        const usecaseFolder= createPath(this.FEATURE_PATH,event.$container.id.toLocaleLowerCase())   
        fs.writeFileSync(path.join(this.FEATURE_PATH, `/${usecaseFolder}/${event.name_fragment?.replaceAll(/\s/g,"_").toLocaleLowerCase()}.feature`), response)

    }   
}
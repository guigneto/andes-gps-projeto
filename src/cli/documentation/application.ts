import { Model } from "../../language/generated/ast.js"
import {DocksaurusService} from "../documentation/docsaurus/DocksaurusService.js"

export class DocumentationApplication {

    docksaurusService:DocksaurusService
    
    constructor (model: Model, target_folder:string){
        
        this.docksaurusService = new DocksaurusService(model, target_folder)
    }

    public create(){
        this.docksaurusService.create()
    }

}
import { Model } from "../../language/generated/ast.js"
import { BDDService } from "./bdd/BDDService.js"

export class ArtifactApplication{
    model: Model
    target_folder:string
    BDDService: BDDService
    
    constructor (model: Model, target_folder:string){
        this.model = model
        this.target_folder = target_folder
        this.BDDService = new BDDService(model, this.target_folder)
    }

    public create(){
        this.BDDService.create()
    }

}
import { Model } from "../../language/generated/ast.js";
import { DocksaurusService } from "../documentation/docsaurus/DocksaurusService.js";

export class DocumentationApplication {
    private docksaurusService: DocksaurusService;

    constructor(model: Model, targetFolder: string) {
        this.docksaurusService = new DocksaurusService(model, targetFolder);
    }

    public create(): void {
        this.docksaurusService.create();
    }
}

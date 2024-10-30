import * as vscode from 'vscode';

export class VSCodeUtil {

    static  showLoadingMessage(message:string) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: message,
            cancellable: false
        }, async (progress, token) => {
            // Simule um atraso de 2 segundos (você pode substituir isso com sua lógica de carregamento real)
            await new Promise(resolve => setTimeout(resolve, 2000));
            return Promise.resolve();
        });
    }

    static showConfirmingMessage(message:string){
        VSCodeUtil.showLoadingMessage(message)
    }
}
import {getOrderStatus} from "./externalDatabaseService.ts";

export const functionManager = {
    functions: {
        get_invoice_id: (functionArgs: { invoiceId: number; }) => {
            const {invoiceId} = functionArgs;
            return getOrderStatus(invoiceId)
        },

        obtenir_numero_de_facture: (functionArgs: { invoiceId: number; }) => {
            const {invoiceId} = functionArgs;
            return getOrderStatus(invoiceId)
        },
        determine_language: (functionArgs: { language: string; }): string => {
            const {language} = functionArgs;
            return language
        },
    },

    executeFunction: (name: string, functionArgs: any) => {
        // @ts-ignore
        if (functionManager.functions[name]) {
            // @ts-ignore
            return functionManager.functions[name](JSON.parse(functionArgs));
        } else {
            return "Function not found";
        }
    }
}
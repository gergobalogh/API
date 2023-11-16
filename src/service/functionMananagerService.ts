
export const functionManager = {
    functions: {
        get_invoice_id: (functionArgs: { invoiceId: number; }) => {
            const {invoiceId} = functionArgs;
        },

        obtenir_numero_de_facture: (functionArgs: { invoiceId: number; }) => {
            const {invoiceId} = functionArgs;
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
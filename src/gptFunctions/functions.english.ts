export default {
    get_invoice_id: {
        "name": "get_invoice_id",
        "description": "Get the invoice id from text",
        "parameters": {
            "type": 'object',
            "properties": {
                "invoiceId": {
                    "type": "string",
                    "description": "The invoice id",

                },
            },
            "required": ["invoiceId"],
        },
    }
}

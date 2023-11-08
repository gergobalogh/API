export default {
    obtenir_numero_de_facture: {
        "nom": "obtenir_numero_de_facture",
        "description": "Get the invoice id from text",
        "parametres": {
            "type": 'objet',
            "proprietes": {
                "numero_de_facture": {
                    "type": "string",
                    "description": "Numéro de facture",

                },
            },
            "requis": ["numero_de_facture"],
        },
    }
}
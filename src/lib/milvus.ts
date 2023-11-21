const milvusApiKey = 'REMOVED_MILVUS_KEY'
export const insertVector = async (embeddings: any) => {
    const url = 'https://in03-7c37ff253e40ecc.api.gcp-us-west1.zillizcloud.com/v1/vector/insert';
    const options = {
        method: 'POST',
        headers: {Authorization: 'Bearer ' + Deno.env.get('MILVUS_API_KEY'), Accept: 'application/json'},
        body: JSON.stringify({
            "collectionName": "NiuzCollection",
            data: [{
                "vector": embeddings,
            }]
        }),
    };

    try {
        const response = await fetch(url, options);
        return await response.json()
    } catch (error) {
        console.error(error.message);
    }
}


export const searchVector = async (embeddings: any) => {
    const url = 'https://in03-7c37ff253e40ecc.api.gcp-us-west1.zillizcloud.com/v1/vector/search';
    const options = {
        method: 'POST',
        headers: {Authorization: 'Bearer ' + Deno.env.get('MILVUS_API_KEY'), Accept: 'application/json', 'Content-type': 'application/json'},
        body: JSON.stringify({
            'collectionName': 'NiuzCollection',
            vector: embeddings
        })
    };
    try {
    const response = await fetch(url, options);
    const data = await response.json()
        if (data.code === 200 && data.data.length === 0) {
            return false
        } else {
            return data
        }
    } catch (error) {
        console.error(error);
    }
}

export const deleteVectors = async () => {
    const url = 'https://in03-7c37ff253e40ecc.api.gcp-us-west1.zillizcloud.com/v1/vector/delete';
    const options = {
        method: 'POST',
        headers: {Authorization: 'Bearer ' + Deno.env.get('MILVUS_API_KEY'), Accept: 'application/json'},
        body: '{"collectionName":"NiuzCollection","id":[445766006129355285]}'
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
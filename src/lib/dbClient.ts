import {createClient} from "supabase"
import {Logger} from './logging/logger.ts'


export const insertNews = async (title: string, url: string, proximity: string) => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('niuz')
        .insert({
            title: title,
            url: url,
            proximity: proximity
        })
        .select()
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
}

export const selectByTitle = async (title: string) => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('niuz')
        .select('title')
        .eq('title', title)

    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    return data;
}
export const updateByTitle = async (title, updateColumn, updateValue) => {
    const client = await createAuthenticatedClient()
    const updatePayload = {
        [updateColumn]: updateValue,
    };
    const {data, error} = await client
        .from('niuz')
        .update(updatePayload)
        .eq('title', title)
        .select()
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
}
export const createAuthenticatedClient = async () => {
    const kv = await Deno.openKv();
    const jwt = await kv.get(['SUPABASE_JWT_TOKEN'])
    console.log(jwt)
    if (jwt.value === null) {
        console.log('JWT IS NULL, authenticating')
        const client = await createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_API_KEY'))
        const {data, error} = await client.auth.signInWithPassword({
            email: Deno.env.get('SUPABASE_EMAIL'),
            password: Deno.env.get('SUPABASE_PASS')
        })
        if (error && error.message) {
            Logger.error(error.message)
            throw new Error(error.message)
        }
        await kv.set(['SUPABASE_JWT_TOKEN'], {
            token: data.session.access_token,
            expires_at: data.session.expires_at,
            refresh_token: data.session.refresh_token
        })
        return createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_API_KEY'), {
            global: {
                headers: {
                    'Authorization': 'Bearer ' + data.session.access_token
                }
            }
        })
    }
    if(jwt.value.expires_at < Math.floor(Date.now() / 1000)) {
        console.log('JWT EXPIRED, TRYING TO REFRESH SESSION')
        const { data, error } = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_API_KEY')).auth.setSession({
            access_token: jwt.value.access_token,
            refresh_token: jwt.value.refresh_token,
        })
        if (error && error.message) {
            Logger.error(error.message)
            throw new Error(error.message)
        }
        await kv.delete(['SUPABASE_JWT_TOKEN'])
        await kv.set(['SUPABASE_JWT_TOKEN'], {
            token: data.session.access_token,
            expires_at: data.session.expires_at,
            refresh_token: data.session.refresh_token
        })
        return createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_API_KEY'), {
            global: {
                headers: {
                    'Authorization': 'Bearer ' + data.session.access_token
                }
            }
        })
    }
    if(jwt.value.token) {
        const client = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_API_KEY'), {
            global: {
                headers: {
                    'Authorization': 'Bearer ' + jwt.value.token
                }
            }
        })
        const {data, error} = await client
            .from('users')
            .select()
        if (error && error.message) {
            Logger.error(error.message)
            throw new Error(error.message)
        }
        if (data && data[0] && data[0].id === 1 && data[0].name === "Jack") {
            return client
        }
    }
}


export const selectOneForCompletion = async () => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('niuz')
        .select('*')
        .or('scale.is.null,magnitude.is.null,potential.is.null,novelty.is.null,significance.is.null,actionability.is.null,longTerm.is.null,score.is.null,category.is.null')
        .limit(1)
        .single()
    if (error && error.code !== 'PGRST116') {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    return data
}
export const selectOneForCalculatingScore = async () => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('niuz')
        .select('*')
        .is('score', null)
        .not('scale', 'is', null)
        .not('magnitude', 'is', null)
        .not('potential', 'is', null)
        .not('novelty', 'is', null)
        .not('significance', 'is', null)
        .not('actionability', 'is', null)
        .not('longTerm', 'is', null)
        .not('category', 'is', null)
        .limit(1)
        .single();
    if (error && error.code !== 'PGRST116') {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    return data
}

export const listNews = async () => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('niuz')
        .select('*')
        .not('score', 'is', null)
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    return data;
}
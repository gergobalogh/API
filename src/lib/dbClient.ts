import {createClient} from "supabase"
import {Logger} from './logging/logger.ts'
import {getPagination} from "./helpers.ts";

export const createAuthenticatedClient = async () => {
    const kv = await Deno.openKv();
    const jwt = await kv.get(['SUPABASE_JWT_TOKEN'])
    if (jwt.value === null || jwt.value.expires_at < Math.floor(Date.now() / 1000)) {
        await kv.delete(['SUPABASE_JWT_TOKEN'])
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
    if (jwt.value.token) {
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

export const listNews = async (page: number, size: number = 50) => {
    const {from, to} = getPagination(page,  size)
    const client = await createAuthenticatedClient()
    let query = client
        .from('final_news')
        .select("id,original_title,rewritten_title,score,category,proximity", { count: "exact" })
        .not('score', 'is', null)
        .not('category', 'is', null)
        .order('proximity', {ascending: false})
        .range(from, to)
    const {data, count, error} = await query
    if (error && error.message) {
        if(error.code === 'PGRST103' && error.message === 'Requested range not satisfiable') {
            return {data: null, maxPages: null, error: error.message}
        }
        console.log(error)
        Logger.error(error.message)
    //    throw new Error(error.message)
    }
    const maxPages = Math.ceil(count / size);

    return {data, maxPages }
}
export const getDetailsById = async (id: number) => {
    const client = await createAuthenticatedClient()
    let query = client
        .from('news_attributes')
        .select('scale,magnitude,potential,novelty,impact,actionability,consequences,summary,url')
        .eq('final_news_id', id)
        .eq('processed', true)
        .limit(1)
    const {data, error} = await query
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    if(data && data.length > 0) {
        return data[0];
    }
    return []
}

export const listStatistics = async () => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('processing_statistics')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    return data;
}

export const getTotalHigherThanSix = async () => {
    const today = new Date();
    today.setHours(2, 0, 0, 0);
    const tomorrow = new Date(today.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);
    const todayString = today.toISOString().replace('T', ' ')
    const tomorrowString = tomorrow.toISOString().replace('T', ' ')
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('final_news')
        .select('*')
        .gte('score', 6)
        .gte('created_at', todayString)
        .lte('created_at', tomorrowString)
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
   return data.length;
}
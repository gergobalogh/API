import {createClient} from "supabase"
import {Logger} from './logging/logger.ts'

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
export const listNews = async (date: any) => {
    const client = await createAuthenticatedClient()
    let query = client
        .from('niuz')
        .select('*')
        .not('score', 'is', null)
        .not('content', 'is', null)
        .order('created_at', {ascending: true})
    if(date) {
        query = query.gte('created_at', date)
    }
    const {data, error} = await query
    if (error && error.message) {
        Logger.error(error.message)
        throw new Error(error.message)
    }
    return data;
}

export const listStatistics = async () => {
    const client = await createAuthenticatedClient()
    const {data, error} = await client
        .from('statistics')
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
        .from('niuz')
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
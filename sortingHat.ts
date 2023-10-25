import { Hono } from 'https://deno.land/x/hono@v3.4.1/mod.ts';

const sortingHat = new Hono();
sortingHat.get('/', (c) => c.text("This is my endpoint"))
sortingHat.get('/hello', (c) => {
    return c.json({ message: 'Hello' })
})
sortingHat.notFound((c) => c.json({ message: 'Notaaaa Found', ok: false }, 404))

export {sortingHat}
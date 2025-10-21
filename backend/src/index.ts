import dotenv from 'dotenv'
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { withSupabase } from './middleware/auth.js';

import usersApp from './routes/users.js'
import propertiesApp from './routes/properties.js'
import authApp from './routes/auth.js';


dotenv.config();


const app = new Hono ({
    strict: false
});

//Nedan är ba för "server hälsa" utskriften
const serverStartTime = Date.now();

app.use('*', withSupabase);


app.get('/', (c) => {
    return c.text('Individuella BnB-projket frontend')
})

app.route('/users', usersApp )
app.route('/properties', propertiesApp)
app.route('/auth', authApp)






app.get('/health', (c) => {
  const now = Date.now();
  const uptime = Math.floor((now - serverStartTime) / 1000)

  return c.json({
    status: 'ok',
    message: "Server is running",
    uptime: `${uptime} seconds`,
    startedAt: new Date(serverStartTime).toISOString(),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })

})


serve({
  fetch: app.fetch,
  port: 3003
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
import dotenv from 'dotenv'
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { requireAuth, withSupabase } from './middleware/auth.js';
import { cors } from 'hono/cors';

import usersApp from './routes/users.js'
import propertiesApp from './routes/properties.js'
import authApp from './routes/auth.js';
import bookingsApp from './routes/bookings.js';


dotenv.config();


const app = new Hono ({
    strict: false
});

const serverStartTime = Date.now();

app.use('*', cors({
  origin: "http://localhost:3000",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}), withSupabase);


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

app.get('/', (c) => {
    return c.text('Individuella BnB-projket frontend')
})
app.route('/auth', authApp )

app.use('/api/v1/*', requireAuth)

app.route('/api/v1/users', usersApp )
app.route('/api/v1/properties', propertiesApp)
app.route('/api/v1/bookings', bookingsApp)


serve({
  fetch: app.fetch,
  port: 3003
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
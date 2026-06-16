import os
import asyncio
from aiohttp import web

# Store active connections: { driver_id: { "senders": set(), "receivers": set() } }
channels = {}

async def ws_handler(request):
    driver_id = request.match_info.get('driver_id')
    if not driver_id:
        return web.Response(text="Driver ID required", status=400)

    ws = web.WebSocketResponse()
    await ws.prepare(request)

    # Senders (bridge) pass ?role=sender, receivers (broadcaster/spotter) don't
    role = request.query.get('role', 'receiver')

    if driver_id not in channels:
        channels[driver_id] = {"senders": set(), "receivers": set()}

    if role == 'sender':
        channels[driver_id]["senders"].add(ws)
        print(f"[+] Sender connected to channel: {driver_id}")
    else:
        channels[driver_id]["receivers"].add(ws)
        print(f"[+] Receiver connected to channel: {driver_id}")

    try:
        async for msg in ws:
            if msg.type == web.WSMsgType.TEXT:
                if role == 'sender':
                    # Relay message from sender to all receivers
                    receivers = list(channels[driver_id]["receivers"])
                    for rx in receivers:
                        if not rx.closed:
                            try:
                                await rx.send_str(msg.data)
                            except Exception as e:
                                print(f"Error relaying message: {e}")
                else:
                    # Ignore data sent by receivers
                    pass
            elif msg.type == web.WSMsgType.ERROR:
                print(f"WS error on channel {driver_id}: {ws.exception()}")
    finally:
        # Cleanup on disconnect
        if driver_id in channels:
            if role == 'sender':
                channels[driver_id]["senders"].discard(ws)
                print(f"[-] Sender disconnected from channel: {driver_id}")
            else:
                channels[driver_id]["receivers"].discard(ws)
                print(f"[-] Receiver disconnected from channel: {driver_id}")
            
            if not channels[driver_id]["senders"] and not channels[driver_id]["receivers"]:
                del channels[driver_id]

    return ws

async def health_check(request):
    # Enable CORS for health check
    return web.Response(
        text="OK", 
        status=200, 
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        }
    )

app = web.Application()
app.router.add_get('/ws/{driver_id}', ws_handler)
app.router.add_get('/health', health_check)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    web.run_app(app, port=port)

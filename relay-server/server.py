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
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    )

async def options_handler(request):
    return web.Response(
        status=204,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    )

async def push_broadcast_handler(request):
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }
    try:
        import sys
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.insert(0, parent_dir)
        import send_brl_notification
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, send_brl_notification.flush_pending_web_pushes)
        return web.json_response({"status": "ok"}, headers=cors_headers)
    except Exception as e:
        return web.json_response({"status": "error", "detail": str(e)}, status=500, headers=cors_headers)

app = web.Application()
app.router.add_get('/', health_check)
app.router.add_get('/ws/{driver_id}', ws_handler)
app.router.add_get('/health', health_check)
app.router.add_options('/push-broadcast', options_handler)
app.router.add_post('/push-broadcast', push_broadcast_handler)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    web.run_app(app, port=port)

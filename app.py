import os, time, json
from flask import Flask, jsonify, abort, make_response
try:
    from flask_cors import CORS
    _cors_available = True
except ImportError:
    _cors_available = False
from flask import request
import requests

PEAK_TOKEN_MINT = os.getenv('PEAK_TOKEN_MINT', '7bAFtXqcaBagSDTE3AXvnVXFxEjiXCnwNBLqRWjNpump')
RPC_ENDPOINTS = [
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana',
    'https://solana-api.projectserum.com'
]

CACHE_TTL = 30  # seconds
_cache = {}

app = Flask(__name__)
if _cors_available:
    # Allow all origins for /api/* endpoints (dev only)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.after_request
def add_basic_headers(resp):
    # Fallback CORS headers if flask-cors not installed
    if not _cors_available and request.path.startswith('/api/'):
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp


def _rpc_call(rpc_url, body, timeout=9):
    try:
        r = requests.post(rpc_url, json=body, timeout=timeout)
        if r.status_code != 200:
            return None
        return r.json()
    except Exception:
        return None


def _extract_balance(account_obj):
    try:
        info = account_obj['account']['data']['parsed']['info']
        t = info['tokenAmount']
        return int(t['amount']), int(t['decimals'])
    except Exception:
        return None


def _query_balance(address: str):
    # 1. Mint filter (fast)
    for rpc in RPC_ENDPOINTS:
        data = _rpc_call(rpc, {
            'jsonrpc': '2.0', 'id': 1, 'method': 'getTokenAccountsByOwner',
            'params': [address, {'mint': PEAK_TOKEN_MINT}, {'encoding': 'jsonParsed'}]
        })
        if data and data.get('result', {}).get('value'):
            acc = data['result']['value'][0]
            extracted = _extract_balance(acc)
            if extracted:
                raw, dec = extracted
                return raw / (10 ** dec)

    # 2. Broad scan
    for rpc in RPC_ENDPOINTS:
        data = _rpc_call(rpc, {
            'jsonrpc': '2.0', 'id': 2, 'method': 'getTokenAccountsByOwner',
            'params': [address, {'programId': 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'}, {'encoding': 'jsonParsed'}]
        })
        if data and data.get('result', {}).get('value'):
            for acc in data['result']['value']:
                try:
                    mint = acc['account']['data']['parsed']['info']['mint']
                    if mint == PEAK_TOKEN_MINT:
                        extracted = _extract_balance(acc)
                        if extracted:
                            raw, dec = extracted
                            return raw / (10 ** dec)
                except Exception:
                    continue
    return 0.0


@app.get('/api/peak-balance/<address>')
def get_peak_balance(address):
    app.logger.info(f"/api/peak-balance request: {address}")
    if not address or len(address) < 32:
        abort(400, 'Invalid address')

    now = time.time()
    cached = _cache.get(address)
    if cached and now - cached['ts'] < CACHE_TTL:
        return jsonify({'address': address, 'balance': cached['balance'], 'cached': True})

    balance = _query_balance(address)
    _cache[address] = {'balance': balance, 'ts': now}
    return jsonify({'address': address, 'balance': balance, 'cached': False})


@app.get('/api/health')
def health():
    return jsonify({'status': 'ok', 'mint': PEAK_TOKEN_MINT, 'cache_size': len(_cache)})

@app.get('/')
def root():
    return jsonify({
        'service': 'PEAK Balance API',
        'endpoints': ['/api/health', '/api/peak-balance/<walletAddress>'],
        'mint': PEAK_TOKEN_MINT,
        'note': 'This root returns 404 before patch. Use /api/peak-balance/{address}.'
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

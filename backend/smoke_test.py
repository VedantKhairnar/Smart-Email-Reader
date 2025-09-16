#!/usr/bin/env python3
"""
Simple smoke test for Smart Email Reader backend.

This script performs two checks against the backend:
1. GET / to verify server is up
2. POST /api/v1/email/summarize with a small payload to verify summarization endpoint

Usage:
    python3 backend/smoke_test.py --url http://localhost:8000

This script uses only the Python standard library so it requires no extra packages.
"""
import argparse
#!/usr/bin/env python3
"""
Simple smoke test for Smart Email Reader backend.

This script performs two checks against the backend:
1. GET / to verify server is up
2. POST /api/v1/email/summarize with a small payload to verify summarization endpoint

Usage:
    python3 backend/smoke_test.py --url http://localhost:8000

This script uses only the Python standard library so it requires no extra packages.
"""
import argparse
import json
import sys
from urllib import request, error


def http_get(url):
    req = request.Request(url, method='GET')
    try:
        with request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8'), resp.getcode()
    except error.HTTPError as e:
        return e.read().decode('utf-8'), e.code
    except Exception as e:
        return str(e), None


def http_post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with request.urlopen(req, timeout=20) as resp:
            return resp.read().decode('utf-8'), resp.getcode()
    except error.HTTPError as e:
        return e.read().decode('utf-8'), e.code
    except Exception as e:
        return str(e), None


def main():
    parser = argparse.ArgumentParser(description='Smoke test backend')
    parser.add_argument('--url', default='http://localhost:8000', help='Base backend URL')
    args = parser.parse_args()

    base = args.url.rstrip('/')
    print(f'Running smoke tests against: {base}')

    # 1) GET /
    print('\n1) Health check: GET /')
    body, status = http_get(base + '/')
    print(f'Status: {status}')
    print(f'Body (truncated): {body[:200]}')

    # 2) POST /api/v1/email/summarize
    print('\n2) Summarize endpoint: POST /api/v1/email/summarize')
    payload = {
        'email_content': 'Hello team, this is a test email used to verify the summarization endpoint. It should be short.',
        'sender': 'tester@example.com',
        'subject': 'Smoke test'
    }
    body, status = http_post(base + '/api/v1/email/summarize', payload)
    print(f'Status: {status}')
    print('Response (truncated):')
    print(body[:800])

    if status and 200 <= status < 300:
        print('\nSmoke test completed: OK')
        sys.exit(0)
    else:
        print('\nSmoke test failed')
        sys.exit(2)


if __name__ == '__main__':
    main()

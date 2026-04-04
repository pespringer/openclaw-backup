#!/usr/bin/env python3
import json
import os
import urllib.request
from urllib.parse import quote

BASE = os.environ.get('MISSION_CONTROL_API', 'http://127.0.0.1:4311')


def fetch_json(url, method='GET', payload=None):
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode()
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    data = fetch_json(f'{BASE}/api/launch-intents')
    intents = [i for i in data.get('launchIntents', []) if i.get('status') == 'pending']
    if not intents:
        print('No pending launch intents.')
        return 0

    print('Pending launch intents:')
    for intent in intents:
        print(f"- {intent['id']} :: {intent['storyId']} :: {intent['agent']} :: {intent['executionMode']}")

    print('\nThis helper is a trusted operator aid, not a hidden autonomous executor.')
    print('Use the pending intents as the authoritative queue, then resolve each one with real runtime-linked values after you perform the delegated launch from the main OpenClaw session.')
    print('\nExample resolve call:')
    if intents:
        intent = intents[0]
        payload = {
            'status': 'running',
            'linkedSession': 'agent:main:subagent:<real-session-key>',
            'linkedRun': '<real-run-id>',
            'summary': f"{intent['agent']} delegated execution started",
        }
        example_url = f"{BASE}/api/launch-intents/{quote(intent['id'], safe='')}/resolve"
        print('URL:', example_url)
        print('Payload:')
        print(json.dumps(payload, indent=2))

    return 0


if __name__ == '__main__':
    raise SystemExit(main())

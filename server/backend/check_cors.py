import urllib.request
req = urllib.request.Request('http://127.0.0.1:8000/api/employees/')
req.add_header('Origin','http://localhost:5173')
with urllib.request.urlopen(req) as r:
    print('Status:', r.status)
    for k,v in r.getheaders():
        if k.lower().startswith('access-control') or k.lower()=='vary' or k.lower()=='content-type':
            print(f'{k}: {v}')

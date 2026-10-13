"""Download only the pinned CC0 graphical data used by our original converter."""
import hashlib,json,sys,urllib.request
from pathlib import Path

manifest=json.loads((Path(__file__).parent/'character-sources.json').read_text())
destination=Path(sys.argv[1]);destination.mkdir(parents=True,exist_ok=True)
for entry in manifest['files']:
    path=destination/entry['filename']
    data=path.read_bytes() if path.exists() else urllib.request.urlopen(entry['url'],timeout=45).read()
    if hashlib.sha256(data).hexdigest()!=entry['sha256']:
        raise ValueError('Source hash mismatch: '+entry['filename'])
    path.write_bytes(data)
    print(entry['filename'],len(data))
(destination/'source-commit.txt').write_text(manifest['commit']+'\n')

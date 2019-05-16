curl example:

curl localhost:4000/graphql \
 -F operations='{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) { filename mimetype encoding } }", "variables": { "file": null } }' \
 -F map='{ "0": ["variables.file"] }' \
 -F 0=@/home/hkoya/Documents/lightweight-systems.pdf

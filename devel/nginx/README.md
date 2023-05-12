1. create cert for PermaplanT following this guide: https://gist.github.com/dahlsailrunner/679e6dec5fd769f30bce90447ae80081

```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout my-site.key -out my-site.crt -config my-site.conf -passin pass:YourStrongPassword
```

2. create a pfx file

```
sudo openssl pkcs12 -export -out permaplant.pfx -inkey permaplant.key -in permaplant.crt
```

3. import pfx file in browser

# Setting up HTTPS with Nginx using a Self-Signed Certificate

This guide walks you through the process of setting up HTTPS on your Nginx server using a self-signed SSL certificate.

## 1. Generate SSL Certificate

First, create the necessary directory and generate the self-signed SSL certificate:

```bash
# Create the directory for SSL certificates
sudo mkdir -p /etc/nginx/ssl

# Generate a private key
sudo openssl genrsa -out /etc/nginx/ssl/nginx.key 2048

# Create a Certificate Signing Request (CSR)
sudo openssl req -new -key /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.csr

# Generate the self-signed certificate
sudo openssl x509 -req -days 365 -in /etc/nginx/ssl/nginx.csr -signkey /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt

# Set appropriate permissions
sudo chmod 400 /etc/nginx/ssl/nginx.key
sudo chmod 444 /etc/nginx/ssl/nginx.crt
```

## 2. Configure Nginx

Next, create or edit your Nginx configuration file:

```bash
sudo rm /etc/nginx/nginx.conf
sudo vim /etc/nginx/nginx.conf
```

Paste the following configuration into the file:

```nginx
events {
    # Event directives...
}

http {
    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name ec2-43-205-139-135.ap-south-1.compute.amazonaws.com;

        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 3. Test and Reload Nginx

Finally, test the Nginx configuration and reload the service:

```bash
sudo nginx -t
sudo nginx -s reload
```

Your Nginx server should now be configured to use HTTPS with a self-signed certificate.

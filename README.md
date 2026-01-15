# scheduler-calendly
Using Calendly Account

# Google Cloude Console
https://console.cloud.google.com/enable-mfa?redirectTo=%2Fwelcome%3Fproject%3Dgenesismbehealth&project=genesismbehealth

# To run application
npm dev run

# Access Site
- Local:         http://localhost:3000
- Network:       http://192.168.1.7:3000

# Common Build Commands:
npm run dev - Start development server
npm run build - Create production build
npm start - Run production build
npm run lint - Check for code issues

# Publishing with Vercel (GitHub only hosts static pages)
https://scheduler-calendly.vercel.app/

How to Generate the Secret
Information from outside the sources: To create a secure, high-entropy secret, you should use a terminal command rather than making one up manually. You can use the following methods:
1. Using Terminal (Recommended): Open your terminal (Command Prompt, Terminal, or PowerShell) and run:
    ◦ openssl rand -base64 32
    ◦ This will output a 32-character random string that you can copy and use.
2. Using JavaScript/Node.js: If you don't have OpenSSL, you can run this in your terminal:
    ◦ node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Credential: random string generation
openssl rand -base64 32

# Database
npx prisma studio

# Domains
1. https://Name.com - https://www.name.com/domain-search
2. GoDaddy - https://www.godaddy.com/domainsearch
3. Bluehost - https://www.bluehost.com/domain-search
4. Google Domains - https://domains.google/
5. Cloud Flare - www.domains.cloudflare.com

# Patent, trademark search
https://www-search.uspto.gov/WWW-search.html
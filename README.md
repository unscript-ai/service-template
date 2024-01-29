
# Typescript Template

This is a template typescript project for rapid development

## Tech Stack

**Typescript:** Base code language [https://www.typescriptlang.org/]

**SWC:** Rust based tooling for compilation of TS to JS [https://swc.rs/]

**PM2:** PM2 for node deployment and restarts [https://pm2.keymetrics.io/docs/usage/quick-start/]

**Docker:** Containerisation tooling [https://www.docker.com/]

**Zod:** Validating data [https://zod.dev/]




## Run Locally

Clone the project

```bash
  git clone https://github.com/Blitzscale-19/typescript_template
```

Go to the project directory

```bash
  cd typescript_template
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Deployment

To deploy this project run on production for first time

```bash
  npm run deploy:prod
```
This will automatically create a new build and start pm2 for it

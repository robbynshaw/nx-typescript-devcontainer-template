# Nx AWS CDK NextJS Template

## Getting started

Start the dev server:

```sh
nx dev
```

Build the static site:

```sh
nx build site
```

## AWS Deployment

### First Time Setup

```sh
aws configure
```

- In `main.ts`, update `STACK_NAME` to something unique for your project.

### Every Other Time

```sh
nx deploy stack

# Then, to destroy it
nx destroy stack
```

## Development

More information about `Nx` in [/docs/nx.md](./docs/nx.md)

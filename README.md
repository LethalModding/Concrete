# Concrete by LethalModding.com

[![CodeQL Analysis Workflow Status](https://github.com/LethalModding/Concrete/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/LethalModding/Concrete/actions)
[![License](https://badgen.net/badge/License/CC-BY-NC-SA-2.0/blue)](https://github.com/LethalModding/Concrete/blob/main/LICENSE.txt)

## Getting Started

### First-Time Setup

If this is your first time using NodeJS, you should install Yarn to work with this project:

(You only need to do this once per system you develop on.)

```bash
npm install -g yarn
```

Then, we can clone the repository into a path of your choosing:

```bash
git clone https://github.com/LethalModding/Concrete.git Concrete
cd Concrete
```

Finally, install the dependencies:

```bash
# Install Go dependencies
go get -u ./...
cd frontend

# Install NodeJS dependencies
yarn install
cd ..
```

### Running in Dev Mode

You can run the application locally in dev mode with the following command:

```bash
LOGXI=* wails dev
```

## Learn More

### TypeScript

- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript features.
- [TypeScript Tutorial](https://www.typescripttutorial.net/) - assumes you know JavaScript already.

### Next.JS

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js/)

### Material UI

- [Material UI Components](https://mui.com/material-ui/) - index of Material UI components.
- [Getting Started with Material UI](https://mui.com/material-ui/getting-started/learn/) - learning resources for Material UI.
- [Material UI GitHub Repository](https://github.com/mui/material-ui)

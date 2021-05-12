# reactjs-setup-sample
based on https://www.youtube.com/watch?v=1nVUfZg2dSA

## steps
1. usar o create next-app ao invés do create-react-app
´´´
yarn create next-app app-name
´´´
https://www.youtube.com/watch?v=6TEo2AxW-oQ

2. remover arquivos que não serão utilizados
- pages/api/*
- public/*
- styles/*

3. adicionar typescript
```
yarn add typescript @types/react @types/node -D
```

4. renomear
- pages/_app.js -> _app.tsx
- pages/index.js -> index.tsx

5. limpar arquivo index.tsx e _app.tsx

6. instalar eslint como dep de desenvolvimento e inicializá-lo
```
yarn add eslint -D
yarn eslint --init
yarn add prettier eslint-plugin-prettier eslint-config-prettier -D
```
    - alterar no arquivo .eslintrc.json:
        - dentro de "env" -> "jest": true
        -  dentro de "extends" -> "plugin:@typescript-eslint/recommended", "prettier/@typescript-eslint", "prettier/standard", "prettier/react"
        - dentro de "plugins" -> "prettier"
        - dentro de "rules" -> "prettier/prettier": "error", "react/prop-types": "off"

7. adicionar na raiz um arquivo ".eslintignore"
```
node_modules
.next
/*.js
```

8. instalar os plugins no vscode
- Editorconfig for VS Code

9. Integrar Styled-components com o Next
```
yarn add styled-components
yarn add @types/styled-components -D
```
criar um arquivo "bable.config.js" na raiz
    - https://github.com/vercel/next.js/blob/canary/examples/with-styled-components/.babelrc
criar um arquivo "pages/_documents.js"
    - https://github.com/vercel/next.js/blob/canary/examples/with-styled-components/pages/_document.js

### pesquisar
- diferença entre NPM e YARN
- o que nextjs

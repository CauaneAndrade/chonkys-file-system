# 'BizDrive' frontend

[![app demo](app-demo.PNG)](https://youtu.be/m7VoffWYI9k "App Demo")

``Projeto está usando nextjs e sintaxe typescript``

### Para rodar o projeto localmente
1. estar com o backend rodando na porta `3001`

2. criar um usuário na url `localhost:3001/auth/signup`
```
# POST /auth/signup
# Host: localhost:3001

{
    "username": "usuário1",
    "email": "teste@teste.com",
    "password": "senhadificil"
}
```

3. logar na aplicação na url `localhost:3001/auth/login`
```
# POST /auth/login
# Host: localhost:3001

{
    "email": "teste@teste.com",
    "password": "senhadificil"
}
```
a resposta deve ser nesse formato
```
{
  "error": null,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGVAZ21haWwuY29tIiwiaWQiOiI2MGEzYmQ0ZTU3ZjEzZjQxZDQyNWVjZjIiLCJpYXQiOjE2MjEzNDM1NzJ9.Onj5UDCGufiS-DMtxG9ALjSsupuu11iNOfIqvrPxJDc"
  }
}
```

4. pegar o token e alterar no arquivo [useToken.tsx](https://github.com/CauaneAndrade/chonkys-file-system/blob/master/src/pages/components/Login/UseToken.tsx#L11)
```
const getToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGVAZ21haWwuY29tIiwiaWQiOiI2MGEzYmQ0ZTU3ZjEzZjQxZDQyNWVjZjIiLCJpYXQiOjE2MjEzNDM1NzJ9.Onj5UDCGufiS-DMtxG9ALjSsupuu11iNOfIqvrPxJDc"
}
```

5. com esses passos deve ser possível subir a aplicação, sem problemas
    - ambiente de dev: `npm run dev`

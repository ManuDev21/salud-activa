const API = 'https://server-delta-bice.vercel.app/graphql';

async function gql(query) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return r.json();
}

async function main() {
  // Register Juan
  let res = await gql(`mutation {
    register(input: {
      nombre: "Juan"
      apellido: "Perez"
      correo: "juan@salud.com"
      contrasena: "123456"
      fecha_nacimiento: "1990-05-15"
      rol: USUARIO
    }) { token usuario { id nombre correo } }
  }`);
  console.log('Juan:', JSON.stringify(res));

  // Register Maria
  res = await gql(`mutation {
    register(input: {
      nombre: "Maria"
      apellido: "Lopez"
      correo: "maria@salud.com"
      contrasena: "123456"
      fecha_nacimiento: "1985-08-20"
      rol: FAMILIAR
    }) { token usuario { id nombre correo } }
  }`);
  console.log('Maria:', JSON.stringify(res));

  // Login Juan to get token
  res = await gql(`mutation {
    login(input: { correo: "juan@salud.com", contrasena: "123456" }) {
      token usuario { id }
    }
  }`);
  console.log('Login:', JSON.stringify(res));
}

main().catch(console.error);

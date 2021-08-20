export const tokenGenerator = (length: number) => {
  let token = "";
  const values = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < length; i++) token += values.charAt(Math.floor(Math.random() * values.length));
  return token;
}
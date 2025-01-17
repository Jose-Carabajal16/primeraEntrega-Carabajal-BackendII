import bcrypt from "bcrypt";

export async function hashPassword(password) {
  return await bcrypt.hash(password, bcrypt.genSaltSync(10));
}

export async function comparePassword(password, hashedpassword) {
  return await bcrypt.compare(password, hashedpassword);
}

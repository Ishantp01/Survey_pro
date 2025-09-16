import bcrypt from 'bcryptjs'

export const hashPassword= (plain) => {
const saltRounds = 10;
return bcrypt.hash(plain, saltRounds);
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
}
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { generateAccessToken } from '../index.js';
import { hashEncode } from '../../config/crypto.js';
import UserService from '../../services/user.service.js';

const userService = new UserService()

const local = () => {
  passport.use(new LocalStrategy(
    async function (username, password, done) {
      try {
        const user = await userService.get({ email: username });
        if (!user) { return done(null, false); }
        const hashed = hashEncode(password)
        const json = user.toJSON()
        if (user.password !== hashed) { return done(null, false); }
        const token = generateAccessToken({ username: user.id })
        return done(null, { ...json, token });
      } catch (error) {
        return done(error)
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  })
  passport.deserializeUser(async (id, done) => {
    const user = await userService.get({ where: { id: id } })
    done(null, user)
  })
}

export default local
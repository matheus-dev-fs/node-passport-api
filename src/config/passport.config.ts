import passport from "passport";
import { jwtStrategy } from "../auth/strategies/jwt.strategy.js";

passport.use(jwtStrategy);

export default passport;
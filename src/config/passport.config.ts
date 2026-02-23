import passport from "passport";
import { basicStrategy } from "../auth/strategies/basic.strategy.js";

passport.use(basicStrategy);

export default passport;
import passport from "passport";
import passportJWT from "passport-jwt";

import config from "./config.js";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const initializePassport = () =>{
  const cookieExtractor = (req)=>{
    let token = null;
    if(req && req.cookies){
      token = req.cookies["tokenUsrCookie"];
    }
    return token;
  };

  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: config.tokenPass
  }, async(jwt_payload, done)=>{
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }));
}

export default initializePassport;

const jmt = require("jsonwebtoken");
const config = require("../config");
class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async getUser(userDTO) {
    const user = await this.userModel.findOne({
      where: userDTO,
    });
    return user;
  }

  async login({username, password}){
    const userRecord = await this.userModel.findOne({
      where: { username },
    });
    if (!userRecord){
      this.logger.error("user not registered");
      throw new error("authentication failed");
    }
    this.logger.info("checking password");
    if(userRecord.password === password){
      this.logger.info("password correct");
      const user = {
        username: userRecord.username,
        role: userRecord.role || "guest",
      };
      const payload = {
        ...user,
        aud: config.jwt.audience || "localhost/api",
        iss: config.jwt.issuer || "localhost@fesb",
      };
      const token = this.generateToken(payload);

      return {user, token}

    }
  }
generateToken(payload){
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

}

module.exports = LoginService;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../user-model')
const bcrypt = require('bcrypt');

const verify = async (username, password, done)=>{
  const user = await User.findOne({username})
  if(!user){
    return done(null, false, { message: 'Username tidak ada' });
  }
  
  const match = await bcrypt.compare(password, user.password);
  if(match) {
    const userVerified = {
      id: user._id,
      username: user.username
    }
    return done(null, userVerified)
  }else{
    return done(null, false)
  }
}
  
const strategy = new LocalStrategy(verify);
  
passport.use(strategy);
passport.serializeUser((user, done)=>{
  done(null, user.id)
})

passport.deserializeUser((userId, done) =>{
  User.findById(userId)
    .then((user) =>{
      done(null, user)
    })
    .catch(err =>{
      done(err)
    })
})

module.exports = passport
import bcrypt from 'bcryptjs';
import db from '../database.js';
function signin(req, res) {
  const {email,password} = req.body
  if (!email || !password){
    return res.status(400).json('invalid credentials')
  }
  db.select('email','hash').from('login')
  .where('email','=', email)
  .then(data=>{
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if(isValid){
      return db.select('*').from('users')
      .where('email','=',email)
      .then(user=>{
        res.json({id: user[0].id,name: user[0].name,entries:user[0].entries})
      })
      .catch(err=>res.status(400).json('unable to get user'))
    }else{
      res.status(400).json('wrong credentials')
    }
  })
  .catch(err=>res.status(400).json('wrong credentials'))
}



function register(req, res) {
  const { email, password, name } = req.body;
  if (!email|| !password || !name){
    return res.status(400).json('invalid credentials')
  }
  
  console.log('Registration attempt:', { email, name }); // Log the attempt
  
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.transaction(trx=>{
    trx.insert({
      hash: hashedPassword,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail=>{
        return trx('users')
        .returning('*')
        .insert({
          email: (loginEmail[0]).email,
          name: name,
          joined: new Date(),
        })
        .then(user=>{
          console.log('User created successfully:', user[0]); // Log success
          res.json({id: user[0].id, name : user[0].name,entries : user[0].entries})
        })
        .catch(err => {
          console.error('Error creating user:', err); // Log user creation error
          throw err; // Re-throw to trigger rollback
        })
  })
  .then(trx.commit)
  .catch(trx.rollback)
    })
    .catch (err => {
      console.error('Registration transaction failed:', err); // Log transaction error
      res.status(400).json('unable to register')
    });
}
  
export { signin, register };

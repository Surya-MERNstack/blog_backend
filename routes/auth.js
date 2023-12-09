const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

//register user
router.post('/register',async(req,res)=>{
    try{
        const {username,email,password,profilePic}=req.body
        try{
            const salt=await bcrypt.genSalt(10)
            const hashedPass= await bcrypt.hashSync(password,salt)
            const user=new User({username,email,password:hashedPass,profilePic})
            await user.save()
            res.status(200).json(user)
            
    
        }
        catch(err){
            res.status(500).json(err)
        }

    }
    catch(err){ 
        console.log(err)
    } 
})

//login user
router.post('/login',async(req,res)=>{
  const {email, password} = req.body;
    try{
      console.log("login trying")
       const user= await User.findOne({email:email})
       if(!user) return  res.status(500).json("no user found!")

       console.log(password)
        const validated= await bcrypt.compare(req.body.password,user.password)

       if(!validated){
        res.status(500).json("no user found!")
       }
       else{
        const accessToken= await jwt.sign({id:user._id},process.env.token,{expiresIn:"15d"})
        // res.cookie('accessToken',accessToken).json('ok')
        console.log();
        
        const {password,...others}=user._doc
        res.status(200).json({...others,accessToken})
      //  console.log({...others,accessToken})
       }
    }
    catch(err){
      res.status(500).json({ error: 'Login is not working' });
   }
})




router.get('/profile',async(req,res)=>{
    try{
       
       const {token}=req.accessToken
       jwt.verify(token,process.env.token,{},(err,info)=>{
        if(err) throw err
        res.json(info)
       })

       jwt.verify(token,process.env.token,(err,user)=>{
        if(err){
            return res.status(401).json("token is not valid")
        }
        req.user=user
        next()
    })
       

    }
    catch(err){
       res.status(500).json(err)
    }
})

//LOG OUT USER
router.get("/logout",(req,res)=>{
    res.clearCookie('accessToken',{path:"/"})
    res.status(200).json("user logged out!")
})

// router.post('/logins', async (req,res) => {
//     const {email,password} = req.body;
//     const userDoc = await User.findOne({email});
//     const passOk = bcrypt.compareSync(password, userDoc.password);
//     if (passOk) {
//       // logged in
//       jwt.sign({email,id:userDoc._id}, process.env.token, {}, (err,token) => {
//         if (err) throw err;
//         const {password,...others}=userDoc._doc
//         // console.log(token)
//         res.cookie('token', token).json({
//         //   id:userDoc._id,
//         //   email,
//         //   username,profilePic
//         ...others
          
//         });
//       });
//     } else {
//       res.status(400).json('wrong credentials');
//     }
//   });
  
  router.get('/profile', (req,res) => {
    const {token} = req.accessToken;
    console.log(token)
    jwt.verify(token, process.env.token, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });


module.exports=router;



// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await User.findOne({ email: email });

//     if (!result) {
//       // User with this email does not exist
//       return res.status(401).json({
//         message: "Email is not available, please sign up",
//         status: 401,
//         alert: false,
//       });
//     }

//     // Compare the user input password with the password stored in the database
//     if (result.password !== password) {
//       // Password is wrong
//       return res.status(401).json({
//         status: 401,
//         message: "Password is wrong",
//       });
//     }

//     // If passwords match, create a user data object to send back to the client
//     const Send = {
//       email: result.email,
//       password: result.password,
//     };

//     res.status(200).json({
//       status: 200,
//       message: "Login Successfully",
//       alert: true,
//       data: Send,
//     });
//     console.log(Send);
//   } catch (error) {
//     console.error(error);
//     res.status(501).json({ message: "Server error", status: 501 });
//   }
// });

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const generateTokenPassReset=require("../config/generateTokenPassReset")
const sendEmail =require("../controllers/sendEmail");
const bcrypt = require("bcryptjs");


//@descrizione     Ottieni o Cerca tutti gli utenti
//@route           GET /api/user?search=
//@accesso         Protected
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@descrizione     Registra un nuovo utente
//@route           POST /api/user/
//@accesso         Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Devono essere compilati tutti i campi");
  }

  const userExists = await User.findOne({email});
  const userExists2 = await User.findOne({name});
  if (userExists) {
    res.status(400);
    throw new Error("Utente gia esiste");
  }
 if (userExists2) {
    res.status(400);
    throw new Error("Nickname non disponibile");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Utente non esiste");
  }
});

//@descrizione     Autorizza l'utente ad effettuare il login
//@route           POST /api/users/login
//@accesso         Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Credenziali non corrette ");
  }
});

//@descrizione     Controlla se l'email esiste prima di effetuare il reset password
//@route           POST /api/user/forgotpassword
//@accesso         Public
const forgotPasswordUser = asyncHandler(async (req, res) => {
 try {
            const {email} = req.body
            const user = await User.findOne({email})
            if(!user) return res.status(400).json({messsage: "Questa email non esiste!"})

            const token = generateTokenPassReset({id:user._id})
            const url = `http://localhost:3000/resetpassword/${token}`

            sendEmail(email, url,user.name)
            
            res.json({  _id: user._id,
                        
                        token: token})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
 


});

//@descrizione     Effettua il reset password 
//@route           POST /api/user/resetpassword
//@accesso         Protected
const resetPassword = asyncHandler(async (req, res) => {
try {
   const {name,password} = req.body
   const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);
  const user = await User.findOne({name});
      if(user.name !=name){
        return res.status(500).json({msg: "Password modificata con successo"})
      }else{
   await User.findOneAndUpdate({name},{
    password:hashpassword

   })}

  
return res.status(200).json({msg: "Password modificata con successo"})



} catch (error) {
  return res.status(500).json({msg: "Errore Nickname"})
}

})

//@descrizione     Effettua l'update del profilo utente nella sua home profilo
//@route           POST /api/user/profile
//@accesso         Protected
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
    if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
      
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      pic: updateUser.pic,
      token: generateToken(updateUser._id),
    });
  } else {
    res.status(404);
    throw new Error("Utente non presente");
  }
  
  });


//@descrizione     Elimina Account
//@route           DELETE /api/user/deleteAccount
//@accesso         Protected

const deleteAccount = asyncHandler(async (req, res) => {
try {
  await User.findByIdAndDelete(req.user.id)
  res.json({message:"Account elimonato con successo"});
  
} catch (error) {
  return res.status(500).json({message: error.message});
}


});

  

module.exports = { allUsers, registerUser, authUser,updateUserProfile,forgotPasswordUser,resetPassword ,deleteAccount};

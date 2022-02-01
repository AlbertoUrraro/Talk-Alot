
const jwt = require('jsonwebtoken')



const protectps = (req, res, next) => {
    
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Autenticazione non valida non possiede il token."})

        jwt.verify(token , process.env.JWT_SECRET,(err,user)=>{
            if(err)return res.status(400).json({message:"Autenticazione fallita" })
            req.user = user;
             next();
        })

      
    } catch (err) {
        return res.status(500).json({msg: "Non autorizzato, token scaduto"})
    }
};

module.exports = protectps;
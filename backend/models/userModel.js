const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Inserisci un email valida'] },
    password: { type: "String", required: true, 
                match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                "inserisci un password valida,minimo otto caratteri, almeno una lettera maiuscola, una minuscola e un numero!"]},
    pic: {
      type: "String",
      required: true,
      default:
        "https://ih1.redbubble.net/image.1046392292.3346/st,small,507x507-pad,600x600,f8f8f8.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    }
    
  },
  { timestaps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("User", userSchema);

module.exports = User;
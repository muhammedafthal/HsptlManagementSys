import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [false, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [false, "Please add a password"],
      unique: true,
      minlength: 6,
      maxlength: 10,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    phoneNumber: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  },
);

// Encrypt password using bcrypt
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model("User", userSchema);
export default User;

import express from "express";
import { db } from "../config/db.js";        // your drizzle db connection
import users from "../models/user.js";     // your users table definition
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

//login user
const loginUser = async(req,res) => {

  const {email,password} =  req.body;

  try {

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if(!user) return res.status(404).json({message:"User not found"});

    const isMatch = await  bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
     res.json({ message: "Login successful",token });
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
};


//signup user

const signupUser = async(req,res) => {
  const {name,email,password} = req.body;
  try {
    console.log("Signup request received with data:", { name, email }); // Debug log
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if(existingUser.length > 0) return res.status(400).json({message:"User already exists"});
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({name,email,password:hashedPassword}).returning();
    res.status(201).json({message:"User registered successfully",user:newUser});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }

}






// GET all users  protected routes admin can only access
const getUsers = async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get own profile   logged in user can access
 const getProfile = async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update own profile logged in user can access
 const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, req.user.id))
      .returning();

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET user by ID protected routes admin can only access
const getUserById = async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(users.id.eq(parseInt(req.params.id)));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// DELETE user protected routes admin can only access
const deleteUser = async (req, res) => {
  try {
    const [deletedUser] = await db.delete(users)
      .where(users.id.eq(parseInt(req.params.id)))
      .returning();
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const markAdmin = async (req, res) => {
  try {
    const [updatedUser] = await db.update(users)
    .where(users.id.eq(parseInt(req.params.id)))
    .set({isAdmin:true})
    .returning();
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User marked as admin successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export { getUsers, getUserById, getProfile, updateProfile, deleteUser, loginUser, signupUser, markAdmin };

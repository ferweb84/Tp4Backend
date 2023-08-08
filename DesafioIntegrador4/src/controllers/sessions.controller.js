import CurrentUserDto from "../dao/dtos/current-user-dto.js";
import { generateToken } from "../utilsjwt.js";
import SessionManager from "../dao/dbManagers/sessionsManager.js";
import { isValidPassword } from "../utils.js";
import config from "../config.js";
import jwt from "jsonwebtoken";
const sessionManager = new SessionManager()
const { jwtSecret } = config
export async function registerUser(req, res) {
  return res.send({ status: "Success", message: "User registered" })
}
export async function failRegister(req, res) {
  return res.send({ status: "status", error: "User already exists" })
}
export async function loginUser(req, res) {
  const { email, password } = req.body
  const user = await sessionManager.getUser({ email })
  if (!user) return res.status(401).send({ status: "error", error: "User does not exist" })
  if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Invalid credentials" })
  if (user.email === "adminCoder@coder.com") {
    user.role = "admin"
  } else {
    user.role = "user"
  }


  // if (!req.user)
  //   return res.status(401).send({ status: "error", error: "Unauthorized" });

  // if (req.user.email === "adminCoder@coder.com") {
  //   req.user.role = "admin"
  // } else {
  //   req.user.role = "user"
  // }
  // console.log(req.user)
  // req.session.user= {

  //   first_name: req.user.first_name,
  //   last_name: req.user.last_name,
  //   age: req.user.age,
  //   email: req.user.email,
  //   role: req.user.role,
  //   password: "",
  //   cart: req.user.cart,

  // }

  // return res.send({ status: "success", payload: req.user })
  const jwtUser = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    age: user.age,
    email: user.email,
    role: user.role,
    password: "",
    cart: user.cart,
  }

  const accesstoken = jwt.sign(jwtUser, config.jwtSecret, { expiresIn: "24h" })
 

  return res.cookie("jwtCookie", accesstoken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: jwtUser })
}
export function githubCallback(req, res) {

  const jwtUser = {
    name: req.user.first_name,
    email: req.user.email,
    cart: req.user.cart,
  };

  const token = jwt.sign(jwtUser, jwtSecret, { expiresIn: "24h" })

  res.cookie("jwtCookie", token, { httpOnly: true }).redirect("/products");
  // req.session.user = req.user
  // res.redirect("/products")
}
export function Logout(req, res) {
  return res.clearCookie("jwtCookie").send({ status: "sucess", message: "Log out sucessfull" })
}
export function failLogin(req, res) {
  res.send({ status: "error", error: "Authentication error" })
}
export function getcurrentUser(req, res) {


  const userDto = new CurrentUserDto(req.user);
  console.log(userDto)
  return res.send({ status: "success", payload: userDto })
}
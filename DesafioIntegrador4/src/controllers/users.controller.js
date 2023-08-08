import { userService } from "../dao/services/user.service.js";
import config from "../config.js"
import jwt from "jsonwebtoken"
const { jwtSecret } = config
export async function updateFunctionuser(req, res) {
  try {

    let result = {};
    let userRole = "";
    // console.log(user)
    const user_Id = req.params.uid;
    // const user=await userService.findbyuserid(user_Id)


    console.log(user_Id)
    let user = await userService.findbyuserid({ _id: user_Id });

    if (req.user.role !== "admin") {

      if (user.role === "user") {
        console.log("pasa aca 5")
        user.role = "premium"
        user = await userService.updateFunction(user_Id, { role: "premium" })
        userRole = "premium"
      } else {
        console.log("pasa aca 6")
        user = await userService.updateFunction(user_Id, { role: "user" })
        userRole = "user"
      }
      // result = await userService.updateFunction(user_Id, user);
    }

    // if (!result) {
    //    req.logger.error(`The user with the id ${pid} cannot be update his function`);
    //     return res.send({ status: "error", error: "Incomplete values" });
    // }
    console.log(userRole)
    return res.send({ status: "user successfully updated", payload: user.role });
  } catch (error) {
    console.log(error)
  }


}
export const changeroleUser = async (req, res) => {
  try {
    const { uid } = req.params

    if (!uid) {
      return res.status(400).send({
        status: 'error',
        error: 'Incomplete values'
      })
    }

    const roleChanged = await userService.changeRole(uid)

    if (!roleChanged) {
      return res
        .status(500)
        .send({ status: 'error', error: 'Failed to change role' })
    }

    return res.status(200).send({
      status: 'success',
      message: `Successfully changed role for user ${uid}`
    })
  } catch (error) {
    req.logger.error(`Failed to change role: ${error}`)
    return res.status(500).send({ status: 'error', error: `${error}` })
  }
}
export async function updateUserDocuments(req, res) {
  try {
    console.log(req.files)
    const userDocuments = req.files
    const { jwtCookie: token } = req.cookies
    const { email } = jwt.verify(token, jwtSecret, {
      ignoreExpiration: true
    })
    console.log(userDocuments)
    console.log(email)
    if (Object.keys(userDocuments).length === 0) {
      return res.status(400).send({
        status: 'error',
        error: 'You need to upload at least one file'
      })
    }

    if (!token) {
      return res.status(400).send({
        status: 'error',
        error: 'Failed to get token'
      })
    }

    if (!email) {
      return res.status(400).send({
        status: 'error',
        error: 'Failed to get user'
      })
    }

    const updatedUserDocumentsAndStatus = await userService.updateUserDocumentsAndStatus(email, userDocuments)

    if (!updatedUserDocumentsAndStatus) {
      return res.status(404).send({
        status: 'error',
        error: 'Failed to update user documents and status'
      })
    }

    res.status(201).send({ status: 'success', payload: "success" })
  } catch (error) {
    console.log(error)
    // req.logger.error(`Cannot update user documents with error: ${error}`)
    // return res.status(500).send({
    //   status: 'error',
    //   error: 'Failed to update user documents and status'
    // })
  }
  
}
export async function updateProfile(req, res){
  try {
    const profilePicture = req.file
    const { jwtCookie: token } = req.cookies
    const { email } = jwt.verify(token, jwtSecret, {
      ignoreExpiration: true
    })

    if (!token) {
      return res.status(400).send({
        status: 'error',
        error: 'Failed to get token'
      })
    }

    if (!email) {
      return res.status(400).send({
        status: 'error',
        error: 'Failed to get user'
      })
    }

    if (!req.file) {
      return res.status(400).send({
        status: 'error',
        error: 'Failed to save profile picture'
      })
    }

    const updatedProfilePicture = await userService.updateProfile(email, profilePicture)

    if (!updatedProfilePicture) {
      return res.status(404).send({
        status: 'error',
        error: 'Failed to update profile picture'
      })
    }

    res.status(201).send({ status: 'success', payload: updatedProfilePicture })
  } catch (error) {
    console.log(error)
  }
}
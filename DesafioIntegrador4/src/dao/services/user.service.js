import { userRepository } from "../repositories/user.repository.js";
class UserService {
  constructor() {
    this.userRepository = userRepository
  }
  findWiththemail = async (email) => {
    try {
      return await this.userRepository.findWithMail(email);
    } catch (error) {
      console.log(error)
    }
  }
  createtheUser = async (user) => {
    try {
      return await this.userRepository.createUser(user)
    } catch (error) {
      console.log(error)
    }
  }
  findbyuserid = async (id) => {
    try {
      return await this.userRepository.findById(id)
    } catch (error) {

    }
  }
  findbytheId = async (id) => {
    try {
      return await this.userRepository.findByCartId(id);
    } catch (error) {
      console.log(error);
    }
  }
  findbytheCartUser = async (cartId) => {
    try {


      return await this.userRepository.findByCartId(cartId)
    } catch (error) {
      console.log(error)
    }
  }
  updatetheUser = async (user) => {
    try {
      return await this.userRepository.updateUser(user);
    } catch (error) {
      console.log(error)
    }
  }
  updateFunction = async (id, user) => {
    try {

      return await this.userRepository.updateFunction(id, user);
    } catch (error) {
      console.log("error")
    }
  }

  async updateUserDocumentsAndStatus(email, userDocuments) {
    try {
      const newUserStatus = []
      const newUserDocuments = []

      const { documents } = await userRepository.findWithMail({ email })

      Object.values(userDocuments).forEach((els) => {
        els.forEach((el) => {
          const document = {
            name: el.fieldname,
            reference: `${el.fieldname}/${el.filename}`
          }
          newUserDocuments.push(document)
        })
      })

      newUserDocuments.forEach((newUserDoc) => {
        const existingDocIndex = documents.findIndex(
          (doc) => doc.name === newUserDoc.name
        )
        if (existingDocIndex !== -1) {
          documents[existingDocIndex] = newUserDoc
        } else {
          documents.push(newUserDoc)
        }
      })

      documents.forEach((el) => {
        newUserStatus.push(el.name)
      })

      const updates = {
        documents,
        status: newUserStatus
      }

      const updatedUserDocumentsAndStatus = await userRepository.updateUser({ email: email }, updates)

      return updatedUserDocumentsAndStatus
    } catch (error) {
      console.log(`Failed to update user documents and status with error: ${error}`)
      throw error
    }
  }
  async changeRole (uid) {
    try {
      const requiredStatus = ['identification', 'address', 'statement']
      const user = await userRepository.findById({ _id: uid })

      let missingStatus = []
      let roleChanged = false

      if (!user) {
        const user = await userRepository.findByCartId(uid)
        const userStatus = user.status

        missingStatus = requiredStatus.filter((el) => !userStatus.includes(el))

        if (requiredStatus.every((el) => userStatus.includes(el)) || user.role === 'premium') {
          const role = user.role === 'user' ? 'premium' : 'user'

          roleChanged = await userRepository.updateUser(
            { cart: uid },
            { role }
          )
        } else {
          throw new Error(`You're missing documents to upgrade your role: ${missingStatus.join(', ')}`)
        }
      } else {
        const userStatus = user.status

        missingStatus = requiredStatus.filter((el) => !userStatus.includes(el))

        if (requiredStatus.every((el) => userStatus.includes(el)) || user.role === 'premium') {
          const role = user.role === 'user' ? 'premium' : 'user'

          roleChanged = await userRepository.updateUser(
            { _id: uid },
            { role }
          )
        } else {
          throw new Error(`You're missing the following documentantion to upgrade your role: ${missingStatus.join(', ')}`)
        }
      }

      if (!roleChanged) { throw new Error(`Failed to change role for user ${uid}`) }

      return roleChanged
    } catch (error) {
      console.log(`Failed to change role: ${error}`)
      throw error
    }
  }
  updateConnection (email) {
    try {
      const connectionupd = userRepository.updateUser(
        { email:email },
        { last_connection: new Date() }
      )
      if (!connection_updated) throw new Error('Error updating user last connection')

      return connectionupd
    } catch (error) {
      console.log(`Failed to update last connection with error: ${error}`)
      throw error
    }
  }
  
  async updateProfile (email, profilePicture) {
    try {
      const newUserDocuments = []
      const { documents } = await usersRepository.getUser({ email })

      const documentUser = {
        name: profilePicture.fieldname,
        reference: `${profilePicture.fieldname}/${profilePicture.filename}`
      }
      newUserDocuments.push(documentUser)

      newUserDocuments.forEach((newUserDoc) => {
        const existingDoc = documents.findIndex(
          (doc) => doc.name === newUserDoc.name
        )
        if (existingDoc !== -1) {
          documents[existingDoc] = newUserDoc
        } else {
          documents.push(newUserDoc)
        }
      })

      const updatedUserDocumentsAndStatus = await userRepository.updateUser({ email }, { documents })

      return updatedUserDocumentsAndStatus
    } catch (error) {
      console.log(`Failed to update user documents and status with error: ${error}`)
      throw error
    }
  }
}

export const userService = new UserService()
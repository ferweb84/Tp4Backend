import { userModel } from '../models/user.model.js';

class UserRepository {
    constructor(){
        this.model = userModel;
    }

    findWithMail = async (email) => {
        try {
            return await this.model.findOne(email);
        } catch (error) {
            console.log(error)
        }
    };

    createUser = async(user) => {
        try {
            return await this.model.create(user);
        } catch (error) {
             console.log(error)
        }
    };

    findById = async(id) => {
        try {
            return await this.model.findOne(id).lean();
        } catch (error) {
           console.log(error)
        }
    };

    findByCartId = async(cartId) => {
        try {
            return await this.model.findOne({cart: cartId});
        } catch (error) {
             console.log(error)
        }
    }

    updateUser = async (user,updates) => {
        try {
            
            return await this.model.updateOne(user,updates);
        } catch (error) {
             console.log(error)
        }
    }
    updateFunction=async (id,user)=>{
        try {
            console.log(id)
            return await this.model.updateOne({_id:id},user);
            
        } catch (error) {
            console.log(error)
        }
    }
}


export const userRepository = new UserRepository();
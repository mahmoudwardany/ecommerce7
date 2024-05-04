import joi from 'joi'
import userModel from '../../models/userModel.js';

export const signupValidation={
    body:joi.object().required().keys({
        firstName:joi.string().min(3).max(20).required(),
        lastName: joi.string().min(3).max(20).required(),
        age: joi.number().required(),

        email:joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    })
}
export const signInValidation={
    body:joi.object().required().keys({
        email:joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    })
}
export const tokenValidation={
    params:joi.object().required().keys({
        token:joi.string().min(10).required(),
    })
}
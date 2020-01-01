 // VALIDATION
const Joi = require('joi');

const registerValidation = (data) =>{
    const schema = {
        userName : Joi.string().min(1).required(),
        password : Joi.string().min(6).required(),
        email    : Joi.string().min(1).required().email(),
    };
    return Joi.validate(data, schema);
};

const loginValidation  = (data) =>{
    const schema = {
        email    : Joi.string().min(1).required().email(),
        password : Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};

const changePassValidation = data =>{
    const schema = {
        userName : Joi.string().min(1).required(),
        oldpass : Joi.string().min(6).required(),
        newpass : Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
}

module.exports = { loginValidation, registerValidation, changePassValidation};
// module.exports.registerValidation = registerValidation; 
// module.exports.loginValidation = loginValidation;
// module.exports.changePassValidation = changePassValidation;
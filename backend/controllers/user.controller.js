const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const sgMail = require('@sendgrid/mail');

const saltRounds = 10;
const userModel = require('../models/user.model');

exports.login = (req, res)=>{
    const authModel = req.body;
    if(authModel) {
        userModel.findOne({email: authModel.email}, (err, user)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: {mssg: 'error: DB operation failed'}});
            } else {
                if(user) {
                    //checking if user is staff and not active
                    if(user.roleId===2 && !user.isApproved) {
                        res.json({status: 400, data: {mssg: "Register request not approved yet!"}})
                    } 
                    else if(user.roleId===2 && !user.isActive) {
                        res.json({ status: 400, data: {mssg: "Access denied!"}});
                    }
                    else {
                        bcrypt.compare(authModel.password, user.password, (err, result)=>{
                            if(err) {
                                console.log(err);
                                res.json({status: 500, data: {mssg: 'error: operation failed'}});
                            }
                            else {
                                if(result) {
                                    res.json({
                                    status: 200,
                                    data: user,
                                    token: jwt.sign({_id: authModel._id, roleId: authModel.roleId}, 
                                                    process.env.TOKEN_KEY, 
                                                    {expiresIn: process.env.EXPIRES_IN})
                                    });
                                }
                                else {
                                    res.json({status: 400, data: {mssg: 'invalid email/password'}});
                                }
                            }
                        });
                    }
                } else {
                    res.json({status: 400, data: {mssg: 'invalid email/password'}});
                }
            }
        });
    } else {
        res.json({status: 500, data: {mssg: 'error: no data passed'}});
    }
}

exports.registerUser = (req, res)=>{
    const userRegisterModel = req.body;
    if(userRegisterModel) {
        userModel.findOne({email: userRegisterModel.email}, (err, result)=>{ //can't use exists because we need to check doc details in case of staff
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                if(result) {
                    if(result.roleId==2) {
                        if(!result.isApproved) {
                            res.json({status: 400, data: "Request already generated"});
                        } else {
                            res.json({status: 400, data: "User already exists"});
                        }
                    } else {
                        res.json({status: 400, data: 'User already exists'});
                    }
                } else {
                    //for staff password will be generated when request is approved
                    if(userRegisterModel.roleId!=2) {
                        //---------------------------------------------
                        //generating the password
                        const password = generator.generate({
                            length: 10,
                            numbers: true
                        });
                        //hashing the password and storing in DB
                        bcrypt.hash(password, saltRounds, (err, hash)=>{
                            if(err) {
                                console.log(err);
                                res.json({status: 500, data: 'error: User could not be registered'});
                            }
                            else {
                                userRegisterModel.password = hash;
                                createUser(userRegisterModel);
                            }
                        });
                        //-------------------------------------------------
                    } else {
                        createUser(userRegisterModel);
                    }
                }
            }
        });
    } else {
        res.json({status: 500, data: 'error: no data passed'});
    }
    function createUser(userRegisterModel) {
        if(userRegisterModel.roleId==2) {
            userRegisterModel.isApproved = false;
            userRegisterModel.isActive = true;
        }
         userModel.create(userRegisterModel, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                //sending password in email(for staff members this will be done once request is approved)
                if(userRegisterModel.roleId!=2) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const mssg = {
                        to: "khanurooj5299@gmail.com",//??
                        from: "khanurooj5299@gmail.com",
                        subject: "Virtual Classroom Credentials",
                        text: `
                            Registraion successful. Your password is ${password}
                        `
                    }
                    sgMail.send(mssg).then(()=>{
                        res.json({status: 200, data: `Registration successful. Password has been sent to ${userRegisterModel.email}`});
                    }, error=>{
                        // console.log(error);
                        // //if email was not successfully sent, we need to remove the user we just in from the DB
                        // userModel.deleteOne({email: userRegisterModel.email}, (err, result)=>{
                        //     if(err) {
                        //         console.log(err);
                        //         res.json({status: 500, data: 'error: DB operation failed'});
                        //     } else {
                        //         res.json({status: 500, data: "error: user could not be registered"});
                        //     }
                        // });
                        res.json({status: 200, data: `Registration successful. Password has been sent to ${password}`});//??
                    });
                } else {
                    res.json({status: 200, data: "Register request generated"});
                }
            }
            });
    }
}

exports.updateUser = (req, res)=>{
    const userId = req.params['userId'];
    const user = req.body;
    if(user) {
        userModel.replaceOne({_id: user._id}, user, (err, result)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                if(result.modifiedCount>0) {
                    res.json({status: 200, data: 'update successful'});
                }
                else {
                    res.json({status: 400, data: 'no such user exists'});
                }
            }
        });
    } else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}

exports.getUser = (req, res)=>{
    const userId = req.params['userId'];
    userModel.findById(userId, (err, result)=>{
        if(err) {
            console.log(err);
            res.json({status: 500, data: 'error: DB operation failed'});
        } else {
            if(result) {
                res.json({status: 200, data: result});
            }
            else {
                res.json({status: 400, data: 'error: no such user exists!'});
            }
        }
    });
}

exports.changePassword = (req, res)=>{
    const userId = req.params['userId'];
    const passwords = req.body;
    if(passwords) {
        userModel.findById(userId, (err, user)=>{
            if(err) {
                console.log(err);
                res.json({status: 500, data: 'error: DB operation failed'});
            } else {
                if(user) {
                    //checking if old password is correct
                    bcrypt.compare(passwords.oldPass, user.password, (err, result)=>{
                        if(err) {
                            console.log(err);
                            res.json({status: 500, data: 'error: operation failed'});
                        }
                        else {
                            if(result) { 
                                //checking if new password and old password are same
                                bcrypt.compare(passwords.newPass, user.password, (err, result)=>{
                                    if(err) {
                                        console.log(err);
                                        res.json({status: 500, data: 'error: operation failed'});
                                    } else {
                                        if(result) {
                                            res.json({status: 400, data: 'Old and New password cannot be same'});
                                        } else {
                                            bcrypt.hash(passwords.newPass, saltRounds, (err, newPassHash)=>{
                                                if(err) {
                                                    console.log(err);
                                                    res.json({status: 500, data: 'error: operation failed'});
                                                }
                                                else {
                                                    userModel.findByIdAndUpdate(userId,{$set: {password: newPassHash}}, (err, updatedUser)=>{
                                                        if(err) {
                                                            console.log(err);
                                                            res.json({status: 500, data: 'error: DB operation failed'});
                                                        } else {
                                                            if(updatedUser) {
                                                                res.json({status: 200, data: 'Password successfully changed'});
                                                            }
                                                            else {
                                                                res.json({status: 400, data: 'no such user exists'});
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else {
                                res.json({status: 400, data: 'incorrect old password'});
                            }
                        }
                    });
                } else {
                    res.json({status: 400, data: 'error: no such user exists'});
                }
            }
        });
    } else {
        res.json({status: 500, data: 'error: no data passed'});
    }
}
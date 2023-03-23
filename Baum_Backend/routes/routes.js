const { json } = require('body-parser');
const express = require('express');
const fetch = require('cross-fetch')
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid')
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt")
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Initialize passprt
express().use(passport.initialize());
express().use(passport.session());

// passport.serializeUser((user, done) => {
//   done(null, user);
//   })
//   passport.deserializeUser((user, done) => {
//   done(null, user)
//   })

const saltRounds = 10;

const router = express.Router()

const userModel = require('../models/usermodel');
const CustomerSupport = require('../models/customerSupportModel');
const UserFeedback = require('../models/UserFeedbackModel');
const paywallModel = require('../models/paywallModel');
const PITModel = require('../models/PITModel');
const publisherRatingModel = require('../models/publisherRatingModel');

dotenv.config()

// Register route
router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user already exists
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

  
      // Generate verification token
      const token = uuidv4();
      const hashedPwd = await bcrypt.hash(password, saltRounds);
      // Save user to database
      const newUser = new userModel({
        email:email,
        password: hashedPwd,
        token:token,
        isTestAcc:'no'
      });
      await newUser.save();
  
      console.log(process.env.EMAIL_USER)
      // Send verification email
      //ulpsbpuzshmvlmmj
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `Click <a href="http://192.168.43.39:8000/api/verify?token=${token}">here</a> to verify your email`,
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error sending email' });
        }
        console.log(`Email sent: ${info.response}`);
        res.status(200).json({ message: 'User registered. Please check your email for verification instructions' });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Register route
router.post('/loginwithgoogle', async (req, res) => {
    try {
      const { email, password } = req.query;
  
      // Check if user already exists
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(200).json(user);
      }
      const hashedPwd = await bcrypt.hash(password, saltRounds);
      // Save user to database
      const newUser = new userModel({
        email:email,
        password: hashedPwd,
        verified:true,
        isTestAcc:'no'
      });
      const dataToSave = await  newUser.save();
      res.status(200).json(dataToSave)

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Verify email route
  router.get('/verify', async (req, res) => {
    const token = req.query.token;
  
    try {
      // Find user with matching token
      const user = await userModel.findOne({ token });
      //console.log(user)
      if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
      }
  
      // Update user's verified status
      user.verified = true;
      // Remove token
        user.token = '';
        await user.save();
        res.json({ message: 'Email verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        }
    });

// Screen 1: Request reset password code
router.post('/request-reset-password-code', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid email' });
        return;
      }
      const resetPasswordCode = Math.floor(10000 + Math.random() * 90000);
      user.resetPasswordCode = resetPasswordCode;
      user.resetPasswordCodeExpires = Date.now() + 600000; // 10 minutes
      await user.save();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password Code',
        text: `Your reset password code is: ${resetPasswordCode}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          console.log(`Reset password code sent to ${email}`);
          res.status(200).json({ message: 'Reset password code sent' });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Screen 2: Verify reset password code and get token
  router.post('/verify-reset-password-code', async (req, res) => {
    const { email, resetPasswordCode } = req.body;
    console.log(resetPasswordCode)
    try {
      const user = await userModel.findOne({ email, resetPasswordCode, resetPasswordCodeExpires: { $gt: Date.now() } });
      if (!user) {
        res.status(400).json({ message: 'Invalid or expired reset password code' });
        return;
      }
      const resetPasswordToken = uuidv4();
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordCodeExpires = Date.now() + 3600000; // 1 hour
      await user.save();
      res.status(200).json({ resetPasswordToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Screen 3: Reset password
  router.post('/reset-password', async (req, res) => {
    const { resetPasswordToken, password } = req.body;
    try {
      const hashedPwd = await bcrypt.hash(password, saltRounds);
      const user = await userModel.findOne({ resetPasswordToken });
      if (!user) {
        res.status(400).json({ message: 'Invalid or expired reset password token' });
        return;
      }
      user.password = hashedPwd;
      user.resetPasswordToken = undefined;
      user.resetPasswordCodeExpires = undefined;
      user.resetPasswordCode = undefined
      await user.save();
      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
//Post Method
router.post('/saveuser', async (req, res) => {
    const data = new userModel(
        {
            email: req.body.email,
            password: req.body.password
        }
    )
    try {
        const dataToSave = await  data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

// router.get('/aa', async (req, res) => {
//     res.status(200).json({messag:"Hello"})
// })

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await userModel.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by email and password Method
router.post('/getuser', async (req, res) => {
    try{
        const data = await userModel.findOne({email:req.query.email});
        const cmp = await bcrypt.compare(req.query.password, data.password);
        //console.log(cmp)
            // If the user is not found, return an error message
        if (!data) {
            return res.status(401).json({ message: 'Authentication failed.' });
        }
  
      // If the user's email address is not verified, return an error message
       else if (!data.verified) {
        return res.status(401).json({ message: 'Email address not verified.' });
      }
      else if (!cmp) {
        return res.status(401).json({ message: 'Wrong Password.' });
      }
      else if (data.verified && cmp) {
        return res.status(200).json(data);
      }
      else{
        return res.status(401).json({ message: 'Nothing to return' });
      }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by email 
router.get('/getuserbyemail', async (req, res) => {
    try{
        const data = await userModel.find({email:req.query.email});
            // If the user is not found, return an error message
        if (!data) {
            return res.status(401).json({ message: 'no dta found.' });
        }
        else {
        return res.status(200).json(data);
      }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by test account 
router.get('/getuserbytestacc', async (req, res) => {
    try{
        const data = await userModel.find({isTestAcc:req.query.isTestAcc});
            // If the user is not found, return an error message
        if (!data) {
            return res.status(401).json({ message: 'no dta found.' });
        }
        else {
        return res.status(200).json(data);
      }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//update user data
router.get('/updateuser', async (req, res) => {
  var query={email:req.query.email}
  const dataToUpdate = {isTestAcc:req.query.isTestAcc}
  try {
      const dataToSave = await  userModel.updateOne(query, dataToUpdate)
      res.status(200).json(dataToSave)
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }
})

//Get Latest Articles

router.get('/getrecentarticles', async (req, res) => {
    try{
        const form = new FormData();
        form.append(
            'date','2023-03-12'
        )
        const item = await fetch("http://localhost:5000/Recent", {
            method: 'POST',
            body: form
          })
          
          const data = await item.json()
          const list = await makeArticlesList(req.query.id,data)
          res.json(list)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/getAllPublishers', async (req, res) => {
    try{
        const item = await fetch("http://localhost:5000/Publishers", {
            method: 'POST',
          })
          
          const data = await item.json()
          res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get Articles Recommendations

router.get('/getrecommendations', async (req, res) => {
    try{
        const form = new FormData();
        form.append(
            'article_id',req.query.id
        )
        const item = await fetch("http://localhost:5000/Recommendations", {
            method: 'POST',
            body: form
          })
          
          const data = await item.json()
          const list = await makeArticlesList(req.query.uid,data)
          res.json(list)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//SearchArticles

router.get('/searcharticles', async (req, res) => {
    try{
      const form = new FormData();
      form.append(
          'keyword',req.query.keyword
      )
      const item = await fetch("http://localhost:5000/Search", {
          method: 'POST',
          body: form
        })
        
        const data = await item.json()
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Save Customer Support Messages

router.post('/customersupport', async (req, res) => {
  const data = new CustomerSupport(
    {
          userId: req.body.uid,
          message: req.body.message
    }
  )
 // console.log(data)
    try {
        const dataToSave = await  data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Save Customer Feedabck

router.post('/customerfeedback', async (req, res) => {
  const data = new UserFeedback(
    {
          userId: req.body.uid,
          message: req.body.message
    }
  )
 // console.log(data)
    try {
        const dataToSave = await  data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Delete User

router.delete('/deleteuser', async (req, res) => {
 // console.log(data)
 const userId = req.query.uid; // ID of the user to delete
    try {
      const result1 = await userModel.deleteOne({ _id: userId });
      const result2 = await CustomerSupport.deleteMany({ userId: userId });
      const result3 = await UserFeedback.deleteMany({ userId: userId });
      if(result1.acknowledged && result2.acknowledged && result3.acknowledged)
        res.status(200).json({message: 'Your account has been deleted!'})
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google authentication callback route
router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
      res.json('Account Created!')
  }
);

// Configure the Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: '929512267025-5h1tojde6nlqqr7uv4f5qa157pjs7iua.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user is already registered in your database
    const user = await userModel.findOne({ email: profile.emails[0].value });

    if (user) {
      // If the user is already registered, create a session token
      const sessionToken = user._id ;
      done(null, sessionToken);
    } else {
      // If the user is not registered, create a new user record in your database
      const newUser = new userModel({
        email: profile.emails[0].value,
        verified:true,
        isTestAcc:'no'
        // ... other user data
      });
      await newUser.save();
      const sessionToken =  newUser._id;
      done(null, sessionToken);
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
}));

//Get by ID Method
router.get('/getuserbyId', async (req, res) => {
  try{
      const data = await userModel.findOne({_id:req.query.id});
          // If the user is not found, return an error message
      if (!data) {
          return res.status(401).json({ message: 'Authentication failed.' });
      }
    // If the user's email address is not verified, return an error message
    if (!data.verified) {
      return res.status(401).json({ message: 'Email address not verified.' });
    }
    if (data.verified) {
      return res.status(200).json(data);
    }
      res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

// router.post('/checktarticles', async (req, res) => {
//   try{
//         const list = await makeArticlesList(req.body.id,req.body.data)
//         res.json(list)
//   }
//   catch(error){
//       res.status(500).json({message: error.message})
//   }
// })

//managing articles by paywall

const makeArticlesList = async (uid,artclesList)=>{

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

    let newList = []
    for (let data of artclesList){
      if(data.PayWall!=='unknown'){
        let check = await paywallModel.findOne({userId:uid,id:data.id})
        if(check){
          //console.log(check)
          var savedDate = new Date(check.loadDate);
          var currentDate = new Date(today);
          var diff = currentDate.getTime() - savedDate.getTime();
          var days = Math.floor(diff / (1000 * 60 * 60 * 24))

          if(data.PayWall === '4'){
            if(days>=7){
              var query={userId:uid,id:data.id}
              let dataToUpdate = {loadDate:today}
              await  paywallModel.updateOne(query, dataToUpdate)
              newList.push(data)
            }
          }
          else if(data.PayWall === '2'){
            if(days>=14){
              var query={userId:uid,id:data.id}
              let dataToUpdate = {loadDate:today}
              await  paywallModel.updateOne(query, dataToUpdate)
              newList.push(data)
            }
          }
          else if(data.PayWall === '1'){
            if(days>=28){
              var query={userId:uid,id:data.id}
              let dataToUpdate = {loadDate:today}
              await  paywallModel.updateOne(query, dataToUpdate)
              newList.push(data)
            }
          }

        }
        else{
          const paywall = new paywallModel({
            userId: uid,
            id:data.id,
            paywallVal:data.PayWall,
            loadDate:today
          });
          await paywall.save();
          newList.push(data)
          if(data.PayWall!=='0'){
            newList.push(data)
          }
        }
      }
      else{
        newList.push(data)
      }
    }
    return newList;
}

async function getAllPublishersRating() {
  try {
    const result = await publisherRatingModel.aggregate([
      {
        $group: {
          _id: null, // group all documents into a single group
          totalRatingCount: {
            $sum: '$ratingCount', // compute the sum of the ratingCount field
          },
        },
      },
    ]);
    
    const total = result[0].totalRatingCount;
    
    console.log('Total rating count:', total);
    
    return total;
  } catch (error) {
    console.error('Error:', error);
  }
}

//Getting PIT from frontend
router.post('/getpit', async (req, res) => {
  try{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    const query = {
      publisherName:req.body.pname,
      userId:req.body.uid
    }
      const options = {
        sort: { impressionDate: -1 },
        limit: 1
      };
      const data = await PITModel.findOne(query,options);
      var prevPITDate = new Date(data?data.toJSON().impressionDate:today);
      var currentDate = new Date(today);
      var diff = currentDate.getTime() - prevPITDate.getTime();
      var days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if(days<28){
        const total = await getAllPublishersRating();
        const pubTotal = await publisherRatingModel.findOne({publisherName:req.body.pname,userId:req.body.uid});
        if(!total && !pubTotal){
          const newPub = new publisherRatingModel({
            userId:req.body.uid,
            publisherName:req.body.pname,
            ratingCount:1
          });
          await newPub.save()
        }
        else{
          let onePubSum= pubTotal ? pubTotal.toJSON().ratingCount + 1 : 1
          let allPubSum= total ? total : 1
          const average = onePubSum / allPubSum
          let query={ratingCount:average}
          let dataToUpdate = {publisherName:req.body.pname}
          await  publisherRatingModel.updateOne(query, dataToUpdate)
        }
        const newPIT = new PITModel({
          userId:req.body.uid,
          publisherName:req.body.pname,
          impressionDate: today,
          IsPIT:1
        });
        await newPIT.save()
      }
      else{
        const newPIT = new PITModel({
          userId:req.body.uid,
          publisherName:req.body.pname,
          impressionDate: today,
          IsPIT:0
        });
        await newPIT.save()
      }
      res.status(200).json({result:'Executed'})
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

module.exports = router;
const express = require('express');
const router = express.Router();

 const userController=require("../Controller/userController")
 const shortcutController = require('../Controller/shortLinkController')
 const Middleware = require('../Middleware/Auth')

  router.post('/resisterUser',userController.resisterUser)
  router.post('/login',userController.login)

 router.post('/createUrl',Middleware.Auth,shortcutController.createUrl)
 router.get('/getAllshortcuts/:userId',Middleware.Auth,shortcutController.getAllshortcuts)
//  router.get('/getAllshortcuts/:userId',Middleware.Auth,shortcutController.getAllshortcuts)
 router.delete('/Deleteshortcut',Middleware.Auth,shortcutController.Deleteshortcut)
 router.get('/filtershortcut',shortcutController.filtershortcut)

module.exports = router;



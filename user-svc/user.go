package main

import (
	"fmt"
	"net/http"

	"gohub-trending/common"
	"gohub-trending/dbcommon"

	"github.com/gin-gonic/gin"
)

func createUser(c *gin.Context) {
	username := c.DefaultPostForm("username", "")
	password := c.DefaultPostForm("password", "")
	repassword := c.DefaultPostForm("repassword", "")

	errmsg := ""
	errorRet := 1
	msg := ""
	uid := 0

	userToken := ""
	httpStatus := http.StatusForbidden

	if len(username) == 0 {
		errmsg = "please input username"
	} else if len(username) > 12 {
		errmsg = "username too long"
	} else if len(password) == 0 {
		errmsg = "please input password"
	} else if len(password) < 6 || len(password) > 20 {
		errmsg = "password should greater then 6 and less then 20 characters"
	} else if password != repassword {
		errmsg = "repeact password should be the same as password"
	} else {
		password = common.GetSHA(password)
		uid, errmsg = dbcommon.CreateUser(username, password)
	}
	if errmsg == "" {
		userToken, _ = common.CreateTokenString(username, uid, common.GlobalConfig.Jwt.Secret, common.GlobalConfig.Jwt.Expires)
		msg = "create user succeed"
		errorRet = 0
		httpStatus = http.StatusOK
	} else {
		msg = errmsg
	}
	data := map[string]interface{}{
		"error": errorRet,
		"msg":   msg,
	}
	c.Header("x-user-token", userToken)
	c.JSON(httpStatus, data)
}

func loginUser(c *gin.Context) {
	username := c.DefaultPostForm("username", "")
	password := c.DefaultPostForm("password", "")

	errmsg := ""
	errorRet := 1
	msg := ""
	uid := 0

	userToken := ""
	httpStatus := http.StatusForbidden

	if len(username) == 0 {
		errmsg = "please input username"
	} else if len(username) > 12 {
		errmsg = "username too long"
	} else if len(password) == 0 {
		errmsg = "please input password"
	} else if len(password) < 6 || len(password) > 20 {
		errmsg = "password should greater then 6 and less then 20 characters"
	} else {
		password = common.GetSHA(password)
		uid, errmsg = dbcommon.LoginUser(username, password)
	}
	if errmsg == "" {
		userToken, _ = common.CreateTokenString(username, uid, common.GlobalConfig.Jwt.Secret, common.GlobalConfig.Jwt.Expires)
		msg = "login succeed"
		errorRet = 0
		httpStatus = http.StatusOK
	} else {
		msg = errmsg
	}
	data := map[string]interface{}{
		"error": errorRet,
		"msg":   msg,
	}
	c.Header("x-user-token", userToken)
	c.JSON(httpStatus, data)
}

func logoutUser(c *gin.Context) {
	errmsg := ""
	errorRet := 1
	msg := ""

	userToken := c.Request.Header.Get("x-user-token")
	httpStatus := http.StatusForbidden

	ut := common.VerifyTokenString(userToken, common.GlobalConfig.Jwt.Secret)
	if ut.Uid == 0 {
		errorRet = 2
		errmsg = "user not login yet"
	}

	if errmsg == "" {
		msg = "logout succeed"
		errorRet = 0
		httpStatus = http.StatusOK
	} else {
		msg = errmsg
	}
	data := map[string]interface{}{
		"error": errorRet,
		"msg":   msg,
	}
	c.Header("x-user-token", "")
	c.JSON(httpStatus, data)
}

func getUser(c *gin.Context) {
	errmsg := ""
	errorRet := 1
	msg := ""
	user := dbcommon.User{}

	userToken := c.Request.Header.Get("x-user-token")
	httpStatus := http.StatusForbidden

	ut := common.VerifyTokenString(userToken, common.GlobalConfig.Jwt.Secret)
	if ut.Uid == 0 {
		errorRet = 2
		errmsg = "user not login yet"
	} else {
		user, errmsg = dbcommon.GetUser(ut.Uid)
	}

	if errmsg == "" {
		msg = "get login user info succeed"
		errorRet = 0
		httpStatus = http.StatusOK
		userToken, _ = common.CreateTokenString(user.Username, user.Uid, common.GlobalConfig.Jwt.Secret, common.GlobalConfig.Jwt.Expires)
	} else {
		msg = errmsg
		userToken = ""
	}
	data := map[string]interface{}{
		"error": errorRet,
		"msg":   msg,
	}
	c.Header("x-user-token", userToken)
	c.JSON(httpStatus, data)
}

func updateUser(c *gin.Context) {
	oldpassword := c.DefaultPostForm("oldpassword", "")
	password := c.DefaultPostForm("password", "")
	repassword := c.DefaultPostForm("repassword", "")

	errmsg := ""
	errorRet := 1
	msg := ""

	userToken := c.Request.Header.Get("x-user-token")
	httpStatus := http.StatusForbidden

	ut := common.VerifyTokenString(userToken, common.GlobalConfig.Jwt.Secret)
	if ut.Uid == 0 {
		errorRet = 2
		errmsg = "user not login yet"
	} else {
		if len(oldpassword) == 0 {
			errmsg = "please input old password"
		} else if len(password) == 0 {
			errmsg = "please input password"
		} else if len(oldpassword) < 6 || len(oldpassword) > 20 {
			errmsg = "old password should greater then 6 and less then 20 characters"
		} else if len(password) < 6 || len(password) > 20 {
			errmsg = "password should greater then 6 and less then 20 characters"
		} else if password != repassword {
			errmsg = "repeact password should be the same as password"
		} else {
			password = common.GetSHA(password)
			oldpassword = common.GetSHA(oldpassword)
			errmsg = dbcommon.UpdateUser(ut.Uid, password, oldpassword)
		}
	}

	if errmsg == "" {
		msg = "update password succeed"
		errorRet = 0
		httpStatus = http.StatusOK
		userToken, _ = common.CreateTokenString(ut.Username, ut.Uid, common.GlobalConfig.Jwt.Secret, common.GlobalConfig.Jwt.Expires)
	} else {
		msg = errmsg
		userToken = ""
	}
	data := map[string]interface{}{
		"error": errorRet,
		"msg":   msg,
	}
	c.Header("x-user-token", userToken)
	c.JSON(httpStatus, data)
}

func main() {
	router := gin.New()
	router.Use(common.IstioHeadersForward(), gin.Recovery(), gin.Logger())

	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": 1, "msg": "404 page not found"})
	})

	routerUsers := router.Group("/users")
	{
		routerUsers.POST("/", createUser)
		routerUsers.POST("/login/", loginUser)
		routerUsers.POST("/logout/", logoutUser)
		routerUsers.GET("/", getUser)
		routerUsers.PUT("/", updateUser)
	}
	router.Run(fmt.Sprintf(":%v", common.GlobalConfig.Users.Port))
}

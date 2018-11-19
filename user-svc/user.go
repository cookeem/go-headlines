package main

import (
	"gohub-trending/common"
	"log"
)

func main() {
	tokenStr, _ := common.CreateTokenString("cookeem", 1, 5, common.SecretStr)
	log.Println(tokenStr)
	// time.Sleep(time.Second * 1)
	claims, err := common.VerifyTokenString(tokenStr, common.SecretStr)
	log.Println("[DEBUG]", claims.Uid, claims.Username, claims.ExpiresAt, claims.Issuer, err)
}

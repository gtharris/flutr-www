package main

import (
	// "github.com/melvinmt/firebase"
	"gopkg.in/chourobin/go.firebase.v1"
	"fmt"
	// "encoding/json"
)

type crumbs struct {
	accuracy int
	id int
	lat string
	lng string
	speed float32
	surveyID int
	time_date string
	time_time string
}

type testNum struct {
	dat int
}

func fbtestp() {
	root := firebase.New("https://ubr-testing.firebaseio.com")

	// fmt.Println(root.Get("/users/andrew/survey/crumb0"))

	bts, err := root.Get("/users/andrew/survey/crumb0")
	_ = err
	fmt.Println(string(bts))

	// crumbDat := new(crumbs)
	// json.Unmarshal(bts,crumbDat)
	// fmt.Println(crumbDat.accuracy, crumbDat.id, crumbDat.lat, crumbDat.lng, crumbDat.speed, crumbDat.surveyID, crumbDat.time_date, crumbDat.time_date)
}

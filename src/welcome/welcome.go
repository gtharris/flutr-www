package welcome

import (
        "fmt"
        "net/http"
)

func init() {
        http.HandleFunc("/", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Welcome from the language of the coming decade - Go!\n Hello Diane")
}

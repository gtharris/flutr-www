# go.firebase

A simple REST client in Go for the Firebase backend API. Use this package to quickly update your firebase.

## Installation

````
go get -u gopkg.in/chourobin/go.firebase.v1
````

## Usage

Include the package in your code and create an instance.
````
import "github.com/chourobin/go.firebase"

firebaseRoot = firebase.New("https://your-firebase.firebaseio.com")

// Set the auth token (optional)
firebaseRoot.auth_token = "your-auth"
````

Currently go.firebase supports Get, Set, Update, Push, Delete
````
msg := Message{testing: "1..2..3"}

firebaseRoot.Set("/path", msg)

firebaseRoot.Get("/path")

firebaseRoot.Push("/path", msg)

firebaseRoot.Update("/path", msg)

firebaseRoot.Delete("/path")
````

## License

Copyright (c) 2013 Robin Chou

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

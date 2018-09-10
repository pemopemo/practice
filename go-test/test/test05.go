package main

import (
	"fmt"
)

func main() {
	m := make(map[int]string)

	m[12] = "AAA"

	fmt.Println(m[12], m)
}

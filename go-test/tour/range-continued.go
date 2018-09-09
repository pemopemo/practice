package main

import (
	"fmt"
)

func main() {
	pow := make([]int, 10)
	fmt.Printf("%T %v\n", pow, pow)

	for i := range pow {
		pow[i] = 1 << uint(i)
	}

	fmt.Printf("%T %v\n", pow, pow)

	for _, value := range pow {
		fmt.Printf("%d\n", value)
	}
}

package main

import (
	"fmt"
	"strings"

	"golang.org/x/tour/wc"
)

func WordCount(s string) map[string]int {

	sep := strings.Fields(s)

	fmt.Printf("%v %T\n", sep, sep)

	m := make(map[string]int)
	for _, v := range sep {
		value, ok := m[v]
		if !ok {
			m[v] = 1
		} else {
			m[v] = value + 1
		}
	}

	return m
}

func main() {
	wc.Test(WordCount)
}

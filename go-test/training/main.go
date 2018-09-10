package main

import (
	"bufio"
	"flag"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

func openData(s string) (num int, data []int) {

	var contents []string

	file, err := os.Open(s)

	if err != nil {
		panic(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for i := 0; scanner.Scan() || i < 2; i++ {
		line := scanner.Text()

		if i == 0 {
			num, _ = strconv.Atoi(line)
		} else {
			contents = strings.Fields(line)
		}
	}

	data = stringArrayToInt(contents)

	return
}

func stringArrayToInt(s []string) []int {

	var data []int = make([]int, len(s))

	for i := 0; i < len(s); i++ {
		data[i], _ = strconv.Atoi(s[i])
	}

	return data
}

func main() {

	flag.Parse()
	path := flag.Arg(0)

	if flag.Arg(0) == "" {
		fmt.Println("Error!")
		return
	}

	number, data := openData(path)

	for i := range data {
		max := math.MinInt64
		for j := 0; j < len(data); j++ {
			if i != j {
				if max < data[j] {
					max = data[j]
				}
			}
		}
		fmt.Println(max)
	}

	fmt.Printf("Format: %v %T\n%v %T\n", number, number, data, data)

}

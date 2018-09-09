package main

import (
	"fmt"

	"golang.org/x/tour/pic"
)

func Pic(dx, dy int) [][]uint8 {
	image := make([][]uint8, dy)

	for y := range image {
		image[y] = make([]uint8, dx)
	}

	for y := 0; y < dy; y++ {
		for x := 0; x < dx; x++ {
			//			image[y][x] = uint8((x + y) / 2)
			//			image[y][x] = uint8(x * y)
			image[y][x] = uint8(x ^ y)
		}
	}

	fmt.Println(len(image), cap(image), image)

	return image
}

func main() {
	pic.Show(Pic)
}

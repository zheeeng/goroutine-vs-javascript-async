package main

import (
	"fmt"
	"time"
)

func fibAux(next, quit chan int) {
	x, y := 0, 1
	for {
		select {
		case next <- x:
			x, y = y, x+y
			time.Sleep(time.Millisecond * 500)
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}

func fib(count int) {

	next := make(chan int)
	quit := make(chan int)

	go func() {
		for i := 0; i < count; i++ {
			fmt.Println("get data: ", <-next)
		}
		quit <- 0
	}()

	fibAux(next, quit)
}

func main() {
	fib(10)
}

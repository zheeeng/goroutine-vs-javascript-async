import { runSaga, delay, channel, Channel } from 'redux-saga'
import { take, race, put, call, fork } from 'redux-saga/effects'

function *fibAux (next: Channel<number>, quit: Channel<{}>) {
  let [x, y] = [0, 1]

  while (true) {
    const { q } = yield race({
      n: call(function * () {
        yield put(next, x)
        ;
        [x, y] = [y, x + y]
        yield delay(500)
      }),
      q: call(function * () {
        yield take(quit)
        console.log('quit')

        return true
      }),
    })

    if (q) return undefined
  }
}

function *fib (count: number) {
  const next: Channel<number> = yield channel()
  const quit: Channel<{}> = yield channel()

  yield fork(function* () {
    for (let i = 0; i < count; i++) {
      const fibSum = yield take(next)

      console.log('get data: ', fibSum)
    }

    yield put(quit, {})
  })

  yield call(fibAux, next, quit)
}

runSaga(
  {},
  function * () { yield fib(10) },
)

import { applyChange as _applyChange, Diff, diff } from "deep-diff"
import { cloneDeep } from 'lodash'
import { createStore } from 'redux'

const lhs = {
  name: 'original object',
  array: ['first', 'second']
}

const rhs = {
  name: 'updated object',
  array: ['first', 'second', 'third']
}


const applyChange = (target: any, diff: Diff<any, any>) => {
  const clone = cloneDeep(target)
  _applyChange(clone, {}, diff)
  return clone
}

const applyChanges = (target: any, diffs: Diff<any, any>[]) => {
  const clone = cloneDeep(target)
  diffs.forEach(diff => {
    _applyChange(clone, {}, diff)
  })
  return clone
}

// const d = diff(lhs, rhs)!
// const r = applyChanges({}, d)
// console.log(r)






const simpleReducer = (state = 0, action: any) => {
  console.log(action)
  return state + 1
}


const store = createStore(simpleReducer)

store.subscribe(() => {
  const state = store.getState()
  console.log(state)
})

store.dispatch({ type: 'increment' })

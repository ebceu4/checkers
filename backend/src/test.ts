import { parseCallbackQueryToken, stringifyCallbackQueryToken } from './queryToken';
import { numberFromBytes, numberToBytes, shortStringFromBytes, shortStringToBytes } from './utils';

// const b1 = shortStringToBytes('hello this is short string!')
// const b2 = shortStringToBytes('this is additional string!')
// const b = Buffer.concat([b1, b2])
// const { value, rest } = shortStringFromBytes(b)
// const { value: v } = shortStringFromBytes(rest)
// console.log(value)
// console.log(v)

// const b3 = numberToBytes(Number.MAX_SAFE_INTEGER)
// console.log(b3)
// const n = numberFromBytes(b3)
// console.log(Number.MAX_SAFE_INTEGER)
// console.log(n)
// console.log(n === Number.MAX_SAFE_INTEGER)


const token = stringifyCallbackQueryToken({ id: 'afgsgas', user: { id: 245252, first_name: '224524524', username: 'dfadfadf' } })
console.log(token)

console.log(parseCallbackQueryToken(token))

//console.log(parseCallbackQueryToken('237f62e30d5006098bb584e0f8d69f1624af8c56ca176b71e05713e8ba6f0ccb10194d8317215a014aee053a4412597fb86bcfd88b2605193456f6626fb32e65983a8f84fa4e6a31f1d06ab28af11ef489b2d84931550cb112f0763ebd822c6203030d946051423a18fdfff92d291f8fae5b469b7806ece7b489c75ee9570762e30ae0866db9d2c85ac549b5dd0cd4f9af74f05d34631598c285c357162619fba3c7c7a2495d9fe92bfde1b76d64da80f603512bb403f7a99352b2ec4a'))

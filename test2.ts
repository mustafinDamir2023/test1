import { prepareString } from './test1'

const names1: string[] = ['john', 'paul']
const names2: string[] = ['george', 'ringo']
const names3: string[] = ['lennon', 'mick']
const names4: string[] = ['john', 'ringo']
const names5: string[] = ['paul', 'mick']
const names6: string[] = ['main', 'main']
const names7: string[] = ['main', 'main', 'main']

console.log(prepareString(names1))
console.log(prepareString(names2))

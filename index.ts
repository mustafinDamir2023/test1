import path from 'path'
import fs from 'fs'

{
  /**
   * Задание 1
   *
   * Напишите реализацию класса Call
   */

  class Call {
    private linkedid: string | null
    private direction: number | null
    private exten: string | null
    constructor() {
      this.linkedid = null
      this.direction = null
      this.exten = null
    }

    setLinkedid(linkedid: string) {
      this.linkedid = linkedid
      return this
    }
    setDirection(direction: number) {
      this.direction = direction
      return this
    }

    setExten(exten: string) {
      this.exten = exten
      return this
    }
  }

  const call = new Call()

  call.setLinkedid('1720023.1422').setDirection(2).setExten('243')
}

{
  /**
   * Задание 2
   *
   * Упростите код
   */

  function _getUniqueValues() {
    const array = ['1', '1', '4', '5', '6', '6', '9', '11']
    const uniqueValuesInfo: any = {}
    const uniqueValues: string[] = []

    for (const value of array) {
      if (!uniqueValuesInfo[value]) {
        uniqueValues.push(value)
      }

      uniqueValuesInfo[value] = true
    }

    return uniqueValues
  }
}

function getUniqueSet(arr: Array<string>): Array<string> {
  return Array.from(new Set(arr))
}

{
  /**
   * Задание 3
   *
   * В POST-запросе передается .gzip-файл и параметр pathToSave
   * Напишите callback для express, который сохранит файл из запроса по пути, указанному в pathToSave
   */

  const callback = (req: any, res: any) => {
    const file = req.file
    const { pathToSave } = req.body

    if (!file || !pathToSave) {
      return res.status(400).send()
    }

    const savePath = path.resolve(pathToSave)
    fs.rename(file.path, savePath, (err) => {
      if (err) {
        return res.status(500).send()
      }
      res.json(savePath)
    })
  }
}

{
  /**
   * Задание 4
   *
   * Реализуйте декоратор model чтобы методы на последних двух строках отработали как указано в комментарии
   * Для проверки можете использовать TS-playground с включенным флагом experimentalDecorators
   */

  function model(params: { devName: string }) {
    return function (constructor: Function) {
      constructor.prototype.constructor.devName = params.devName
    }
  }

  @model({ devName: 'CarModel' })
  class MyModel {
    constructor() {
      console.log('init  MyModel')
    }

    static devName: string
    static sayMyName() {
      console.log(`MyModel is ${this.devName}`)
    }
  }

  MyModel.sayMyName() // prints: "MyModel is CarModel"
  console.log(MyModel.devName) // prints: "CarModel"
}

{
  /**
   * Задание 5
   *
   * Напишите типизацию для MessageCreational
   */

  interface Message {
    _id: number
    content: string
    authorId: number
    createdAt: number
    updatedAt: number
  }

  type MessageCreational = Omit<Message, '_id'>

  const database = {} as unknown as {
    createMessage: (item: MessageCreational) => Promise<Message>
  }

  function createMessage(
    creationalObject: MessageCreational
  ): Promise<Message> {
    return database.createMessage(creationalObject)
  }
}

{
  /**
   * Задание 6
   *
   * Есть Машина1 и Машина2. Они мчатся по трассе в интервале времени от 0с до 100с. У нас есть список событий, когда одна машина обгоняла другую:
   * Напиишите код, который посчитает, сколько времени лидировала каждая машина.
   */

  type Info = {
    timeFromStart: number
    nowLeadersIs: string
  }

  const highlights: Array<Info> = [
    { timeFromStart: 1, nowLeadersIs: 'Car1' },
    { timeFromStart: 11, nowLeadersIs: 'Car2' },
    { timeFromStart: 13, nowLeadersIs: 'Car1' },
    { timeFromStart: 45, nowLeadersIs: 'Car2' },
    { timeFromStart: 57, nowLeadersIs: 'Car1' },
    { timeFromStart: 69, nowLeadersIs: 'Car2' }
  ]

  const everyCarLead = (arr: Info[]): Record<string, number> => {
    const result = arr.reduce((acc: any, info, index, array) => {
      const nextTime = array[index + 1] ? array[index + 1].timeFromStart : 100
      const diff = nextTime - info.timeFromStart

      const key = info.nowLeadersIs
      if (!acc[key]) {
        acc[key] = 0
      }
      acc[key] = acc[key] + diff
      return acc
    }, {})

    return result
  }
}

{
  /**
   * Задание 7
   *
   * Проанализуйте код. Кратко опишите, что по вашему он делает и какие в нем есть проблемы.
   */

  type ReportsController = { preloadData: Function; preprocess: Function }
  // file: ReportsController

  let isUseNewLogic = false

  class ReportsAPI {
    // Инициализация _reportsController упрощена для тестового задания
    private _reportsController = {} as ReportsController

    init(clientVersion: number) {
      if (clientVersion > 1000) {
        isUseNewLogic = true
      }
    }

    async getReportData(reportName: string, params: { moreInfo?: boolean }) {
      isUseNewLogic = isUseNewLogic && !!params.moreInfo

      const data = await this._reportsController.preloadData(
        reportName,
        isUseNewLogic
      )

      return this._reportsController.preprocess(reportName, data, isUseNewLogic)
    }
  }

  const reportsAPI = new ReportsAPI()

  let isStarted = false

  /* export */ function onStart(clientVersion: number) {
    if (isStarted) {
      return
    }

    reportsAPI.init(clientVersion)

    isStarted = true
  }

  /* export */ function getReportData(
    reportName: string,
    isNeedMoreInfo = false
  ) {
    return reportsAPI.getReportData(reportName, { moreInfo: isNeedMoreInfo })
  }
}

// Код представляет Api для работы с отчетами. Представлен класс ReportsAPI в котором есть медоды init для инициализации (если
// версия клиента > 1000 то устанавливается флаг isUseNewLogic = true),
// и getReportData асинхронный запрос для получения данных по отчету. Также есть функции onStart запускающая инициализацию и
// getReportData для получения данных.
// Что исправить: нужно вынести глобальную переменную isUseNewLogic в класс ReportsAPI,
// чтобы не было конфликтов при выполнении метода getReportData и можно было создавать несколько экземпляров ReportsAPI каждый из которых
// будет отслеживать свой статус.
// Необходимо поменять нейминг методв и функции getReportData.
// async getReportData поскольку асинхронная, нужно обернуть в try catch, для обработки ошибок.
// также нет вызовов функций onStart и getReportData в коде.

{
  /**
   *  Задание 8
   *
   *  Предположим, что функция asyncFunctionExecutedTooLong может выполняться очень долго, но нам нужно ее вызвать.
   *  Нужно написать код, который вызовет функцию asyncFunctionExecutedTooLong и:
   *   - либо дождётся выполнения асинхронной функции asyncFunctionExecutedTooLong
   *   - либо завершится с ошибкой 'Timeout' через 2 секунды после начала работы
   *  Если execWithTimeout завершается с ошибкой 'Timeout', то не забыть вызвать `cancel` у Deferred-объекта, который
   *   возвращает функция asyncFunctionExecutedTooLong
   */

  function execWithTimeout() {
    // Deferred is Promise-like object
    const promiseLike = asyncFunctionExecutedTooLong()
    const DEFAULT_TIMEOUT = 2000

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject('Timeout')
      }, DEFAULT_TIMEOUT)
    })

    return Promise.race([promiseLike, timeoutPromise])
  }
}

/**
 * Ниже - технический код
 */

let asyncFunctionExecutedTooLong_called = false
let deferredCancel_called = false

// @ts-ignore
class Deferred extends Promise {
  resolve
  reject
  cancel: Function

  constructor(executor: Function) {
    let res
    let rej
    super((resolve: Function, reject: Function) => {
      res = resolve
      rej = reject
      if (typeof executor === 'function') {
        return executor(resolve, reject)
      }
    })
    this.resolve = (res || (() => {})).bind(this)
    this.reject = (
      rej ||
      ((err: string) => {
        err
      })
    ).bind(this)

    this.cancel = () => {
      asyncFunctionExecutedTooLong_called = false
      deferredCancel_called = false
      return
    }
  }
}

function asyncFunctionExecutedTooLong() {
  // Нельзя изменять содержимое этой функции.
  let timer: number | undefined

  const deferred = new Deferred((resolve: Function) => {
    asyncFunctionExecutedTooLong_called = true

    timer = setTimeout(resolve, 0x240_c_840_0)
  })

  deferred.cancel = function (err: string) {
    deferredCancel_called = true

    if (timer) {
      clearTimeout(timer)
      timer = void 0
    }

    deferred.reject(err)

    return deferred
  }

  return deferred
}

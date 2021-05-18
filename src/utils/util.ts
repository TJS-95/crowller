interface Result {
  sucesss: boolean
  errMsg?: string
  data: any
}

export const getResponseData = (data: any, errMsg?: string): Result => {
  if (errMsg) {
    return {
      sucesss: false,
      errMsg,
      data,
    }
  } else {
    return {
      sucesss: true,
      data,
    }
  }
}

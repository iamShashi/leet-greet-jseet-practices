/*
    Thought and idea behind this:
    A promise is nothing but a asynchronous function call
    it takes an executor function which has two 
    functions resolve and reject and it either does one or two
    it exposes then and catch functions which in turn
    get called depeding it was resolved or it was rejected
    it also recieves some callbacks for both which gets called.
*/

class MyPromise {
  // every class has a constructor which can be used to create variables binded
  // to the class using this
  constructor(executor) {
    // promise can have 3 state pending, fulfilled and rejected
    this.promiseState = "pending";
    // array of successcallbacks
    this.successCallbacks = [];
    // array of errorcallbacks
    this.errorCallbacks = [];
    this.promiseResult = undefined;
    /*  
        resolve bound to the function note
        we are not using the classical function declaration
        but using arrow function as this variable in the
        classical declaration will be binded to
        window's context in arrow declaration it is
        binded to class context
    */
    const resolve = (argvalue) => {
      /* 
        we wait till the resolve is called inside
        promise and the we set the state as fulfilled and call 
        the callbacks pushed to successcallback with argvalue
      */

      if (this.promiseState == "pending") this.promiseState = "fullfilled";
      this.promiseResult = argvalue;
      this.successCallbacks.forEach((callback) => callback(argvalue));
    };
    /* 
        we wait till the resolve is called inside
        promise and the we set the state as rejected and call 
        the callbacks pushed to errorCallback with argvalue
      */
    const reject = (argvalue) => {
      if (this.promiseState == "pending") this.promiseState = "rejected";
      this.promiseResult = argvalue;
      this.errorCallbacks.forEach((callback) => callback(argvalue));
    };
    /*
        executor is called which triggers the function inside promise
        i.e new Promise((resolve,reject)=>{ setTimeout(()=> resolve()),2000})
    */
    executor(resolve, reject);
  }

  /*
    standard then is binded to this class in order to call then method
  */
  then(successCallback, errorCallback) {
    /*
        you return new Promise for every then executed since
        1. there is no direct connect between then and catch but through this
        promise class only. so then returns a promise which has a catch function 
        as well.
        2. you wish to allow chaining of the promises.
    */

    return new MyPromise((resolve, reject) => {
      const handleSuccess = (value) => {
        try {
          const result = successCallback ? successCallback(value) : value;
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      const handleError = (reason) => {
        try {
          if (errorCallback) {
            const result = errorCallback(reason);
            resolve(result);
          } else {
            reject(reason);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.promiseState === "fulfilled") {
        handleSuccess(this.promiseResult);
      } else if (this.promiseState === "rejected") {
        handleError(this.promiseResult);
      } else {
        this.successCallbacks.push(handleSuccess);
        this.errorCallbacks.push(handleError);
      }
    });
  }
  catch(errorCallback) {
    /*
        the real magic is in a push array you can push anything a function or 
        a value now we are pushing in a wrapper function for our callback
        which executes the function gets the result and then calls resolve
        with the same result the arg value is passed on from top when resolved is called
    */
    this.then(undefined, errorCallback);
  }
  /*
    Myall is polyfill for promise.all
    which neccessarily calls all the promises
    waits for either all are resolved orr if any at
    all is rejected
    it returns the return value of resolve of the array
    and on reject it only return one value/reason of the rejection
  */
  myAll(promiseArray) {
    let promiesResolvedStatus = [];
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArray.length; i++) {
        if (promiseArray[i].then) {
          promiseArray[i]
            .then((resolvedValue) => {
              promiesResolvedStatus[i] = resolvedValue;
              if (promiesResolvedStatus.length == promiseArray.length) {
                resolve({ status: "fulfilled", values: promiesResolvedStatus });
              }
            })
            .catch((rejectReason) => {
              reject({ status: "rejected", reason: rejectReason });
            });
        } else {
          if (promiesResolvedStatus.length == promiseArray.length) {
            resolve(promiesResolvedStatus);
          }
        }
      }
    });
  }
  /*
    myAllSettled is polyfill for promise.allSettled
    which neccessarily calls all the promises
    waits for either all to resolve or reject 
    it returns the array of all the promise values
    with {status:'fulfilled', value:'successfull'}
    and on reject it return {status:'rejected', reason:'reject reason'}
  */
  myAllSettled(promiseArray) {
    let promiesResolved = [];

    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArray.length; i++) {
        if (promiseArray.then) {
          promiseArray[i]
            .then((resolvedValue) => {
              promiesResolved[i] = {
                status: "fulfilled",
                value: resolvedValue,
              };
              if (promiesResolved.length == promiseArray.length) {
                resolve(promiesResolved);
              }
            })
            .catch((rejectReason) => {
              promiesResolved[i] = { status: "rejected", reason: rejectReason };
              if (promiesResolved.length == promiseArray.length) {
                resolve(promiesResolved);
              }
            });
        } else {
          promiesResolved[i] = promiseArray[i];
          if (promiesResolved.length == promiseArray.length) {
            resolve(promiesResolved);
          }
        }
      }
    });
  }
  /*
    myAny is polyfill for promise.any
    which neccessarily calls all the promises
    waits for the first to resolve and returns the 
    values of it calling then on it
  */
  myAny(promiseArray) {
    let promiesResolved = [];
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseArray.length; i++) {
        if (promiseArray.then) {
          promiseArray[i]
            .then((resolvedValue) => {
              resolve(resolvedValue);
            })
            .catch((rejectReason) => {});
        } else {
          promiesResolved = promiseArray[i];
          resolve(resolvedValue);
        }
      }
    });
  }
  /*
    myRace is polyfill for promise.any
    which neccessarily calls all the promises
    waits for the first to resolve and returns the 
    values of it calling then on it but only diff it
    has with any is that it calls resolve even after first
    reject
  */
  myRace(promiseArray) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseArray.length; i++) {
        if (promiseArray.then) {
          promiseArray[i]
            .then((resolvedValue) => {
              resolve(resolvedValue);
            })
            .catch((rejectReason) => {
              reject(rejectReason);
            });
        } else {
          resolve(promiseArray[i]);
        }
      }
    });
  }
}

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("resolved with value");
  }, 2000);
});
p1.then((argvalue) => {
  console.log("successfully returned", argvalue);
}).catch((argvalue) => {
  console.log("successfully rejected", argvalue);
});

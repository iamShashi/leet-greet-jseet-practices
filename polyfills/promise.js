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
      this.successCallbacks.forEach((callback) => callback(argvalue));
    };
    /* 
        we wait till the resolve is called inside
        promise and the we set the state as rejected and call 
        the callbacks pushed to errorCallback with argvalue
      */
    const reject = (argvalue) => {
      if (this.promiseState == "pending") this.promiseState = "rejected";
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
  then(successCallback) {
    /*
        you return new Promise for every then executed since
        1. there is no direct connect between then and catch but through this
        promise class only. so then returns a promise which has a catch function 
        as well.
        2. you wish to allow chaining of the promises.
    */
    return new MyPromise((resolve, reject) => {
      /*
        the real magic is in a push array you can push anything a function or 
        a value now we are pushing in a wrapper function for our callback
        which executes the function gets the result and then calls resolve
        with the same result the arg value is passed on from top when resolved is called
    */
      this.successCallbacks.push((argvalue) => {
        const result = successCallback(argvalue);
        resolve(result);
      });
    });
  }
  catch(errorCallback) {
    /*
        the real magic is in a push array you can push anything a function or 
        a value now we are pushing in a wrapper function for our callback
        which executes the function gets the result and then calls resolve
        with the same result the arg value is passed on from top when resolved is called
    */
    return new MyPromise((resolve, reject) => {
      this.successCallbacks.push((argvalue) => {
        const result = errorCallback(argvalue);
        reject(result);
      });
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

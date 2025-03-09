/* Quicksort thought process 
    given an array of any length you pick
    one pivot element and run through the array
    you push all the smallest elements to the left array
    and all the biggest elements to the right array
    you only run loop to your array except pivot element.
    And then keep calling quick sort on the left array
    and right array having a final return when or if arr.length < 2
    i.e array is smaller then 2 in length as it would
    have no meaning to run it on it
*/

function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  let pivot = arr[arr.length - 1];
  let leftArr = [];
  let rightArr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
    } else rightArr.push(arr[i]);
  }
  const sortedLeftArr = quickSort(leftArr);
  const sortedRightArr = quickSort(rightArr);
  return [...sortedLeftArr, pivot, ...sortedRightArr];
}

let sortThisArray = [4, 2, 1, 2, 8, 97, 6, 5];

console.log(quickSort(sortThisArray));

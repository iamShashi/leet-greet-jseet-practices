/*
    Merge sort thought prcoess
    Given an array divide the array in half
    now compare the divided the array
    and merge it into one array
    
*/

function mergeSort(mergeSortArray) {
  let arrayLeft = [],
    arrayRight = [];
  if (mergeSortArray.length < 2) {
    return mergeSortArray;
  }
  if (mergeSortArray.length % 2 == 0) {
    arrayLeft = mergeSortArray.slice(0, Math.floor(mergeSortArray.length / 2));
    arrayRight = mergeSortArray.slice(
      Math.floor(mergeSortArray.length / 2),
      mergeSortArray.length
    );
  } else {
    arrayLeft = mergeSortArray.slice(0, Math.floor(mergeSortArray.length / 2));
    arrayRight = mergeSortArray.slice(
      Math.floor(mergeSortArray.length / 2),
      mergeSortArray.length
    );
  }

  const sortedLeft = mergeSort(arrayLeft);
  const sortedRight = mergeSort(arrayRight);
  let i = 0;
  let j = 0;
  const mergedArray = [];
  while (i < sortedLeft.length && j < sortedRight.length) {
    if (sortedLeft[i] <= sortedRight[j]) {
      mergedArray.push(sortedLeft[i]);
      i++;
      continue;
    }
    if (sortedLeft[i] >= sortedRight[j]) {
      mergedArray.push(sortedRight[j]);
      j++;
      continue;
    }
  }
  if (i !== sortedLeft.length) {
    for (let k = i; k < sortedLeft.length; k++) {
      mergedArray.push(sortedLeft[k]);
    }
  }
  if (j !== sortedRight.length) {
    for (let k = j; k < sortedRight.length; k++) {
      mergedArray.push(sortedRight[k]);
    }
  }
  return mergedArray;
}

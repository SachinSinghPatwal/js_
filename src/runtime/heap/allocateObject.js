export function allocateObject(heap, object) {
  // console.log("Heap received:", heap);
  // console.log("Object:", object);
  return heap.allocate(object);
}

export function allocateObject(heap, object, typeTag = 'Object') {
  return heap.allocate(object, typeTag);
}

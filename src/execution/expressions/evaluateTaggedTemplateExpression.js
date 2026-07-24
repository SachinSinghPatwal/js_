import { evaluateExpression } from "./evaluateExpression.js";
import { allocateArray } from "../../runtime/heap/allocateArray.js";
import { callFunction } from "../../runtime/function/callFunction.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateTaggedTemplateExpression(node, executionContextStack, heap) {
  const tag = evaluateExpression(node.tag, executionContextStack, heap);
  
  if (!tag || typeof tag !== "object" || !tag.code) {
    throw new TypeError("Tagged template expression tag is not a function");
  }

  // Create the template strings array object
  // It has a .raw property which is also an array.
  const stringsArr = [];
  const rawArr = [];
  
  for (const quasi of node.quasi.quasis) {
    stringsArr.push(quasi.value.cooked);
    rawArr.push(quasi.value.raw);
  }

  const rawAddress = allocateArray(heap, rawArr);
  const rawObj = getHeapValue(heap, rawAddress);
  Object.freeze(rawObj);

  const stringsAddress = allocateArray(heap, stringsArr);
  const stringsObj = getHeapValue(heap, stringsAddress);
  stringsObj.raw = rawObj;
  Object.freeze(stringsObj);

  const args = [stringsAddress];
  
  // Evaluate template expressions
  for (const expr of node.quasi.expressions) {
    args.push(evaluateExpression(expr, executionContextStack, heap));
  }

  // Call the tag function
  let thisValue = undefined;
  
  if (node.tag.type === "MemberExpression") {
    const objectAddress = evaluateExpression(node.tag.object, executionContextStack, heap);
    thisValue = objectAddress;
  }

  return callFunction(tag, args, executionContextStack, heap, thisValue);
}

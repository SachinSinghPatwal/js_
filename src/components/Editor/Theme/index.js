const name = "Sachin";
let age = 22;

function greet(user) {
  if (user) {
    return `Hello ${user}`;
  }
  return null;
}

class Human {

}

class Person extends Human {}

const obj = {
  a: 10,
  b() {},
};

console.log(name,age,greet,Person,Human , obj);

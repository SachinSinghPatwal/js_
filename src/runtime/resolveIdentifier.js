export function resolveIdentifier(name, lexicalEnvironment) {
  let current = lexicalEnvironment;

  while (current !== null) {
    const binding = current.environmentRecord.bindings.get(name);

    if (binding) {
      return binding;
    }

    current = current.outer;
  }

  throw new ReferenceError(`${name} is not defined`);
}

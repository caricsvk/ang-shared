export function defineProperty(context: any, key: string, setter?: (newValue: any) => any, enumerable = true) {
  const properties: PropertyDescriptorMap = {};
  const hiddenProperty = '_' + key;
  properties[hiddenProperty] = {writable: true, enumerable: false};
  properties[key] = {
    get: () => context[hiddenProperty],
    set: (newValue: any) => context[hiddenProperty] = typeof setter === 'function' ? setter(newValue) : newValue,
    enumerable
  };
  Object.defineProperties(context, properties);
}

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
global.XMLHttpRequest = undefined;

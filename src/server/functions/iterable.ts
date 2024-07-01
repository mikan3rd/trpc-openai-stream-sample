export const iterablePromise = async function* () {
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    yield i;
  }
};

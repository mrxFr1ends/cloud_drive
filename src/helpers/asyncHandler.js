export const asyncHandler = fn => (...args) =>
    Promise
        .resolve(fn(...args))
        .catch(args[args.length - 1]);
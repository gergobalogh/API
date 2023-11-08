export default {
    logDb: (message: string) => console.log('%c' + message + '\n', 'color: blue'),
    logGpt: (message: string) => console.log('%c' + message + '\n', 'color: green'),
    logError: (message: string) => console.log('%c' + message + '\n', 'color: red')
}
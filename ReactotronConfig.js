import Reactotron from 'reactotron-react-native'
// import { reactotronRedux } from 'reactotron-redux'

const reactotron = Reactotron
  .configure({host: '192.168.0.14'}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  // .use(reactotronRedux())
  .connect() // let's connect!

  export default reactotron
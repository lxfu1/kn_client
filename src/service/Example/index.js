import resource from 'resource'
import API from 'api'

class ExampleService {
  getData = () => {
    return resource.get(API.exampleApi.get).then(res => {})
  }
}

export default new ExampleService()

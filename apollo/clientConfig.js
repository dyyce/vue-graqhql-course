import { InMemoryCache } from "apollo-cache-inmemory";
export default function(context) {
  return {
    httpLinkOptions: {
      uri: "https://vuejs-graphql-course.herokuapp.com/v1/graphql",
      credentials: "same-origin"
    },
    cache: new InMemoryCache(),
    wsEndpoint: "ws://vuejs-graphql-course.herokuapp.com/v1/graphql"
  };
}

<template>
  <div class="flex items-center flex-col">
    <div class="mx-auto rounded shadow-md p-4">
      <h1 class="text-4xl">Vuejs and GraphQL</h1>
    </div>

    <div class="block mt-4">
      <input
        class="mb-6 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        v-model="dValue"
        @keydown.enter="_handleEnterPressed"
      />

      <transition-group
        name="list"
        class="results flex flex-col items-center"
        tag="p"
      >
        <span
          v-for="post in dPosts"
          :key="post.id"
          class="mb-2 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 cursor-pointer"
          @click="_handlePostClicked(post)"
          >{{ post.title }}</span
        >
      </transition-group>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import insertPost from "~/apollo/mutations/insertPost";
import deletePost from "~/apollo/mutations/deletePost";
import postQuery from "~/apollo/queries/fetchPost";
import postSubscription from "~/apollo/subscriptions/subscribePost";

export default {
  apollo: {
    post: {
      // subscription
      subscribeToMore: {
        document: postSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData: { data } }) => {
          // Here, return the new result from the previous with the new data
          return data;
        }
      },

      // query
      query: postQuery,
      prefetch: true,
      result({ data: { post } }) {
        this.dPosts = post;
      }
    }
  },

  data() {
    return {
      dValue: "",
      dPosts: []
    };
  },

  methods: {
    _handleEnterPressed() {
      this.$apollo.mutate({
        mutation: insertPost,
        variables: {
          objects: [{ title: this.dValue }]
        }
      });
      this.dValue = "";
    },
    _handlePostClicked(post) {
      console.log("I clicked the post:", post.title, post.id);
      this.$apollo.mutate({
        mutation: deletePost,
        variables: {
          id: post.id
        }
      });
    }
  }
};
</script>

<style scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>

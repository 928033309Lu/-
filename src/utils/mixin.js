const mixin = {
    mounted() {
        if (!sessionStorage.getItem(this.$route.params.projectId + "fileInfo")) {
            this.$store.commit('delRouteList', this.$store.state.routeList.length - 1);
            this.$router.push({name: 'upload', params: this.$route.params, query: this.$route.query});
        }
    }
};
export {mixin};

<template>
  <router-view />
</template>

<script>
import { mapState } from "vuex";
export default {
  computed :{
    ...mapState({
      authorityMode: function (state) {
        return state.projectInfo.authorityMode
      }
    })
  },
  mounted(){
    if (this.$route.path.indexOf('/edit') != -1) {
      // mytodo
      if (this.authorityMode != 'edit'){
        this.$router.replace("/authArror")
      }
    }
  }
};
</script>

<style lang="less" scoped></style>

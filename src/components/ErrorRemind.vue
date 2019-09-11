<template>
  <div class="error-remind" v-if="options.show">
    <div class="msg">
      <div class="msg-title bg-danger pl-2">
        <span class="h6 mb-0 text-light">错误提醒</span>
        <span class="icon iconfont iconcross-fill text-light" @click="errorClose()"></span>
      </div>
      <div class="msg-content bg-light pt-3">
        <p>
          错误码：{{options.code}}
        </p>
        <p>错误信息：{{options.msg}}</p>
      </div>
      <div class="msg-footer bg-light">
        <b-btn size="sm" variant="warning light pl-5 pr-5">请重试</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ErrorRemind',
    props: {
      options: {
        type: Object,
        default: function () {
          return {
            show: Boolean,
            code: String,
            msg: String
          }
        }
      },
    },
    methods: {
      errorClose() {
        this.$store.commit('remindChange',{show:false,code:'',msg:''})
      }
    }
  }
</script>

<style lang="scss">
.error-remind{
  background: rgba(66,66,66,0.5);
  z-index: 1999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .msg{
    width: 30vw;
    height: 20vw;
    .msg-title{
      height: 20%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .iconfont{
        height: 100%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 12%;
      }
    }
    .msg-content{
      height: 60%;
    }
    .msg-footer{
      height: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

}
</style>

<template>
  <div>
    <add-form :title="title" :sub='2'></add-form>
  </div>
</template>
<script>
import addForm from './addForm/addForm.vue'
export default {
  data() {
    return {
      title: '添加户型'
    }
  },
  components: {
    addForm
  }
}
</script>

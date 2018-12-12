<template>
  <div>
    <div
      ref="editor"
      style="text-align:left"
    ></div>
    {{this.editorContent}}
  </div>
</template>

<script>
  import WangEditor from "wangeditor";
  export default {
    name: "myEditor",
    model: {
      prop: "editorContent",
      event: "change"
    },
    props: {
      editorContent: { required: true }
    },
    mounted() {
      /*实例化*/
      var editor = new WangEditor(this.$refs.editor);
      /*设置上传图片*/
      editor.customConfig.uploadImgServer = "/upload/image/";
      editor.customConfig.uploadFileName = "fileToUpload";
      editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          var url = result.data;
          insertImg(url);
        }
      };
      /*绑定回馈事件*/
      editor.customConfig.onchange = html => {
        this.$emit("change", html);
      };
      /*创建编辑器*/
      editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'image',  // 插入图片
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
      ]
      editor.create();
      /*初始内容*/
      editor.txt.html(this.editorContent);
      editor.txt.append('<p>追加的内容</p>')

    }
  };
</script>